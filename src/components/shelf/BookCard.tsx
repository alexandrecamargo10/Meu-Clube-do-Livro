'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star, BookOpen, CheckCircle, Bookmark, AlertCircle, Sparkles } from 'lucide-react';
import { BookItem, BookViewMode } from '@/types';

interface BookCardProps {
  book: BookItem;
  onClick?: (book: BookItem) => void;
  tiltAngle?: number;
  viewMode?: BookViewMode;
}

export const BookCard: React.FC<BookCardProps> = ({
  book,
  onClick,
  tiltAngle = 0,
  viewMode = 'MOCKUP_3D',
}) => {
  const getStatusBadge = () => {
    switch (book.status) {
      case 'READING':
        return { label: 'Lendo', icon: BookOpen, bg: 'bg-blue-600/90 text-blue-100 border-blue-400/40' };
      case 'READ':
        return { label: 'Lido', icon: CheckCircle, bg: 'bg-emerald-600/90 text-emerald-100 border-emerald-400/40' };
      case 'ABANDONED':
        return { label: 'Pausado', icon: AlertCircle, bg: 'bg-rose-600/90 text-rose-100 border-rose-400/40' };
      default:
        return { label: 'Quero Ler', icon: Bookmark, bg: 'bg-amber-600/90 text-amber-100 border-amber-400/40' };
    }
  };

  const statusInfo = getStatusBadge();
  const StatusIcon = statusInfo.icon;

  const progressPercent =
    book.pageCount && book.currentPage
      ? Math.min(100, Math.round((book.currentPage / book.pageCount) * 100))
      : 0;

  // Espessura da lombada baseada no número de páginas
  const isThick = (book.pageCount || 200) > 400;
  const spineWidthPx = isThick ? 28 : 22;

  // =========================================================================
  // MODELO 1: MOCKUP 3D IDÊNTICO À REFERÊNCIA (referencia_livro.png)
  // - Avaliação em estrelas posicionada na parte SUPERIOR
  // - Nome na lombada acompanhando verticalmente o alinhamento da lombada
  // - Efeito no mouse over: elevação, rotação para o usuário e brilho âmbar
  // =========================================================================
  if (viewMode === 'MOCKUP_3D') {
    return (
      <div
        onClick={() => onClick && onClick(book)}
        className="group relative cursor-pointer flex flex-col items-center select-none mockup-ref-container z-10 hover:z-30 transition-all duration-300"
      >
        {/* PARTE SUPERIOR: Avaliação em Estrelas (Agora no Topo) */}
        <div className="h-6 mb-2 flex items-center justify-center gap-0.5 transition-transform duration-300 group-hover:scale-110">
          {book.rating && book.rating > 0 ? (
            <div className="flex items-center gap-0.5 bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded-full border border-amber-500/30 shadow-md">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-3 w-3 ${
                    star <= (book.rating || 0)
                      ? 'text-amber-400 fill-amber-400 filter drop-shadow-[0_0_3px_rgba(251,191,36,0.6)]'
                      : 'text-slate-700'
                  }`}
                />
              ))}
              <span className="text-[10px] font-bold text-amber-400 ml-1">{book.rating}.0</span>
            </div>
          ) : (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[10px] text-slate-500 font-medium">
              <span>Sem avaliação</span>
            </div>
          )}
        </div>

        {/* Sombra de Projeção no Chão da Estante */}
        <div className="mockup-ref-ground-shadow" />

        {/* =====================================================================
            MODELO MOCKUP 3D IDÊNTICO À REFERÊNCIA (referencia_livro.png)
            - Escala calibrada para a estante (largura ~92px, altura ~186px)
            - Páginas superiores do miolo claramente renderizadas e visíveis
            - Capa frontal da API e lombada com nome ao longo da lombada
            ===================================================================== */}
        <div className="mockup-ref-book book-glow-hover transition-transform duration-500 ease-out group-hover:translate-y-[-14px] group-hover:scale-105">
          {/* Caixa delimitadora na prateleira: 92px x 186px (mobile) e 100px x 202px (sm) */}
          <div className="relative w-[92px] h-[186px] sm:w-[100px] sm:h-[202px] overflow-visible select-none">
            {/* Contêiner de Coordenadas Nativas 448x903 com scale(0.205) / scale(0.223) */}
            <div
              className="absolute top-0 left-0 w-[448px] h-[903px] origin-top-left"
              style={{
                transform: 'scale(var(--book-scale, 0.2053))',
              }}
            >
              {/* SVG Base do Modelo: Topo do Miolo (Folhas Brancas de Papel) e Aba Traseira da Capa Dura */}
              <svg
                viewBox="0 0 448 903"
                width="448"
                height="903"
                className="absolute inset-0 w-[448px] h-[903px] pointer-events-none z-10 overflow-visible"
              >
                {/* 1. Face interna vertical da contracapa traseira (borda cinza suave que envolve o miolo) */}
                <polygon
                  points="106,4 108,0 446,84 106,23"
                  fill="#d4d4d8"
                  stroke="#a1a1aa"
                  strokeWidth="1"
                />
                {/* Linha de destaque da borda superior da contracapa traseira */}
                <line x1="106" y1="4" x2="446" y2="84" stroke="#ffffff" strokeWidth="2" />

                {/* 2. Face horizontal superior das páginas (Miolo branco cortado preenchendo a perspectiva exata) */}
                <polygon
                  points="3,14 50,26 80,26 106,23 446,84 326,105 3,15"
                  fill="#ffffff"
                  stroke="#e4e4e7"
                  strokeWidth="1"
                />

                {/* Linhas de corte das páginas do miolo e vinco traseiro */}
                <line x1="106" y1="23" x2="446" y2="84" stroke="#d4d4d8" strokeWidth="1.5" />
                <line x1="108" y1="42" x2="416" y2="90" stroke="#f4f4f5" strokeWidth="1" />
              </svg>

              {/* Face da Lombada Direita com Perspectiva e Nome ao Longo da Lombada */}
              <div
                className="absolute top-0 left-0 w-[100px] h-[300px] z-20 overflow-hidden flex flex-col items-center justify-between py-4 shadow-2xl border-y border-r border-slate-700/70"
                style={{
                  transformOrigin: '0 0',
                  transform:
                    'matrix3d(1.417054, -0.160627, 0, 0.000463, 0.358403, 3.643888, 0, 0.001099, 0, 0, 1, 0, 326, 105, 0, 1)',
                  background:
                    'linear-gradient(90deg, #090d16 0%, #1e293b 25%, #334155 75%, #0f172a 100%)',
                }}
              >
                {/* Detalhe superior da lombada */}
                <div className="w-5 h-1.5 bg-amber-400/80 rounded-full shadow" />

                {/* Título da Obra escrito ao longo da lombada */}
                <div className="flex-1 flex items-center justify-center my-2 max-h-[220px]">
                  <span className="spine-vertical-text text-[13px] font-bold tracking-widest text-slate-100 uppercase drop-shadow line-clamp-1">
                    {book.title}
                  </span>
                </div>

                {/* Detalhe inferior da lombada */}
                <div className="w-5 h-1.5 bg-amber-400/80 rounded-full shadow" />
              </div>

              {/* Face da Capa Frontal com Perspectiva da Referência e Capa da API Aplicada */}
              <div
                className="absolute top-0 left-0 w-[200px] h-[300px] z-30 overflow-hidden bg-slate-900 border-l border-y border-slate-700/80 shadow-2xl group-hover:brightness-105 transition-all duration-300"
                style={{
                  transformOrigin: '0 0',
                  transform:
                    'matrix3d(1.378067, 0.368856, 0, -0.000773, 0.082486, 2.471210, 0, 0.000253, 0, 0, 1, 0, 0, 15, 0, 1)',
                }}
              >
                {/* Brilho Glossy Transversal da Capa Dura */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20 pointer-events-none z-10 group-hover:translate-x-full transition-transform duration-700 ease-in-out" />

                {/* Imagem da Capa Buscada pela API */}
                <Image
                  src={book.coverUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=450&fit=crop'}
                  alt={book.title}
                  fill
                  sizes="(max-width: 640px) 200px, 250px"
                  className="object-cover group-hover:contrast-105 transition-all duration-300"
                />

                {/* Badge de Status de Leitura */}
                <div className="absolute top-2 right-2 z-20">
                  <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold backdrop-blur-md border shadow-lg ${statusInfo.bg}`}>
                    <StatusIcon className="h-3.5 w-3.5" />
                    {statusInfo.label}
                  </span>
                </div>

                {/* Badge do Tipo (Mangá / HQ / Livro) */}
                <div className="absolute bottom-2 left-2 z-20">
                  <span className="px-1.5 py-0.5 rounded bg-slate-950/85 backdrop-blur-md text-[9px] font-mono font-bold text-amber-300 uppercase tracking-wider border border-amber-500/30 shadow">
                    {book.type}
                  </span>
                </div>

                {/* Barra de Progresso de Leitura */}
                {book.status === 'READING' && (
                  <div className="absolute bottom-0 left-0 right-0 h-2 bg-slate-950/90 z-20 border-t border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-emerald-400 shadow-sm transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Rótulo / Plaqueta da Obra abaixo do livro */}
        <div className="mt-2 text-center w-28 sm:w-32 px-1">
          <h4 className="text-xs font-bold text-slate-100 truncate group-hover:text-amber-400 transition drop-shadow-sm">
            {book.title}
          </h4>
          <p className="text-[11px] text-slate-400 truncate mt-0.5">{book.authors}</p>
        </div>
      </div>
    );
  }

  // =========================================================================
  // MODELO 2: CAPA DE FRENTE (Front-Cover View, Limpo e Frontal)
  // - Avaliação em estrelas posicionada na parte SUPERIOR
  // =========================================================================
  return (
    <motion.div
      whileHover={{
        y: -20,
        scale: 1.08,
        transition: { type: 'spring', stiffness: 350, damping: 20 },
      }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onClick && onClick(book)}
      className="group relative cursor-pointer flex flex-col items-center select-none z-10 hover:z-30 transition-all"
      style={{ transformOrigin: 'bottom center' }}
    >
      {/* PARTE SUPERIOR: Avaliação em Estrelas (Agora no Topo) */}
      <div className="h-6 mb-2 flex items-center justify-center gap-0.5 transition-transform duration-300 group-hover:scale-110">
        {book.rating && book.rating > 0 ? (
          <div className="flex items-center gap-0.5 bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded-full border border-amber-500/30 shadow-md">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-3 w-3 ${
                  star <= (book.rating || 0)
                    ? 'text-amber-400 fill-amber-400 filter drop-shadow-[0_0_3px_rgba(251,191,36,0.6)]'
                    : 'text-slate-700'
                }`}
              />
            ))}
            <span className="text-[10px] font-bold text-amber-400 ml-1">{book.rating}.0</span>
          </div>
        ) : (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[10px] text-slate-500 font-medium">
            <span>Sem avaliação</span>
          </div>
        )}
      </div>

      {/* Sombra de Contato Frontal */}
      <div className="absolute -bottom-2 left-2 right-2 h-4 bg-black/60 rounded-full blur-sm pointer-events-none group-hover:scale-110 transition-transform" />

      {/* Capa Totalmente Frontal com Efeito Glow no Hover */}
      <div className="relative w-30 h-46 sm:w-36 sm:h-52 rounded-xl overflow-hidden bg-slate-900 border-2 border-slate-700/80 shadow-2xl group-hover:border-amber-500 group-hover:shadow-[0_0_25px_rgba(245,158,11,0.3)] transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/30 pointer-events-none z-10" />

        {/* Imagem da Capa */}
        <Image
          src={book.coverUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=450&fit=crop'}
          alt={book.title}
          fill
          sizes="(max-width: 640px) 120px, 144px"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Badge de Status de Leitura */}
        <div className="absolute top-2.5 right-2.5 z-20">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold backdrop-blur-md border shadow-lg ${statusInfo.bg}`}>
            <StatusIcon className="h-3 w-3" />
            {statusInfo.label}
          </span>
        </div>

        {/* Badge do Tipo (Mangá / HQ / Livro) */}
        <div className="absolute bottom-2.5 left-2.5 z-20">
          <span className="px-2 py-0.5 rounded-md bg-slate-950/85 backdrop-blur-md text-[9px] font-mono font-bold text-amber-300 uppercase tracking-wider border border-amber-500/30 shadow">
            {book.type}
          </span>
        </div>

        {/* Barra de Progresso Frontal */}
        {book.status === 'READING' && (
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-slate-950/90 z-20 border-t border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 shadow-sm transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}
      </div>

      {/* Rótulo da Obra */}
      <div className="mt-3 text-center w-34 sm:w-38 px-1">
        <h4 className="text-xs font-bold text-slate-100 truncate group-hover:text-amber-400 transition drop-shadow-sm">
          {book.title}
        </h4>
        <p className="text-[11px] text-slate-400 truncate mt-0.5">{book.authors}</p>
      </div>
    </motion.div>
  );
};
