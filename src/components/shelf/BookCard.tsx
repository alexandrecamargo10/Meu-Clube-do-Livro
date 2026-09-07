'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star, BookOpen, CheckCircle, Bookmark, AlertCircle } from 'lucide-react';
import { BookItem } from '@/types';

interface BookCardProps {
  book: BookItem;
  onClick?: (book: BookItem) => void;
}

export const BookCard: React.FC<BookCardProps> = ({ book, onClick }) => {
  const getStatusBadge = () => {
    switch (book.status) {
      case 'READING':
        return { label: 'Lendo', icon: BookOpen, bg: 'bg-blue-600 text-blue-100' };
      case 'READ':
        return { label: 'Lido', icon: CheckCircle, bg: 'bg-emerald-600 text-emerald-100' };
      case 'ABANDONED':
        return { label: 'Pausado', icon: AlertCircle, bg: 'bg-rose-600 text-rose-100' };
      default:
        return { label: 'Quero Ler', icon: Bookmark, bg: 'bg-amber-600 text-amber-100' };
    }
  };

  const statusInfo = getStatusBadge();
  const StatusIcon = statusInfo.icon;

  const progressPercent =
    book.pageCount && book.currentPage
      ? Math.min(100, Math.round((book.currentPage / book.pageCount) * 100))
      : 0;

  return (
    <motion.div
      whileHover={{ y: -16, scale: 1.05, rotateY: -6 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick && onClick(book)}
      className="group relative cursor-pointer flex flex-col items-center select-none perspective-1000"
    >
      {/* Capa com efeito 3D de Lombada/Prateleira */}
      <div className="relative w-28 h-40 sm:w-32 sm:h-44 rounded-r-md shadow-xl overflow-hidden border-r-2 border-slate-700 bg-slate-900 group-hover:shadow-2xl transition-all duration-300">
        
        {/* Lombada falsa na esquerda */}
        <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-gradient-to-r from-slate-950/80 via-slate-800/40 to-transparent z-10" />

        {/* Imagem da Capa */}
        <Image
          src={book.coverUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=450&fit=crop'}
          alt={book.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Badge de Status de Leitura */}
        <div className="absolute top-2 right-2 z-10">
          <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold shadow-md ${statusInfo.bg}`}>
            <StatusIcon className="h-3 w-3" />
            {statusInfo.label}
          </span>
        </div>

        {/* Badge de Tipo (Mangá / HQ / Livro) */}
        <div className="absolute bottom-2 left-2 z-10">
          <span className="px-1.5 py-0.5 rounded bg-slate-950/80 backdrop-blur-sm text-[9px] font-mono text-slate-300 uppercase tracking-widest border border-slate-700">
            {book.type}
          </span>
        </div>

        {/* Barra de Progresso de Leitura */}
        {book.status === 'READING' && (
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-950/80 z-10">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}
      </div>

      {/* Título, Autor e Avaliação abaixo do livro na prateleira */}
      <div className="mt-2 text-center w-32 px-1">
        <h4 className="text-xs font-bold text-slate-200 truncate group-hover:text-amber-400 transition">
          {book.title}
        </h4>
        <p className="text-[11px] text-slate-400 truncate mt-0.5">{book.authors}</p>
        
        {/* Avaliação em Estrelas */}
        {book.rating && book.rating > 0 && (
          <div className="flex items-center justify-center gap-0.5 mt-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-3 w-3 ${
                  star <= (book.rating || 0)
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-slate-700'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};
