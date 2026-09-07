'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, Layers, Check } from 'lucide-react';
import { ShelfData, BookSearchResult } from '@/types';

interface SelectShelfModalProps {
  isOpen: boolean;
  onClose: () => void;
  shelves: ShelfData[];
  book: BookSearchResult | null;
  onSelectShelf: (shelfId: string, book: BookSearchResult) => void;
}

export const SelectShelfModal: React.FC<SelectShelfModalProps> = ({
  isOpen,
  onClose,
  shelves,
  book,
  onSelectShelf,
}) => {
  if (!isOpen || !book) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-slate-700/80 p-6 sm:p-8 shadow-2xl space-y-5"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Layers className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">Escolha a Estante</h3>
                <p className="text-xs text-slate-400 mt-0.5">Onde deseja guardar esta obra?</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center gap-3">
            <BookOpen className="h-5 w-5 text-amber-400 shrink-0" />
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-white truncate">{book.title}</h4>
              <p className="text-[11px] text-slate-400 truncate">{book.authors}</p>
            </div>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {shelves.map((shelf) => {
              const alreadyHas = shelf.books.some((b) => b.id === book.id || b.title === book.title);
              return (
                <button
                  key={shelf.id}
                  onClick={() => {
                    onSelectShelf(shelf.id, book);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-950/40 hover:bg-amber-500/15 border border-slate-800 hover:border-amber-500/40 transition text-left group"
                >
                  <div>
                    <h5 className="text-xs font-bold text-slate-200 group-hover:text-amber-300 transition">
                      {shelf.name}
                    </h5>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      {shelf.books.length} {shelf.books.length === 1 ? 'livro' : 'livros'}
                    </p>
                  </div>

                  {alreadyHas ? (
                    <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                      <Check className="h-3.5 w-3.5" /> Já adicionado
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-amber-400 group-hover:translate-x-1 transition-transform">
                      Selecionar →
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
