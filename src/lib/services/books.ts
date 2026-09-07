import { BookSearchResult, BookType } from '@/types';

/**
 * Função de busca cliente que consome a API Route interna do Next.js (/api/books/search)
 * A API Route unifica e gerencia o fallback entre Google Books API, Open Library API, MangaDex API e Jikan MAL API.
 */
export async function searchBooksMultiApi(
  query: string,
  typeFilter: 'ALL' | BookType = 'ALL'
): Promise<BookSearchResult[]> {
  if (!query || query.trim().length === 0) return [];

  try {
    const response = await fetch(
      `/api/books/search?q=${encodeURIComponent(query)}&type=${encodeURIComponent(typeFilter)}`
    );

    if (response.ok) {
      const data: BookSearchResult[] = await response.json();
      return data;
    } else {
      console.error(`[searchBooksMultiApi] API route retornou status: ${response.status}`);
    }
  } catch (error) {
    console.error('[searchBooksMultiApi] Erro na requisição:', error);
  }

  return [];
}
