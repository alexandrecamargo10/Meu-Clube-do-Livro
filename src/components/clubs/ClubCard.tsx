'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Users, Calendar, BookOpen, Crown, ArrowRight } from 'lucide-react';
import { ClubData } from '@/types';

interface ClubCardProps {
  club: ClubData;
}

export const ClubCard: React.FC<ClubCardProps> = ({ club }) => {
  return (
    <div className="group relative flex flex-col justify-between rounded-3xl bg-slate-900/90 border border-slate-800 p-6 hover:border-amber-500/50 transition-all duration-300 shadow-xl hover:shadow-2xl">
      <div className="space-y-4">
        {/* Banner ou Imagem do Clube */}
        <div className="relative h-28 w-full rounded-2xl overflow-hidden bg-gradient-to-r from-amber-950 via-slate-900 to-indigo-950 border border-slate-800 flex items-center justify-center">
          {club.bannerUrl ? (
            <Image src={club.bannerUrl} alt={club.name} fill className="object-cover group-hover:scale-105 transition-transform" />
          ) : (
            <div className="text-center p-4">
              <BookOpen className="h-8 w-8 text-amber-400 mx-auto opacity-80" />
            </div>
          )}
          
          <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-amber-300 border border-amber-500/30 flex items-center gap-1 shadow">
            <Crown className="h-3.5 w-3.5 text-amber-400" />
            <span>Master: {club.masterName}</span>
          </div>
        </div>

        {/* Informações do Clube */}
        <div>
          <h3 className="text-lg font-black text-white group-hover:text-amber-400 transition">{club.name}</h3>
          <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">{club.description}</p>
        </div>

        {/* Leitura Atual do Clube */}
        {club.currentBook && (
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80">
            <div className="relative h-12 w-8 shrink-0 rounded overflow-hidden shadow bg-slate-900 border border-slate-700">
              <Image src={club.currentBook.coverUrl} alt={club.currentBook.title} fill className="object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] uppercase font-bold text-amber-400 block">Leitura da Vez</span>
              <h4 className="text-xs font-bold text-slate-200 truncate">{club.currentBook.title}</h4>
              {club.readingDeadline && (
                <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                  <Calendar className="h-3 w-3 text-slate-500" />
                  Prazo: {club.readingDeadline}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer com contador de membros e Link para a Página do Clube */}
      <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-800/80">
        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
          <Users className="h-4 w-4 text-amber-400" />
          <span>{club.memberCount} Leitores</span>
        </div>

        <Link
          href={`/clubs/${club.id}`}
          className="flex items-center gap-1 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black text-xs transition shadow-md shadow-amber-900/30"
        >
          <span>Acessar Clube</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
};
