'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShelfData, ShelfTheme, BookItem, Role, BookViewMode } from '@/types';
import { BookCard } from './BookCard';
import { Sparkles, Palette, Plus, Lock, Info, BookOpen, Box, Square } from 'lucide-react';
import { useNotification } from '@/components/ui/NotificationProvider';

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

  // Estado do Modelo de Visualização dos Livros:
  // MOCKUP_3D: Mockup inclinado com lombada, capa e miolo
  // FRONT_COVER: Capa de frente
  const [viewMode, setViewMode] = useState<BookViewMode>('MOCKUP_3D');

  // Mapeamento de estilos visuais realistas
  const themeClasses: Record<
    ShelfTheme,
    {
      plankClass: string;
      backdropClass: string;
      name: string;
      isVip: boolean;
      accentColor: string;
    }
  > = {
    WOOD: {
      plankClass: 'shelf-plank-wood',
      backdropClass: 'shelf-backdrop-wood',
      name: 'Madeira Nobre',
      isVip: false,
      accentColor: 'text-amber-400',
    },
    DARK: {
      plankClass: 'shelf-plank-dark',
      backdropClass: 'shelf-backdrop-dark',
      name: 'Dark Obsidian',
      isVip: true,
      accentColor: 'text-slate-300',
    },
    NEON: {
      plankClass: 'shelf-plank-neon',
      backdropClass: 'shelf-backdrop-neon',
      name: 'Cyberpunk Neon',
      isVip: true,
      accentColor: 'text-cyan-400',
    },
    VINTAGE: {
      plankClass: 'shelf-plank-vintage',
      backdropClass: 'shelf-backdrop-vintage',
      name: 'Biblioteca Época',
      isVip: true,
      accentColor: 'text-yellow-500',
    },
  };

  const { toast } = useNotification();

  const handleThemeSelect = (theme: ShelfTheme) => {
    if (themeClasses[theme].isVip && userRole === 'FREE') {
      toast(
        'Tema Exclusivo para Assinantes',
        'Os temas Dark Obsidian, Cyberpunk Neon e Biblioteca Época são exclusivos dos planos LEITOR PLUS e LEITOR MASTER.',
        'warning'
      );
      return;
    }
    setCurrentTheme(theme);
    if (onThemeChange) onThemeChange(theme);
    setShowThemePicker(false);
  };

  // Dividir livros em prateleiras (agora com tamanho proporcional acomodando 5 livros por linha confortavelmente)
  const BOOKS_PER_ROW = 5;
  const rows: BookItem[][] = [];
  for (let i = 0; i < shelf.books.length; i += BOOKS_PER_ROW) {
    rows.push(shelf.books.slice(i, i + BOOKS_PER_ROW));
  }

  if (rows.length === 0) {
    rows.push([]);
  }

  // Ângulos sutis de inclinação para cada livro no modo 3D
  const naturalTilts = [0, -1.8, 0, 2.2, -1.2, 0, 1.5, 0];

  const isFreeTierLimitReached = userRole === 'FREE' && shelf.books.length >= 30;
  const activeTheme = themeClasses[currentTheme];

  return (
    <div className={`relative rounded-3xl p-6 sm:p-8 shadow-2xl transition-all duration-700 overflow-hidden border ${activeTheme.backdropClass}`}>
      {/* Luz ambiente superior simulando iluminação direta de galeria/biblioteca */}
      <div className="absolute top-0 left-1/4 right-1/4 h-32 bg-gradient-to-b from-white/10 to-transparent blur-2xl pointer-events-none" />

      {/* Header da Estante */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-2xl font-black text-white tracking-tight drop-shadow-md">
              {shelf.name}
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/10 text-slate-200 border border-white/15 backdrop-blur-md shadow">
              {shelf.books.length} {shelf.books.length === 1 ? 'Volume' : 'Volumes'}
            </span>
          </div>
          {shelf.description && (
            <p className="text-xs text-slate-300/80 mt-1 font-medium">{shelf.description}</p>
          )}
        </div>

        {/* Ferramentas: Alternador de Modelo (3D vs Capa Frente), Seletor de Tema e Adicionar */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Alternador de Modo de Visualização dos Livros */}
          <div className="flex items-center bg-slate-900/90 border border-white/15 p-1 rounded-xl shadow-lg backdrop-blur-md">
            <button
              onClick={() => {
                setViewMode('MOCKUP_3D');
                toast('Modo 3D Ativado', 'Exibindo mockup volumétrico com lombada e miolo de páginas.', 'info');
              }}
              title="Visualização Mockup 3D Inclinado"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                viewMode === 'MOCKUP_3D'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Box className="h-3.5 w-3.5" />
              <span>Mockup 3D</span>
            </button>

            <button
              onClick={() => {
                setViewMode('FRONT_COVER');
                toast('Modo Capa de Frente Ativado', 'Exibindo capas de frente.', 'info');
              }}
              title="Visualização Capa de Frente"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                viewMode === 'FRONT_COVER'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Square className="h-3.5 w-3.5" />
              <span>Capa de Frente</span>
            </button>
          </div>

          {/* Seletor de Tema */}
          <div className="relative">
            <button
              onClick={() => setShowThemePicker(!showThemePicker)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-xs font-bold text-slate-200 border border-white/15 shadow-lg backdrop-blur-md transition"
            >
              <Palette className="h-4 w-4 text-amber-400" />
              <span>{activeTheme.name}</span>
            </button>

            {/* Dropdown de Temas */}
            <AnimatePresence>
              {showThemePicker && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="absolute right-0 mt-2 w-60 rounded-2xl bg-slate-900/95 border border-slate-700/80 p-2 shadow-2xl backdrop-blur-xl z-40 space-y-1"
                >
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1.5">
                    Acabamento da Estante
                  </p>
                  {(Object.keys(themeClasses) as ShelfTheme[]).map((themeKey) => {
                    const themeObj = themeClasses[themeKey];
                    const isLocked = themeObj.isVip && userRole === 'FREE';

                    return (
                      <button
                        key={themeKey}
                        onClick={() => handleThemeSelect(themeKey)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                          currentTheme === themeKey
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'text-slate-300 hover:bg-slate-800/70'
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <span
                            className={`w-3.5 h-3.5 rounded-full shadow-sm ${
                              themeKey === 'WOOD'
                                ? 'bg-amber-700'
                                : themeKey === 'DARK'
                                ? 'bg-slate-700'
                                : themeKey === 'NEON'
                                ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]'
                                : 'bg-yellow-700'
                            }`}
                          />
                          {themeObj.name}
                        </span>
                        {isLocked ? (
                          <span className="flex items-center gap-1 text-[10px] text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded-md border border-amber-700/60 font-bold">
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
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold transition shadow-xl ${
                isFreeTierLimitReached
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-900/40'
              }`}
            >
              <Plus className="h-4 w-4 stroke-[3]" />
              <span>Adicionar Obra</span>
            </button>
          )}
        </div>
      </div>

      {/* Aviso de Limite do Plano Free */}
      {userRole === 'FREE' && (
        <div className="mb-8 flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/70 border border-amber-500/20 text-xs backdrop-blur-md">
          <div className="flex items-center gap-2.5 text-slate-300">
            <Info className="h-4 w-4 text-amber-400 shrink-0" />
            <span>
              Plano FREE: <strong>{shelf.books.length}/30 obras</strong> nesta estante. Assine o <strong>Leitor Plus</strong> para ter estantes e volumes ilimitados!
            </span>
          </div>
        </div>
      )}

      {/* Prateleiras Físicas Volumétricas com os Livros no Modo Escolhido */}
      <div className="space-y-16 py-4">
        {rows.map((rowBooks, rowIndex) => (
          <div key={rowIndex} className="relative pt-6">
            {/* Livros Apoiados na Prateleira */}
            <div className="flex items-end justify-start gap-2 sm:gap-4 px-2 sm:px-6 min-h-[220px]">
              {rowBooks.length > 0 ? (
                rowBooks.map((book, bookIdx) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    onClick={onBookClick}
                    viewMode={viewMode}
                    tiltAngle={viewMode === 'MOCKUP_3D' ? naturalTilts[(rowIndex * BOOKS_PER_ROW + bookIdx) % naturalTilts.length] : 0}
                  />
                ))
              ) : (
                <div className="w-full py-12 text-center text-slate-400 text-xs flex flex-col items-center gap-3">
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                    <BookOpen className="h-7 w-7 text-slate-400 stroke-[1.5]" />
                  </div>
                  <p className="font-medium text-slate-400">Esta prateleira está vazia. Adicione novas obras!</p>
                </div>
              )}
            </div>

            {/* Prancha 3D da Prateleira */}
            <div className={`w-full ${activeTheme.plankClass}`} />
          </div>
        ))}
      </div>
    </div>
  );
};
