'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, Search, Users, Crown, Sparkles, User as UserIcon, LogOut, LogIn } from 'lucide-react';
import { Role } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useNotification } from '@/components/ui/NotificationProvider';

export const Header: React.FC = () => {
  const { user, isAuthenticated, logout, updateRole, openAuthModal } = useAuth();
  const { toast } = useNotification();

  const getBadgeStyle = (role: Role) => {
    switch (role) {
      case 'MASTER':
        return 'bg-gradient-to-r from-amber-500 to-yellow-300 text-slate-950 font-bold border border-amber-300 shadow-md shadow-amber-500/20';
      case 'PLUS':
        return 'bg-gradient-to-r from-purple-500 to-indigo-400 text-white font-bold border border-purple-300 shadow-md shadow-purple-500/20';
      default:
        return 'bg-slate-800 text-slate-300 border border-slate-700';
    }
  };

  const handleRoleChange = (newRole: Role) => {
    updateRole(newRole);
    toast(
      'Plano Simulado!',
      `Seu usuário agora opera com as permissões do nível ${newRole}.`,
      'info'
    );
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo & Marca */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-600 to-amber-800 shadow-lg shadow-amber-900/30 group-hover:scale-105 transition-transform">
              <BookOpen className="h-5 w-5 text-amber-100" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-white block leading-tight">
                Meu Clube <span className="text-amber-500">do Livro</span>
              </span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-medium">
                Rede Social & Estantes
              </span>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <Link
              href="/search"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-900 transition"
            >
              <Search className="h-4 w-4 text-amber-400" />
              <span>Explorar Obras</span>
            </Link>

            <Link
              href="/shelves"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-900 transition"
            >
              <BookOpen className="h-4 w-4 text-amber-400" />
              <span>Minhas Estantes</span>
            </Link>

            <Link
              href="/clubs"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-900 transition"
            >
              <Users className="h-4 w-4 text-amber-400" />
              <span>Clubes de Leitura</span>
            </Link>

            <Link
              href="/pricing"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-amber-400 hover:text-amber-300 hover:bg-amber-950/30 transition"
            >
              <Crown className="h-4 w-4 text-amber-400" />
              <span>Assinaturas</span>
            </Link>
          </nav>
        </div>

        {/* Auth & User Controls */}
        <div className="flex items-center gap-3">
          {/* Alternador de Plano para Teste/Demonstração */}
          {isAuthenticated && user && (
            <div className="hidden sm:flex items-center gap-1 bg-slate-900/90 border border-slate-800 p-1 rounded-xl text-xs">
              <span className="text-[10px] text-slate-400 pl-2 font-medium">Plano:</span>
              {(['FREE', 'PLUS', 'MASTER'] as Role[]).map((role) => (
                <button
                  key={role}
                  onClick={() => handleRoleChange(role)}
                  className={`px-2 py-0.5 rounded-lg transition text-[11px] font-bold ${
                    user.role === role
                      ? getBadgeStyle(role)
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          )}

          {/* User Profile ou Botão de Login */}
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
              <div className="relative h-9 w-9 rounded-full overflow-hidden bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-200">
                {user.avatarUrl ? (
                  <Image src={user.avatarUrl} alt={user.name} fill className="object-cover" />
                ) : (
                  <UserIcon className="h-4 w-4" />
                )}
              </div>
              <div className="hidden lg:block text-left text-xs">
                <span className="font-semibold text-white block">{user.name}</span>
                <span className={`inline-block px-1.5 py-0.2 rounded text-[9px] uppercase font-bold mt-0.5 ${getBadgeStyle(user.role)}`}>
                  {user.role === 'MASTER' ? 'Leitor Master' : user.role === 'PLUS' ? 'Leitor Plus' : 'Plano Free'}
                </span>
              </div>

              <button
                onClick={() => {
                  logout();
                  toast('Sessão encerrada', 'Você saiu da sua conta.', 'info');
                }}
                title="Sair da conta"
                className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800/80 transition"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={openAuthModal}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition shadow-md shadow-amber-900/30"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>Entrar / Cadastrar</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
};
