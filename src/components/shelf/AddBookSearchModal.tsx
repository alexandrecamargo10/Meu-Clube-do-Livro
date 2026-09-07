'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Plus, Check, Loader2, BookOpen, Filter } from 'lucide-react';
import { searchBooksMultiApi } from '@/lib/services/books';
import { BookSearchResult, BookType, BookItem } from '@/types';
import { useNotification } from '@/components/ui/NotificationProvider';

interface AddBookSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  shelfName?: string;
  onBookSelected: (book: BookItem) => void;
}

export const AddBookSearchModal: React.FC<AddBookSearchModalProps> = ({
  isOpen,
  onClose,
  shelfName = 'Estante',
  onBookSelected,
}) => {
  const { toast } = useNotification();
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | BookType>('ALL');
  const [results, setResults] = useState<BookSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [addedIds, setAddedIds] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      setQuery('Duna');
      fetchResults('Duna', typeFilter);
    }
  }, [isOpen]);

  const fetchResults = async (q: string, filter: 'ALL' | BookType) => {
    if (!q.trim()) return;
    setIsLoading(true);
    try {
      const data = await searchBooksMultiApi(q, filter);
      setResults(data);
    } catch {
      toast('Erro na busca', 'Não foi possível carregar as obras.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchResults(query, typeFilter);
  };

  const handleSelect = (item: BookSearchResult) => {
    const newBook: BookItem = {
      id: item.id,
      title: item.title,
      authors: item.authors,
      coverUrl: item.coverUrl,
      synopsis: item.synopsis,
      pageCount: item.pageCount || 200,
      publishedYear: item.publishedYear,
      type: item.type,
      isbn: item.isbn,
      status: 'WANT_TO_READ',
      currentPage: 0,
      rating: 0,
    };

    setAddedIds((prev) => [...prev, item.id]);
    onBookSelected(newBook);
    toast('Obra Adicionada!', `"${item.title}" foi inserido em "${shelfName}".`, 'success');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          className="relative w-full max-w-3xl rounded-3xl bg-slate-900 border border-slate-700/80 p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] flex flex-col"
        >
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-xl font-black text-white">Adicionar à {shelfName}</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Pesquise e clique no livro ou mangá desejado para adicionar à sua prateleira
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Digite o título, autor ou mangá..."
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none transition shadow-inner"
              />
              <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
            </div>

            <div className="flex items-center bg-slate-950 border border-slate-700 rounded-xl px-1">
              {(['ALL', 'BOOK', 'MANGA', 'COMIC'] as const).map((filter) => (
                <button
                  type="button"
                  key={filter}
                  onClick={() => {
                    setTypeFilter(filter);
                    fetchResults(query, filter);
                  }}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition ${
                    typeFilter === filter
                      ? 'bg-amber-500 text-slate-950 shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {filter === 'ALL'
                    ? 'Todos'
                    : filter === 'BOOK'
                    ? 'Livros'
                    : filter === 'MANGA'
                    ? 'Mangás'
                    : 'HQs'}
                </button>
              ))}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="px-5 h-11 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition flex items-center gap-1.5 shadow"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <span>Buscar</span>}
            </button>
          </form>

          <div className="flex-1 overflow-y-auto pr-1 space-y-3 min-h-[260px]">
            {isLoading ? (
              <div className="py-16 text-center space-y-2">
                <Loader2 className="h-7 w-7 text-amber-400 animate-spin mx-auto" />
                <p className="text-xs text-slate-400">Buscando obras em tempo real...</p>
              </div>
            ) : results.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {results.map((item) => {
                  const isAdded = addedIds.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-3 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-amber-500/40 transition group"
                    >
                      <div className="relative w-14 h-20 rounded-lg overflow-hidden shrink-0 shadow bg-slate-900 border border-slate-700">
                        <Image
                          src={item.coverUrl}
                          alt={item.title}
                          fill
                          className="object-cover group-hover:scale-105 transition duration-300"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <span className="text-[9px] font-mono font-bold text-amber-400 uppercase tracking-widest">
                          {item.type}
                        </span>
                        <h4 className="text-xs font-bold text-white truncate group-hover:text-amber-300 transition">
                          {item.title}
                        </h4>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">{item.authors}</p>
                        <p className="text-[10px] text-slate-500 mt-1">
                          {item.pageCount ? `${item.pageCount} páginas` : 'Páginas n/d'}
                        </p>
                      </div>

                      <button
                        onClick={() => handleSelect(item)}
                        disabled={isAdded}
                        className={`p-2 rounded-xl text-xs font-bold shrink-0 transition ${
                          isAdded
                            ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                            : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md'
                        }`}
                      >
                        {isAdded ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-16 text-center text-slate-500 text-xs">
                Nenhum resultado encontrado para &quot;{query}&quot;.
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
