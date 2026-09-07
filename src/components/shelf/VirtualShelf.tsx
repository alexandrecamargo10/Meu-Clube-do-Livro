'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShelfData, ShelfTheme, BookItem, Role } from '@/types';
import { BookCard } from './BookCard';
import { Sparkles, Palette, Plus, Lock, Info, BookOpen } from 'lucide-react';

interface VirtualShelfProps {
  shelf: ShelfData;
  userRole?: Role;
  onBookClick?: (book: BookItem) => void;
  onAddBookClick?: () => void;
  onThemeChange?: (newTheme: ShelfTheme) => void;
}

export const VirtualShelf: React.FC<VirtualShelfProps> = ({
  shelf,
  userRole = 'FREE',
  onBookClick,
  onAddBookClick,
  onThemeChange,
}) => {
  const [currentTheme, setCurrentTheme] = useState<ShelfTheme>(shelf.theme || 'WOOD');
  const [showThemePicker, setShowThemePicker] = useState(false);

  const themeClasses: Record<ShelfTheme, { shelf: string; bg: string; name: string; isVip: boolean }> = {
    WOOD: {
      shelf: 'shelf-theme-wood',
      bg: 'bg-stone-900/60 border-stone-800',
      name: 'Madeira Clássica',
      isVip: false,
    },
    DARK: {
      shelf: 'shelf-theme-dark',
      bg: 'bg-slate-900/80 border-slate-800',
      name: 'Dark Obsidian',
      isVip: true,
    },
    NEON: {
      shelf: 'shelf-theme-neon',
      bg: 'bg-slate-950/90 border-cyan-900/50',
      name: 'Cyberpunk Neon',
      isVip: true,
    },
    VINTAGE: {
      shelf: 'shelf-theme-vintage',
      bg: 'bg-amber-950/40 border-amber-900/50',
      name: 'Biblioteca Época',
      isVip: true,
    },
  };

  const handleThemeSelect = (theme: ShelfTheme) => {
    // Se o tema for VIP e o usuário for FREE, sinaliza upgrade
    if (themeClasses[theme].isVip && userRole === 'FREE') {
      alert('Os temas de estante Dark, Neon e Vintage são exclusivos dos planos LEITOR PLUS e LEITOR MASTER!');
      return;
    }
    setCurrentTheme(theme);
    if (onThemeChange) onThemeChange(theme);
    setShowThemePicker(false);
  };

  // Dividir livros em prateleiras de até 4 itens por prateleira para visual realista
  const BOOKS_PER_ROW = 4;
  const rows: BookItem[][] = [];
  for (let i = 0; i < shelf.books.length; i += BOOKS_PER_ROW) {
    rows.push(shelf.books.slice(i, i + BOOKS_PER_ROW));
  }

  // Garantir pelo menos 1 linha se a estante estiver vazia
  if (rows.length === 0) {
    rows.push([]);
  }

  const isFreeTierLimitReached = userRole === 'FREE' && shelf.books.length >= 30;

  return (
    <div className={`rounded-2xl p-6 border shadow-2xl transition-all duration-500 ${themeClasses[currentTheme].bg}`}>
      
      {/* Shelf Header & Control Tools */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-black text-white tracking-tight">{shelf.name}</h3>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
              {shelf.books.length} {shelf.books.length === 1 ? 'Obra' : 'Obras'}
            </span>
          </div>
          {shelf.description && (
            <p className="text-xs text-slate-400 mt-1">{shelf.description}</p>
          )}
        </div>

        {/* Theme Picker & Add Book Buttons */}
        <div className="flex items-center gap-2">
          {/* Seletor de Tema */}
          <div className="relative">
            <button
              onClick={() => setShowThemePicker(!showThemePicker)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition"
            >
              <Palette className="h-4 w-4 text-amber-400" />
              <span>Tema: {themeClasses[currentTheme].name}</span>
            </button>

            {/* Dropdown de Temas */}
            <AnimatePresence>
              {showThemePicker && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-900 border border-slate-800 p-2 shadow-2xl z-30 space-y-1"
                >
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
                    Temas da Estante
                  </p>
                  {(Object.keys(themeClasses) as ShelfTheme[]).map((themeKey) => {
                    const themeObj = themeClasses[themeKey];
                    const isLocked = themeObj.isVip && userRole === 'FREE';

                    return (
                      <button
                        key={themeKey}
                        onClick={() => handleThemeSelect(themeKey)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition ${
                          currentTheme === themeKey
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className={`w-3 h-3 rounded-full ${
                            themeKey === 'WOOD' ? 'bg-amber-700' :
                            themeKey === 'DARK' ? 'bg-slate-800' :
                            themeKey === 'NEON' ? 'bg-cyan-500' : 'bg-amber-900'
                          }`} />
                          {themeObj.name}
                        </span>
                        {isLocked ? (
                          <span className="flex items-center gap-1 text-[10px] text-amber-400 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800">
                            <Lock className="h-3 w-3" /> VIP
                          </span>
                        ) : (
                          currentTheme === themeKey && <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                        )}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Botão Adicionar Livro */}
          {onAddBookClick && (
            <button
              onClick={onAddBookClick}
              disabled={isFreeTierLimitReached}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition shadow-lg ${
                isFreeTierLimitReached
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-900/30'
              }`}
            >
              <Plus className="h-4 w-4" />
              <span>Adicionar Obra</span>
            </button>
          )}
        </div>
      </div>

      {/* Aviso de Limite do Plano Free */}
      {userRole === 'FREE' && (
        <div className="mb-6 flex items-center justify-between p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Info className="h-4 w-4 text-amber-400 shrink-0" />
            <span>
              Plano FREE: <strong>{shelf.books.length}/30 obras</strong> nesta estante. Assine o <strong>Leitor Plus</strong> para ter estantes e livros ilimitados!
            </span>
          </div>
        </div>
      )}

      {/* Prateleiras com Efeito Visual 3D */}
      <div className="space-y-12 py-4">
        {rows.map((rowBooks, rowIndex) => (
          <div key={rowIndex} className="relative pt-6">
            
            {/* Livros alinhados na prateleira */}
            <div className="flex items-end justify-start gap-4 sm:gap-8 px-4 sm:px-8 min-h-[190px]">
              {rowBooks.length > 0 ? (
                rowBooks.map((book) => (
                  <BookCard key={book.id} book={book} onClick={onBookClick} />
                ))
              ) : (
                <div className="w-full py-8 text-center text-slate-500 text-xs flex flex-col items-center gap-2">
                  <BookOpen className="h-8 w-8 text-slate-700 stroke-1" />
                  <p>Sua prateleira está vazia. Adicione livros ou mangás!</p>
                </div>
              )}
            </div>

            {/* Prateleira 3D Base (Madeira, Neon, Dark, Vintage) */}
            <div className={`w-full h-5 rounded-sm ${themeClasses[currentTheme].shelf}`} />
          </div>
        ))}
      </div>
    </div>
  );
};
