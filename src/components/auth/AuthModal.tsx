'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Mail, User, ShieldCheck, Sparkles, BookOpen } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Role } from '@/types';
import { useNotification } from '@/components/ui/NotificationProvider';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, login } = useAuth();
  const { toast } = useNotification();

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('FREE');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast('Campos obrigatórios', 'Por favor, preencha o e-mail e senha.', 'warning');
      return;
    }

    login(email, name, role);
    toast(
      isRegister ? 'Conta criada com sucesso!' : 'Login realizado com sucesso!',
      `Bem-vindo(a) ao Meu Clube do Livro, ${name || email.split('@')[0]}!`,
      'success'
    );
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.93, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.93, y: 15 }}
          className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-slate-700/80 p-6 sm:p-8 shadow-2xl space-y-6"
        >
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="text-center space-y-2">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shadow-lg">
              <BookOpen className="h-6 w-6" />
            </div>
            <h3 className="text-2xl font-black text-white">
              {isRegister ? 'Criar Conta' : 'Entrar no Clube'}
            </h3>
            <p className="text-xs text-slate-400">
              {isRegister
                ? 'Junte-se à comunidade de leitores e organize suas estantes 3D'
                : 'Acesse suas estantes, clubes de leitura e histórico'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                  Seu Nome
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Alexandre Leitor"
                    className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none transition shadow-inner"
                  />
                  <User className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                </div>
              </div>
            )}

            <div>
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                E-mail
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seuemail@exemplo.com"
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none transition shadow-inner"
                />
                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                Senha
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none transition shadow-inner"
                />
                <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
              </div>
            </div>

            {isRegister && (
              <div>
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                  Plano Inicial Desejado
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['FREE', 'PLUS', 'MASTER'] as Role[]).map((r) => (
                    <button
                      type="button"
                      key={r}
                      onClick={() => setRole(r)}
                      className={`p-2 rounded-xl text-xs font-bold border transition ${
                        role === r
                          ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full h-12 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-900/30 transition mt-2"
            >
              {isRegister ? 'Finalizar Cadastro' : 'Entrar na Conta'}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-slate-800 text-xs text-slate-400">
            {isRegister ? (
              <p>
                Já possui uma conta?{' '}
                <button
                  type="button"
                  onClick={() => setIsRegister(false)}
                  className="font-bold text-amber-400 hover:underline"
                >
                  Entrar
                </button>
              </p>
            ) : (
              <p>
                Ainda não tem cadastro?{' '}
                <button
                  type="button"
                  onClick={() => setIsRegister(true)}
                  className="font-bold text-amber-400 hover:underline"
                >
                  Cadastre-se grátis
                </button>
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
