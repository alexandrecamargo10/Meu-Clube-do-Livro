'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, BookOpen, CheckCircle, Bookmark, AlertCircle, Save, Trash2 } from 'lucide-react';
import { BookItem, ReadingStatus } from '@/types';

interface BookModalProps {
  book: BookItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (updatedBook: BookItem) => void;
  onRemove?: (bookId: string) => void;
}

export const BookModal: React.FC<BookModalProps> = ({
  book,
  isOpen,
  onClose,
  onSave,
  onRemove,
}) => {
  if (!isOpen || !book) return null;

  const [status, setStatus] = useState<ReadingStatus>(book.status || 'WANT_TO_READ');
  const [currentPage, setCurrentPage] = useState<number>(book.currentPage || 0);
  const [rating, setRating] = useState<number>(book.rating || 0);
  const [notes, setNotes] = useState<string>(book.notes || '');

  const pageCount = book.pageCount || 200;
  const progressPercent = Math.min(100, Math.round((currentPage / pageCount) * 100));

  const handleSave = () => {
    if (onSave) {
      onSave({
        ...book,
        status,
        currentPage,
        rating,
        notes,
      });
    }
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl"
        >
          {/* Header do Modal */}
          <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
              {book.type === 'MANGA' ? 'Mangá' : book.type === 'COMIC' ? 'História em Quadrinhos' : 'Livro'}
            </span>
            <button
              onClick={onClose}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6 max-h-[80vh] overflow-y-auto space-y-6">
            
            {/* Capa e Informações da Obra */}
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="relative w-32 h-48 shrink-0 rounded-xl overflow-hidden shadow-xl border border-slate-700 mx-auto sm:mx-0">
                <Image
                  src={book.coverUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=450&fit=crop'}
                  alt={book.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1 text-center sm:text-left space-y-2">
                <h2 className="text-xl font-black text-white leading-tight">{book.title}</h2>
                <p className="text-sm text-amber-400 font-semibold">{book.authors}</p>
                {book.publishedYear && (
                  <p className="text-xs text-slate-500">Ano de Lançamento: {book.publishedYear}</p>
                )}
                {book.synopsis && (
                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed mt-2">
                    {book.synopsis}
                  </p>
                )}
              </div>
            </div>

            {/* Status de Leitura */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Status na sua Estante
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { key: 'WANT_TO_READ', label: 'Quero Ler', icon: Bookmark },
                  { key: 'READING', label: 'Lendo', icon: BookOpen },
                  { key: 'READ', label: 'Lido', icon: CheckCircle },
                  { key: 'ABANDONED', label: 'Pausado', icon: AlertCircle },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = status === item.key;
                  return (
                    <button
                      key={item.key}
                      onClick={() => setStatus(item.key as ReadingStatus)}
                      className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Progresso de Leitura (Se estiver Lendo) */}
            {status === 'READING' && (
              <div className="space-y-2 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-300">Progresso de Páginas</span>
                  <span className="text-amber-400 font-mono">{currentPage} / {pageCount} págs ({progressPercent}%)</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={pageCount}
                  value={currentPage}
                  onChange={(e) => setCurrentPage(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>
            )}

            {/* Avaliação em Estrelas */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Sua Avaliação
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-110 transition"
                  >
                    <Star
                      className={`h-6 w-6 ${
                        star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs text-slate-400 font-mono ml-2">
                  {rating > 0 ? `${rating} de 5 estrelas` : 'Sem nota'}
                </span>
              </div>
            </div>

            {/* Anotações Pessoais */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Suas Anotações / Resenha
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Escreva suas impressões sobre o livro ou progresso de leitura..."
                rows={3}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs text-slate-200 focus:border-amber-500 focus:outline-none transition resize-none"
              />
            </div>
          </div>

          {/* Footer Ações */}
          <div className="flex items-center justify-between border-t border-slate-800 px-6 py-4 bg-slate-950/40">
            {onRemove && (
              <button
                onClick={() => {
                  onRemove(book.id);
                  onClose();
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/30 transition"
              >
                <Trash2 className="h-4 w-4" />
                <span>Remover da Estante</span>
              </button>
            )}

            <div className="flex items-center gap-3 ml-auto">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-900/30 transition"
              >
                <Save className="h-4 w-4" />
                <span>Salvar Alterações</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
