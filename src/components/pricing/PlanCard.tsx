'use client';

import React from 'react';
import { Check, Crown, Sparkles, Zap } from 'lucide-react';
import { SubscriptionPlan } from '@/types';

interface PlanCardProps {
  plan: SubscriptionPlan;
  isCurrentPlan?: boolean;
  onSelectPlan?: (planId: string) => void;
}

export const PlanCard: React.FC<PlanCardProps> = ({
  plan,
  isCurrentPlan = false,
  onSelectPlan,
}) => {
  return (
    <div
      className={`relative flex flex-col justify-between rounded-3xl p-8 transition-all duration-300 ${
        plan.highlight
          ? 'bg-gradient-to-b from-slate-900 via-amber-950/20 to-slate-900 border-2 border-amber-500/80 shadow-2xl shadow-amber-500/10 scale-105 z-10'
          : 'bg-slate-900/90 border border-slate-800 hover:border-slate-700 shadow-xl'
      }`}
    >
      {plan.highlight && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Mais Recomendado</span>
        </div>
      )}

      <div>
        {/* Nome do Plano & Ícone */}
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black text-white">{plan.name}</h3>
          {plan.id === 'MASTER' ? (
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Crown className="h-6 w-6" />
            </div>
          ) : plan.id === 'PLUS' ? (
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
              <Zap className="h-6 w-6" />
            </div>
          ) : null}
        </div>

        <p className="text-xs text-slate-400 mt-2 min-h-[36px] leading-relaxed">{plan.description}</p>

        {/* Preço */}
        <div className="my-6">
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-black text-white">{plan.priceMonthly}</span>
            {plan.priceMonthly !== 'R$ 0' && <span className="text-xs text-slate-400 font-semibold">/ mês</span>}
          </div>
          {plan.priceYearly && (
            <p className="text-[11px] text-amber-400 mt-1 font-medium">Ou {plan.priceYearly} no plano anual (economize 16%)</p>
          )}
        </div>

        {/* Lista de Benefícios */}
        <div className="space-y-3 pt-4 border-t border-slate-800">
          <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400 block">
            Recursos Incluídos:
          </span>
          <ul className="space-y-2.5">
            {plan.features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-slate-300 leading-snug">
                <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Botão de Ação */}
      <div className="mt-8">
        <button
          onClick={() => onSelectPlan && onSelectPlan(plan.id)}
          disabled={isCurrentPlan}
          className={`w-full py-3 px-4 rounded-xl font-bold text-xs transition shadow-lg ${
            isCurrentPlan
              ? 'bg-slate-800 text-slate-400 border border-slate-700 cursor-default'
              : plan.highlight
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-900/40'
              : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
          }`}
        >
          {isCurrentPlan ? 'Plano Atual' : plan.priceMonthly === 'R$ 0' ? 'Começar Grátis' : `Assinar ${plan.name}`}
        </button>
      </div>
    </div>
  );
};
