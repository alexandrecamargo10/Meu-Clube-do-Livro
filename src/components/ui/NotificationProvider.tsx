'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  AlertTriangle,
  Info,
  XCircle,
  X,
  Sparkles,
  HelpCircle,
} from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  title: string;
  message?: string;
  type: ToastType;
}

interface PromptOptions {
  title: string;
  description?: string;
  placeholder?: string;
  defaultValue?: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

interface ConfirmOptions {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
}

interface NotificationContextType {
  toast: (title: string, message?: string, type?: ToastType) => void;
  prompt: (options: PromptOptions) => Promise<string | null>;
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Estado para Modal de Prompt Customizado
  const [promptState, setPromptState] = useState<{
    isOpen: boolean;
    options: PromptOptions;
    resolve: (value: string | null) => void;
  } | null>(null);
  const [promptValue, setPromptValue] = useState('');

  // Estado para Modal de Confirmação Customizado
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    options: ConfirmOptions;
    resolve: (value: boolean) => void;
  } | null>(null);

  // Disparar Toasts
  const toast = (title: string, message?: string, type: ToastType = 'info') => {
    const id = `${Date.now()}_${Math.random()}`;
    const newToast: ToastItem = { id, title, message, type };

    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Disparar Prompt Promissificado (Substitui window.prompt)
  const prompt = (options: PromptOptions): Promise<string | null> => {
    return new Promise((resolve) => {
      setPromptValue(options.defaultValue || '');
      setPromptState({
        isOpen: true,
        options,
        resolve,
      });
    });
  };

  // Disparar Confirmação Promissificada (Substitui window.confirm)
  const confirm = (options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setConfirmState({
        isOpen: true,
        options,
        resolve,
      });
    });
  };

  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (promptState) {
      promptState.resolve(promptValue.trim());
      setPromptState(null);
    }
  };

  const handlePromptCancel = () => {
    if (promptState) {
      promptState.resolve(null);
      setPromptState(null);
    }
  };

  const handleConfirmSubmit = (result: boolean) => {
    if (confirmState) {
      confirmState.resolve(result);
      setConfirmState(null);
    }
  };

  const getToastIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-rose-400 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0" />;
      default:
        return <Info className="h-5 w-5 text-sky-400 shrink-0" />;
    }
  };

  const getToastBorder = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'border-emerald-500/30 bg-emerald-950/40';
      case 'error':
        return 'border-rose-500/30 bg-rose-950/40';
      case 'warning':
        return 'border-amber-500/30 bg-amber-950/40';
      default:
        return 'border-sky-500/30 bg-sky-950/40';
    }
  };

  return (
    <NotificationContext.Provider value={{ toast, prompt, confirm }}>
      {children}

      {/* ====================================================================
          TOASTS CONTAINER (Canto Superior Direito)
          ==================================================================== */}
      <div className="fixed top-20 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-2">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className={`pointer-events-auto flex items-start justify-between gap-3 p-4 rounded-2xl border backdrop-blur-xl shadow-2xl ${getToastBorder(
                t.type
              )}`}
            >
              <div className="flex items-start gap-3">
                {getToastIcon(t.type)}
                <div>
                  <h4 className="text-xs font-bold text-white leading-tight">{t.title}</h4>
                  {t.message && (
                    <p className="text-[11px] text-slate-300/90 mt-1 leading-relaxed">
                      {t.message}
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={() => removeToast(t.id)}
                className="text-slate-400 hover:text-white p-0.5 rounded transition"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* ====================================================================
          MODAL DE PROMPT CUSTOMIZADO (Substitui prompt())
          ==================================================================== */}
      <AnimatePresence>
        {promptState?.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 15 }}
              className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-slate-700/80 p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">{promptState.options.title}</h3>
                  {promptState.options.description && (
                    <p className="text-xs text-slate-400 mt-0.5">
                      {promptState.options.description}
                    </p>
                  )}
                </div>
              </div>

              <form onSubmit={handlePromptSubmit} className="space-y-4">
                <input
                  type="text"
                  autoFocus
                  value={promptValue}
                  onChange={(e) => setPromptValue(e.target.value)}
                  placeholder={promptState.options.placeholder || 'Digite aqui...'}
                  className="w-full h-11 px-4 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none transition shadow-inner"
                />

                <div className="flex items-center justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={handlePromptCancel}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800 transition"
                  >
                    {promptState.options.cancelLabel || 'Cancelar'}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-900/30 transition"
                  >
                    {promptState.options.confirmLabel || 'Confirmar'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ====================================================================
          MODAL DE CONFIRMAÇÃO CUSTOMIZADO (Substitui confirm())
          ==================================================================== */}
      <AnimatePresence>
        {confirmState?.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 15 }}
              className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-slate-700/80 p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2.5 rounded-2xl border ${
                    confirmState.options.isDestructive
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}
                >
                  <HelpCircle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">{confirmState.options.title}</h3>
                  {confirmState.options.description && (
                    <p className="text-xs text-slate-400 mt-0.5">
                      {confirmState.options.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => handleConfirmSubmit(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800 transition"
                >
                  {confirmState.options.cancelLabel || 'Cancelar'}
                </button>
                <button
                  type="button"
                  onClick={() => handleConfirmSubmit(true)}
                  className={`px-5 py-2 rounded-xl font-bold text-xs shadow-lg transition ${
                    confirmState.options.isDestructive
                      ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/30'
                      : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-900/30'
                  }`}
                >
                  {confirmState.options.confirmLabel || 'Continuar'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification deve ser usado dentro de NotificationProvider');
  }
  return context;
};
