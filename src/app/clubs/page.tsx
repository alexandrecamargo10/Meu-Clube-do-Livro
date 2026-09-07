'use client';

import React, { useState } from 'react';
import { Users, Crown, Plus, Sparkles, BookOpen, Lock } from 'lucide-react';
import { ClubCard } from '@/components/clubs/ClubCard';
import { ClubData, Role } from '@/types';
import { useNotification } from '@/components/ui/NotificationProvider';
import { useAuth } from '@/context/AuthContext';
import { initialClubsData } from '@/lib/data/clubs';

export default function ClubsPage() {
  const { toast, prompt } = useNotification();
  const { user } = useAuth();
  const userRole = user?.role || 'FREE';

  const [clubs, setClubs] = useState<ClubData[]>(Object.values(initialClubsData));

  const handleCreateClub = async () => {
    if (userRole !== 'MASTER') {
      toast(
        'Acesso Exclusivo Leitor Master',
        'Apenas assinantes do plano LEITOR MASTER podem fundar e liderar novos Clubes de Leitura.',
        'warning'
      );
      return;
    }

    const clubName = await prompt({
      title: 'Nome do Clube de Leitura',
      description: 'Como o seu novo clube será conhecido pelos leitores?',
      placeholder: 'Ex: Clube de Ficção Científica, Mestres do Mangá...',
      confirmLabel: 'Próximo',
    });

    if (!clubName) return;

    const clubDesc = await prompt({
      title: 'Descrição e Proposta do Clube',
      description: 'Explique brevemente o foco das leituras e o ritmo do grupo.',
      placeholder: 'Ex: Leituras quinzenais de clássicos e debates aos sábados...',
      confirmLabel: 'Criar Clube',
    });

    const newClubId = `club_${Date.now()}`;
    const newClub: ClubData = {
      id: newClubId,
      name: clubName,
      description: clubDesc || 'Novo clube de leitura da comunidade.',
      masterId: user?.id || 'usr_current',
      masterName: user?.name || 'Você (Leitor Master)',
      memberCount: 1,
      createdAt: new Date().toISOString(),
      shelf: {
        id: `shelf_${newClubId}`,
        name: `Estante Oficial de ${clubName}`,
        theme: 'WOOD',
        isPublic: true,
        books: [],
        createdAt: new Date().toISOString(),
      },
      members: [
        {
          id: `m_${Date.now()}`,
          userId: user?.id || 'usr_current',
          userName: user?.name || 'Você',
          userEmail: user?.email || 'voce@exemplo.com',
          userRole: userRole,
          memberRole: 'MASTER',
          joinedAt: new Date().toISOString(),
          status: 'ACTIVE',
        },
      ],
      messages: [],
    };

    setClubs([newClub, ...clubs]);
    toast('Clube fundado com sucesso!', `O clube "${clubName}" agora está ativo.`, 'success');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-400 mb-2">
            <Crown className="h-3.5 w-3.5" />
            <span>Clubes & Comunidades de Leitura</span>
          </div>
          <h1 className="text-3xl font-black text-white">Clubes de Leitura</h1>
          <p className="text-xs text-slate-400">
            Entre em um grupo para ler coletivamente com chat exclusivo, leitura da vez e estante oficial.
          </p>
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

      {/* Grid de Clubes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clubs.map((club) => (
          <ClubCard key={club.id} club={club} />
        ))}
      </div>
    </div>
  );
}
