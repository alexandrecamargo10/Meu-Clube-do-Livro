'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Search, Filter, Plus, Check, Loader2, BookOpen, Star, Sparkles, Layers } from 'lucide-react';
import { searchBooksMultiApi } from '@/lib/services/books';
import { BookSearchResult, BookType, ShelfData } from '@/types';
import { BookModal } from '@/components/shelf/BookModal';
import { SelectShelfModal } from '@/components/shelf/SelectShelfModal';
import { useNotification } from '@/components/ui/NotificationProvider';

export default function SearchPage() {
  const [query, setQuery] = useState('Duna');
  const [typeFilter, setTypeFilter] = useState<'ALL' | BookType>('ALL');
  const [results, setResults] = useState<BookSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [addedBookIds, setAddedBookIds] = useState<string[]>([]);

  // Estantes disponíveis do usuário para escolha
  const [userShelves] = useState<ShelfData[]>([
    {
      id: 'shelf_1',
      name: '📖 Lendo Atualmente',
      theme: 'WOOD',
      isPublic: true,
      books: [],
      createdAt: new Date().toISOString(),
    },
    {
      id: 'shelf_2',
      name: '🏆 Favoritos inesquecíveis',
      theme: 'VINTAGE',
      isPublic: true,
      books: [],
      createdAt: new Date().toISOString(),
    },
    {
      id: 'shelf_3',
      name: '🎯 Quero Ler em Breve',
      theme: 'DARK',
      isPublic: true,
      books: [],
      createdAt: new Date().toISOString(),
    },
  ]);

  const [selectedBook, setSelectedBook] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Modal para perguntar em qual estante adicionar o livro
  const [pendingBookForShelf, setPendingBookForShelf] = useState<BookSearchResult | null>(null);
  const [isSelectShelfOpen, setIsSelectShelfOpen] = useState(false);

  const { toast } = useNotification();

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const data = await searchBooksMultiApi(query, typeFilter);
      setResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [typeFilter]);

  // Ao clicar em "Adicionar", pergunta em qual estante deseja salvar
  const handleInitiateAdd = (book: BookSearchResult) => {
    setPendingBookForShelf(book);
    setIsSelectShelfOpen(true);
  };

  const handleConfirmAddToShelf = (shelfId: string, book: BookSearchResult) => {
    const targetShelf = userShelves.find((s) => s.id === shelfId);
    setAddedBookIds((prev) => [...prev, book.id]);
    toast(
      'Adicionado à Estante!',
      `"${book.title}" foi guardado com sucesso na estante "${targetShelf?.name || 'sua estante'}".`,
      'success'
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header da Página */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-400">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Multi-API Catalog (Google Books + Jikan MAL)</span>
        </div>
        <h1 className="text-3xl font-black text-white">Explorar Obras</h1>
        <p className="text-xs text-slate-400">
          Pesquise no acervo unificado e selecione em qual das suas estantes virtuais deseja adicionar.
        </p>
      </div>

      {/* Formulário de Busca e Filtros */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
        
        <form onSubmit={handleSearch} className="flex-1 relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Digite o título, autor ou gênero (ex: Duna, One Piece, Watchmen...)"
            className="w-full h-12 pl-11 pr-28 rounded-2xl bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none transition shadow-lg"
          />
          <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-500" />
          <button
            type="submit"
            disabled={isLoading}
            className="absolute right-2 top-2 h-8 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shadow"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <span>Buscar</span>}
          </button>
        </form>

        {/* Filtro por Tipo */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 shrink-0">
          <Filter className="h-4 w-4 text-slate-500 ml-2" />
          {[
            { key: 'ALL', label: 'Todos' },
            { key: 'BOOK', label: 'Livros' },
            { key: 'MANGA', label: 'Mangás' },
            { key: 'COMIC', label: 'HQs' },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setTypeFilter(item.key as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                typeFilter === item.key
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

      </div>

      {/* Resultados da Busca */}
      {isLoading ? (
        <div className="py-20 text-center space-y-3">
          <Loader2 className="h-8 w-8 text-amber-500 animate-spin mx-auto" />
          <p className="text-xs text-slate-400">Consultando Google Books e Jikan API...</p>
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {results.map((item) => {
            const isAdded = addedBookIds.includes(item.id);
            return (
              <div
                key={item.id}
                className="group relative flex flex-col justify-between rounded-2xl bg-slate-900 border border-slate-800 p-4 hover:border-amber-500/40 transition shadow-xl"
              >
                <div
                  onClick={() => {
                    setSelectedBook(item);
                    setIsModalOpen(true);
                  }}
                  className="cursor-pointer space-y-3"
                >
                  <div className="relative w-full h-48 rounded-xl overflow-hidden shadow-md bg-slate-950">
                    <Image
                      src={item.coverUrl}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-300"
                    />
                    <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-slate-950/80 backdrop-blur-sm text-[9px] font-mono text-slate-300 uppercase border border-slate-700">
                      {item.type}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-white group-hover:text-amber-400 transition line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">{item.authors}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleInitiateAdd(item)}
                  className={`mt-4 w-full py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition ${
                    isAdded
                      ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                      : 'bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 border border-slate-700'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      <span>Na Estante</span>
                    </>
                  ) : (
                    <>
                      <Layers className="h-3.5 w-3.5" />
                      <span>Escolher Estante</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-16 text-center text-slate-500 text-xs">
          Nenhuma obra encontrada para &quot;{query}&quot;. Tente buscar por outro termo.
        </div>
      )}

      {/* Modal para Visualização/Anotações */}
      <BookModal
        book={selectedBook}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(updated) => {
          handleInitiateAdd(updated);
        }}
      />

      {/* Modal de Escolha da Estante */}
      <SelectShelfModal
        isOpen={isSelectShelfOpen}
        onClose={() => setIsSelectShelfOpen(false)}
        shelves={userShelves}
        book={pendingBookForShelf}
        onSelectShelf={handleConfirmAddToShelf}
      />
    </div>
  );
}
