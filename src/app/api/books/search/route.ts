import { NextRequest, NextResponse } from 'next/server';
import { BookSearchResult, BookType } from '@/types';

// Duração do cache no Next.js (24 horas em segundos)
const CACHE_REVALIDATE_SECONDS = 86400;
// Timeout máximo para APIs lentas (2.8 segundos)
const FETCH_TIMEOUT_MS = 2800;

interface FetchWithTimeoutOptions extends RequestInit {
  timeoutMs?: number;
}

/**
 * Fetch com AbortController para não travar a busca caso uma API externa esteja lenta
 */
async function fetchWithTimeout(url: string, options: FetchWithTimeoutOptions = {}) {
  const { timeoutMs = FETCH_TIMEOUT_MS, ...fetchOptions } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(id);
  }
}

/**
 * API Route de Busca Otimizada:
 * - Execução Paralela com Promise.allSettled
 * - Timeout estrito de 2.8s para evitar esperas longas
 * - Cache automático de 24h via next: { revalidate: 86400 }
 * - Limite ampliado para 20-30 resultados por consulta
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  let query = (searchParams.get('q') || '').trim();
  const rawType = searchParams.get('type') || 'ALL';
  const typeFilter = (['ALL', 'BOOK', 'MANGA', 'COMIC'].includes(rawType) ? rawType : 'ALL') as 'ALL' | BookType;

  // Proteção contra payloads gigantes e DoS
  if (!query || query.length > 120) {
    query = query.slice(0, 120);
  }

  if (!query.trim()) {
    return NextResponse.json([]);
  }

  const results: BookSearchResult[] = [];
  const seenTitles = new Set<string>();

  const addResult = (item: BookSearchResult) => {
    // Chave de desduplicação simples por título e autor normalizados
    const cleanTitle = item.title.toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanAuthor = item.authors.toLowerCase().replace(/[^a-z0-9]/g, '');
    const key = `${cleanTitle}_${cleanAuthor.slice(0, 10)}`;

    if (!seenTitles.has(key)) {
      seenTitles.add(key);
      results.push(item);
    }
  };

  const headers = {
    'User-Agent': 'MeuClubeDoLivro/1.0 (contato@meuclubedolivro.com)',
    'Accept': 'application/json',
  };

  // Array de promessas para disparar em paralelo absoluto
  const tasks: Promise<any>[] = [];

  // ==========================================================================
  // 1. LIVROS E HQs (Disparo Paralelo: Google Books + Open Library)
  // ==========================================================================
  if (typeFilter === 'ALL' || typeFilter === 'BOOK' || typeFilter === 'COMIC') {
    // Tarefa A: Google Books API (com suporte a API Key opcional)
    tasks.push(
      (async () => {
        try {
          const apiKeyParam = process.env.GOOGLE_BOOKS_API_KEY
            ? `&key=${process.env.GOOGLE_BOOKS_API_KEY}`
            : '';
          const gBooksUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
            query
          )}&maxResults=15&printType=books${apiKeyParam}`;

          const res = await fetchWithTimeout(gBooksUrl, {
            headers,
            next: { revalidate: CACHE_REVALIDATE_SECONDS },
          });

          if (res.ok) {
            const data = await res.json();
            if (data.items && Array.isArray(data.items)) {
              data.items.forEach((item: any) => {
                const info = item.volumeInfo || {};
                const imageLinks = info.imageLinks || {};
                const coverUrl =
                  imageLinks.thumbnail?.replace('http:', 'https:') ||
                  imageLinks.smallThumbnail?.replace('http:', 'https:') ||
                  'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=450&fit=crop';

                const categoryStr = (info.categories || []).join(' ').toLowerCase();
                const isComic = categoryStr.includes('comic') || categoryStr.includes('graphic novel');

                addResult({
                  id: `gbook_${item.id}`,
                  title: info.title || 'Título Desconhecido',
                  authors: info.authors ? info.authors.join(', ') : 'Autor Desconhecido',
                  coverUrl,
                  synopsis: info.description || 'Sem sinopse disponível.',
                  pageCount: info.pageCount || 200,
                  publishedYear: info.publishedDate ? parseInt(info.publishedDate.substring(0, 4)) : undefined,
                  type: isComic ? 'COMIC' : 'BOOK',
                  isbn: info.industryIdentifiers?.[0]?.identifier,
                });
              });
            }
          }
        } catch {
          // Timeout ou erro tratado silenciosamente para não quebrar outras APIs
        }
      })()
    );

    // Tarefa B: Open Library API (sempre em paralelo como catálogo abrangente)
    tasks.push(
      (async () => {
        try {
          const openLibUrl = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=15`;
          const res = await fetchWithTimeout(openLibUrl, {
            headers,
            next: { revalidate: CACHE_REVALIDATE_SECONDS },
          });

          if (res.ok) {
            const data = await res.json();
            if (data.docs && Array.isArray(data.docs)) {
              data.docs.forEach((doc: any, index: number) => {
                const authors = doc.author_name ? doc.author_name.join(', ') : 'Autor Desconhecido';
                const coverUrl = doc.cover_i
                  ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`
                  : 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=450&fit=crop';

                addResult({
                  id: `openlib_${doc.key?.replace('/works/', '') || index}`,
                  title: doc.title || query,
                  authors,
                  coverUrl,
                  synopsis: `Obra clássica registrada na Open Library. Primeira publicação em ${
                    doc.first_publish_year || 'ano não informado'
                  }.`,
                  pageCount: doc.number_of_pages_median || 220,
                  publishedYear: doc.first_publish_year,
                  type: 'BOOK',
                  isbn: doc.isbn?.[0],
                });
              });
            }
          }
        } catch {
          // Timeout ou erro ignorado com segurança
        }
      })()
    );
  }

  // ==========================================================================
  // 2. MANGÁS (Disparo Paralelo: MangaDex + Jikan)
  // ==========================================================================
  if (typeFilter === 'ALL' || typeFilter === 'MANGA') {
    // Tarefa C: MangaDex API (Oficial e Rápida)
    tasks.push(
      (async () => {
        try {
          const mangaDexUrl = `https://api.mangadex.org/manga?title=${encodeURIComponent(
            query
          )}&limit=10&includes[]=cover_art`;
          const res = await fetchWithTimeout(mangaDexUrl, {
            headers,
            next: { revalidate: CACHE_REVALIDATE_SECONDS },
          });

          if (res.ok) {
            const data = await res.json();
            if (data.data && Array.isArray(data.data)) {
              data.data.forEach((manga: any) => {
                const titleObj = manga.attributes.title || {};
                const title = titleObj.pt || titleObj.en || Object.values(titleObj)[0] || 'Mangá';

                const coverRel = manga.relationships?.find((r: any) => r.type === 'cover_art');
                const coverFileName = coverRel?.attributes?.fileName;
                const coverUrl = coverFileName
                  ? `https://uploads.mangadex.org/covers/${manga.id}/${coverFileName}`
                  : 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&auto=format&fit=crop&q=80';

                const descObj = manga.attributes.description || {};
                const synopsis =
                  descObj.pt || descObj.en || Object.values(descObj)[0] || 'Sem sinopse disponível.';

                addResult({
                  id: `mangadex_${manga.id}`,
                  title,
                  authors: 'Mangaká / Artista',
                  coverUrl,
                  synopsis: typeof synopsis === 'string' ? synopsis : 'Mangá cadastrado no MangaDex.',
                  pageCount: 190,
                  publishedYear: manga.attributes.year || undefined,
                  type: 'MANGA',
                });
              });
            }
          }
        } catch {
          // Timeout ignorado
        }
      })()
    );

    // Tarefa D: Jikan API (MyAnimeList - Timeout estrito de 2s para evitar 504)
    tasks.push(
      (async () => {
        try {
          const jikanUrl = `https://api.jikan.moe/v4/manga?q=${encodeURIComponent(query)}&limit=6`;
          const res = await fetchWithTimeout(jikanUrl, {
            headers,
            timeoutMs: 2000,
            next: { revalidate: CACHE_REVALIDATE_SECONDS },
          });

          if (res.ok) {
            const jikanData = await res.json();
            if (jikanData.data && Array.isArray(jikanData.data)) {
              jikanData.data.forEach((manga: any) => {
                const authorsList = manga.authors
                  ? manga.authors.map((a: any) => a.name).join(', ')
                  : 'Autor Desconhecido';

                addResult({
                  id: `manga_${manga.mal_id}`,
                  title: manga.title_japanese ? `${manga.title} (${manga.title_japanese})` : manga.title,
                  authors: authorsList,
                  coverUrl: manga.images?.jpg?.large_image_url || manga.images?.jpg?.image_url,
                  synopsis: manga.synopsis || 'Sem sinopse disponível para este mangá.',
                  pageCount: manga.chapters ? manga.chapters * 20 : 180,
                  publishedYear: manga.published?.from
                    ? new Date(manga.published.from).getFullYear()
                    : undefined,
                  type: 'MANGA',
                });
              });
            }
          }
        } catch {
          // Timeout ou 504 ignorado
        }
      })()
    );
  }

  // Executa todas as consultas em paralelo simultâneo
  await Promise.allSettled(tasks);

  // Fallback de demonstração apenas se nada for encontrado em nenhuma das APIs
  if (results.length === 0) {
    const fallbacks = getFallbackBookResults(query);
    fallbacks.forEach(addResult);
  }

  return NextResponse.json(results);
}

function getFallbackBookResults(query: string): BookSearchResult[] {
  const mockCatalog: BookSearchResult[] = [
    {
      id: 'mock_1',
      title: 'Duna',
      authors: 'Frank Herbert',
      coverUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80',
      synopsis: 'Num futuro distante, Paul Atreides deve viajar para o planeta mais perigoso do universo para garantir o futuro de sua família e seu povo.',
      pageCount: 680,
      publishedYear: 1965,
      type: 'BOOK',
    },
    {
      id: 'mock_2',
      title: 'One Piece - Vol. 1',
      authors: 'Eiichiro Oda',
      coverUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&auto=format&fit=crop&q=80',
      synopsis: 'Luffy inicia sua grande jornada pelos mares em busca do tesouro lendário One Piece para se tornar o Rei dos Piratas.',
      pageCount: 200,
      publishedYear: 1997,
      type: 'MANGA',
    },
    {
      id: 'mock_3',
      title: 'Watchmen: Edição Definitiva',
      authors: 'Alan Moore, Dave Gibbons',
      coverUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&auto=format&fit=crop&q=80',
      synopsis: 'Uma obra-prima das histórias em quadrinhos que desconstrói a figura dos super-heróis em um cenário geopolítico tenso.',
      pageCount: 416,
      publishedYear: 1986,
      type: 'COMIC',
    },
    {
      id: 'mock_4',
      title: 'Dom Casmurro',
      authors: 'Machado de Assis',
      coverUrl: 'https://covers.openlibrary.org/b/id/647501-L.jpg',
      synopsis: 'Um dos maiores clássicos da literatura brasileira. Bentinho narra sua história de amor com Capitu e suas crescentes desconfianças.',
      pageCount: 256,
      publishedYear: 1899,
      type: 'BOOK',
    },
    {
      id: 'mock_5',
      title: 'O Senhor dos Anéis: A Sociedade do Anel',
      authors: 'J.R.R. Tolkien',
      coverUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&auto=format&fit=crop&q=80',
      synopsis: 'Frodo Bolseiro herda um anel mágico que precisa ser destruído na Montanha da Perdição para salvar a Terra-média.',
      pageCount: 576,
      publishedYear: 1954,
      type: 'BOOK',
    },
    {
      id: 'mock_6',
      title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
      authors: 'Robert C. Martin',
      coverUrl: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777f?w=400&auto=format&fit=crop&q=80',
      synopsis: 'Um guia prático com princípios e padrões para produzir código limpo, legível e de fácil manutenção.',
      pageCount: 464,
      publishedYear: 2008,
      type: 'BOOK',
    }
  ];

  return mockCatalog.filter(
    (b) =>
      b.title.toLowerCase().includes(query.toLowerCase()) ||
      b.authors.toLowerCase().includes(query.toLowerCase())
  );
}
