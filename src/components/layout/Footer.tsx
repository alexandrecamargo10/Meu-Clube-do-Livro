import React from 'react';
import Link from 'next/link';
import { BookOpen, Heart, ShieldCheck, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400 text-sm mt-20">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-600">
                <BookOpen className="h-4 w-4 text-white" />
              </div>
              <span className="text-base font-bold text-white">Meu Clube do Livro</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              A plataforma definitiva para leitores de Livros, Mangás e HQs organizarem suas estantes virtuais, participarem de clubes e interagirem socialmente.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">Plataforma</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/search" className="hover:text-white transition">Buscar Obras</Link></li>
              <li><Link href="/shelves" className="hover:text-white transition">Estantes 3D</Link></li>
              <li><Link href="/clubs" className="hover:text-white transition">Clubes de Leitura</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition">Planos & Assinaturas</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">Tecnologias</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5 text-amber-400"/> Next.js 14 App Router</li>
              <li className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-blue-400"/> TypeScript & Prisma ORM</li>
              <li>PostgreSQL no Supabase</li>
              <li>Tailwind CSS & Framer Motion</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">Planos</h4>
            <p className="text-xs text-slate-400 mb-2">
              Crie seu clube como <strong>Leitor Master</strong> ou turbine suas estantes como <strong>Leitor Plus</strong>.
            </p>
            <Link
              href="/pricing"
              className="inline-block px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition"
            >
              Conheça os Planos
            </Link>
          </div>

        </div>

        <div className="mt-8 border-t border-slate-900 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 Meu Clube do Livro. Todos os direitos reservados.</p>
          <p className="flex items-center gap-1 mt-2 sm:mt-0">
            Desenvolvido com <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500" /> com Antigravity AI
          </p>
        </div>
      </div>
    </footer>
  );
};
