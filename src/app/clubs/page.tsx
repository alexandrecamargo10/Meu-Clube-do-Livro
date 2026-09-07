'use client';

import React, { useState } from 'react';
import { Users, Crown, Plus, Sparkles, BookOpen, Lock } from 'lucide-react';
import { ClubCard } from '@/components/clubs/ClubCard';
import { ClubData, Role } from '@/types';

export default function ClubsPage() {
  const [userRole, setUserRole] = useState<Role>('FREE');

  const [clubs, setClubs] = useState<ClubData[]>([
    {
      id: 'club_1',
      name: '🪐 Clube de Ficção Científica Arrakis',
      description: 'Leitores apaixonados por sci-fi clássico, cyberpunk e distopias astronômicas.',
      masterId: 'user_master_1',
      masterName: 'Alexandre Leitor Master',
      memberCount: 42,
      createdAt: new Date().toISOString(),
      currentBook: {
        id: 'b1',
        title: 'Duna',
        authors: 'Frank Herbert',
        coverUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80',
        pageCount: 680,
        type: 'BOOK',
      },
      readingDeadline: '30 de Setembro de 2026',
    },
    {
      id: 'club_2',
      name: '🏴‍☠️ Nakamas do Mangá',
      description: 'Grupo focado em maratonas de mangás shonen, seinen e lançamentos semanais.',
      masterId: 'user_master_2',
      masterName: 'Camila Master',
      memberCount: 89,
      createdAt: new Date().toISOString(),
      currentBook: {
        id: 'b2',
        title: 'One Piece - Vol. 1',
        authors: 'Eiichiro Oda',
        coverUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&auto=format&fit=crop&q=80',
        pageCount: 200,
        type: 'MANGA',
      },
      readingDeadline: '15 de Setembro de 2026',
    },
    {
      id: 'club_3',
      name: '🦇 Quadrinhos & Graphic Novels',
      description: 'Discussões semanais de HQs clássicas, selo Vertigo e HQs brasileiras independentes.',
      masterId: 'user_master_3',
      masterName: 'Gabriel HQ Master',
      memberCount: 34,
      createdAt: new Date().toISOString(),
      currentBook: {
        id: 'b3',
        title: 'Watchmen',
        authors: 'Alan Moore',
        coverUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&auto=format&fit=crop&q=80',
        pageCount: 416,
        type: 'COMIC',
      },
      readingDeadline: '25 de Setembro de 2026',
    },
  ]);

  const handleCreateClub = () => {
    if (userRole !== 'MASTER') {
      alert('Apenas usuários com a assinatura LEITOR MASTER podem criar e liderar novos Clubes de Leitura! Alterne a simulação para MASTER ou assine o plano.');
      return;
    }

    const clubName = prompt('Digite o nome do novo Clube de Leitura:');
    if (!clubName) return;

    const clubDesc = prompt('Digite a descrição do clube:');

    const newClub: ClubData = {
      id: `club_${Date.now()}`,
      name: clubName,
      description: clubDesc || 'Novo clube de leitura da comunidade.',
      masterId: 'current_user',
      masterName: 'Você (Leitor Master)',
      memberCount: 1,
      createdAt: new Date().toISOString(),
    };

    setClubs([newClub, ...clubs]);
    alert(`O clube "${clubName}" foi criado com sucesso!`);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header com Seletor de Role */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-400 mb-2">
            <Crown className="h-3.5 w-3.5" />
            <span>Exclusivo para Criadores e Leitor Master</span>
          </div>
          <h1 className="text-3xl font-black text-white">Clubes de Leitura</h1>
          <p className="text-xs text-slate-400">
            Entre em um grupo para ler coletivamente com prazos por capítulo e debates livres de spoiler.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Alternador de Plano */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1.5 rounded-xl text-xs">
            <span className="text-[11px] text-slate-400 font-medium px-2">Simular Plano:</span>
            {(['FREE', 'PLUS', 'MASTER'] as Role[]).map((r) => (
              <button
                key={r}
                onClick={() => setUserRole(r)}
                className={`px-3 py-1 rounded-lg font-bold transition ${
                  userRole === r
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <button
            onClick={handleCreateClub}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-lg ${
              userRole === 'MASTER'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 shadow-amber-900/30'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            {userRole === 'MASTER' ? <Plus className="h-4 w-4" /> : <Lock className="h-4 w-4 text-amber-400" />}
            <span>Criar Clube (Leitor Master)</span>
          </button>
        </div>
      </div>

      {/* Grid de Clubes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clubs.map((club) => (
          <ClubCard
            key={club.id}
            club={club}
            onJoinClick={(id) => {
              alert(`Você agora é um membro do grupo "${club.name}"!`);
            }}
          />
        ))}
      </div>
    </div>
  );
}
