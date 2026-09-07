'use client';

import React, { useState } from 'react';
import { PlanCard } from '@/components/pricing/PlanCard';
import { SubscriptionPlan, Role } from '@/types';
import { Crown, Sparkles, HelpCircle } from 'lucide-react';
import { useNotification } from '@/components/ui/NotificationProvider';

export default function PricingPage() {
  const { toast } = useNotification();
  const [currentRole, setCurrentRole] = useState<Role>('FREE');

  const plans: SubscriptionPlan[] = [
    {
      id: 'FREE',
      name: 'Plano Gratuito',
      priceMonthly: 'R$ 0',
      priceYearly: '',
      description: 'Ideal para leitores casuais que desejam experimentar a plataforma.',
      maxShelves: 2,
      maxBooksPerShelf: 30,
      maxClubs: 0,
      canCreateClub: false,
      exclusiveThemes: false,
      features: [
        'Até 2 Estantes Virtuais',
        'Limite de 30 Obras por estante',
        'Entrar em até 2 Clubes de Leitura',
        'Tema Clássico de Madeira',
        'Busca no acervo de Livros, Mangás e HQs',
        'Feed Social & Avaliações',
      ],
    },
    {
      id: 'PLUS',
      name: 'Leitor Plus',
      priceMonthly: 'R$ 14,90',
      priceYearly: 'R$ 149,00',
      description: 'Perfeito para leitores assíduos, otaku e colecionadores de HQs.',
      highlight: true,
      maxShelves: 'Unlimited',
      maxBooksPerShelf: 'Unlimited',
      maxClubs: 0,
      canCreateClub: false,
      exclusiveThemes: true,
      features: [
        'Estantes Virtuais Ilimitadas',
        'Sem limite de livros por estante',
        'Participação ilimitada em Clubes',
        'Acesso aos Temas 3D: Dark, Neon & Vintage',
        'Métricas de leitura & Gráficos por gênero',
        'Badge exclusivo Leitor Plus no Perfil',
      ],
    },
    {
      id: 'MASTER',
      name: 'Leitor Master',
      priceMonthly: 'R$ 29,90',
      priceYearly: 'R$ 299,00',
      description: 'Para BookTokers, podcasters e organizadores de grupos de leitura.',
      maxShelves: 'Unlimited',
      maxBooksPerShelf: 'Unlimited',
      maxClubs: 5,
      canCreateClub: true,
      exclusiveThemes: true,
      features: [
        'Tudo incluído no Plano Leitor Plus',
        'Criar e gerenciar até 5 Clubes de Leitura',
        'Definir o "Livro do Mês" com metas por capítulo',
        'Estante coletiva própria do Clube',
        'Moderação de frentes de debate anti-spoiler',
        'Relatórios de engajamento dos membros',
      ],
    },
  ];

  const handleSelectPlan = (planId: string) => {
    setCurrentRole(planId as Role);
    toast(
      'Plano Selecionado!',
      `Você alternou com sucesso para o plano ${planId}. Na versão final, este botão redirecionará para o Stripe Checkout.`,
      'success'
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-16">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-400">
          <Crown className="h-4 w-4" />
          <span>Estratégia de Rentabilização SaaS</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
          Planos transparentes para cada <span className="text-amber-400">tipo de leitor</span>
        </h1>

        <p className="text-sm text-slate-400 leading-relaxed">
          Comece gratuitamente ou assine nossos planos VIP para desbloquear estantes virtuais ilimitadas, temas realistas e criação de clubes de leitura.
        </p>
      </div>

      {/* Grid dos Planos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            isCurrentPlan={currentRole === plan.id}
            onSelectPlan={handleSelectPlan}
          />
        ))}
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto rounded-3xl bg-slate-900 border border-slate-800 p-8 space-y-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-amber-400" />
          <span>Perguntas Frequentes</span>
        </h3>

        <div className="space-y-4 text-xs text-slate-300">
          <div>
            <h4 className="font-bold text-white mb-1">Como funciona o Plano Leitor Master?</h4>
            <p className="text-slate-400">
              O Leitor Master é a figura de liderança da comunidade. Ao assinar este plano, você adquire a permissão para criar clubes de leitura públicos ou privados, escolher o livro atual do grupo e moderar discussões.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-1">Posso cancelar a qualquer momento?</h4>
            <p className="text-slate-400">
              Sim! As assinaturas não possuem fidelidade e podem ser canceladas diretamente no painel do usuário.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
