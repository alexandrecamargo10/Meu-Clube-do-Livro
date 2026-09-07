'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  Users,
  MessageSquare,
  BookOpen,
  Crown,
  Calendar,
  Plus,
  Trash2,
  UserPlus,
  Send,
  Lock,
  ArrowLeft,
  CheckCircle,
  Clock,
  Shield,
  Layers,
} from 'lucide-react';
import { initialClubsData } from '@/lib/data/clubs';
import { ClubData, BookItem, ClubMemberItem, ClubChatMessage } from '@/types';
import { VirtualShelf } from '@/components/shelf/VirtualShelf';
import { BookModal } from '@/components/shelf/BookModal';
import { AddBookSearchModal } from '@/components/shelf/AddBookSearchModal';
import { useNotification } from '@/components/ui/NotificationProvider';
import { useAuth } from '@/context/AuthContext';

export default function ClubDetailPage() {
  const params = useParams();
  const router = useRouter();
  const clubId = (params?.id as string) || 'club_1';

  const { toast, prompt, confirm } = useNotification();
  const { user } = useAuth();

  // Carregar clube mockado
  const [club, setClub] = useState<ClubData>(() => {
    return initialClubsData[clubId] || initialClubsData['club_1'];
  });

  // Abas da página do clube
  const [activeTab, setActiveTab] = useState<'SHELF' | 'CHAT' | 'MEMBERS'>('SHELF');

  // Mensagens do Chat
  const [chatInput, setChatInput] = useState('');

  // Modais de Livros
  const [selectedBook, setSelectedBook] = useState<BookItem | null>(null);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);

  // Verificar se o usuário autenticado atual é o Criador / Leitor Master do Clube
  const isMaster = user?.id === club.masterId || user?.role === 'MASTER';

  // Enviar Mensagem no Chat do Clube
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMessage: ClubChatMessage = {
      id: `msg_${Date.now()}`,
      clubId: club.id,
      userId: user?.id || 'usr_current',
      userName: user?.name || 'Membro do Clube',
      userAvatar: user?.avatarUrl,
      userRole: user?.role || 'FREE',
      content: chatInput.trim(),
      createdAt: new Date().toISOString(),
    };

    setClub((prev) => ({
      ...prev,
      messages: [...(prev.messages || []), newMessage],
    }));
    setChatInput('');
  };

  // Convidar Usuário (Apenas Leitor Master)
  const handleInviteUser = async () => {
    if (!isMaster) {
      toast('Ação não permitida', 'Apenas o criador do clube pode enviar convites.', 'warning');
      return;
    }

    const email = await prompt({
      title: 'Convidar Novo Leitor para o Clube',
      description: 'Digite o e-mail ou nome de usuário que receberá a solicitação de entrada.',
      placeholder: 'ex: leitor@exemplo.com',
      confirmLabel: 'Enviar Convite',
    });

    if (!email) return;

    const newMember: ClubMemberItem = {
      id: `m_${Date.now()}`,
      userId: `usr_invited_${Date.now()}`,
      userName: email.split('@')[0],
      userEmail: email,
      userRole: 'FREE',
      memberRole: 'MEMBER',
      joinedAt: new Date().toISOString(),
      status: 'INVITED', // Aguarda aceitação
    };

    setClub((prev) => ({
      ...prev,
      members: [...(prev.members || []), newMember],
    }));

    toast('Convite Enviado!', `A solicitação foi enviada para ${email}.`, 'success');
  };

  // Excluir Usuário (Apenas Leitor Master)
  const handleRemoveMember = async (member: ClubMemberItem) => {
    if (!isMaster) return;

    if (member.memberRole === 'MASTER') {
      toast('Ação inválida', 'Você não pode remover o criador do clube.', 'warning');
      return;
    }

    const confirmed = await confirm({
      title: 'Remover Membro do Clube',
      description: `Tem certeza que deseja remover ${member.userName} deste clube de leitura?`,
      confirmLabel: 'Remover Membro',
      isDestructive: true,
    });

    if (!confirmed) return;

    setClub((prev) => ({
      ...prev,
      members: (prev.members || []).filter((m) => m.id !== member.id),
      memberCount: Math.max(1, prev.memberCount - 1),
    }));

    toast('Membro Removido', `${member.userName} foi removido do clube.`, 'info');
  };

  // Adicionar Livro na Estante do Clube (Exclusivo do Criador)
  const handleAddBookToClubShelf = (newBook: BookItem) => {
    if (!isMaster) {
      toast('Acesso negado', 'Apenas o criador do clube pode adicionar livros à estante oficial.', 'warning');
      return;
    }

    setClub((prev) => {
      const currentShelf = prev.shelf || {
        id: `shelf_${prev.id}`,
        name: `Estante Oficial de ${prev.name}`,
        theme: 'WOOD',
        isPublic: true,
        books: [],
        createdAt: new Date().toISOString(),
      };

      return {
        ...prev,
        shelf: {
          ...currentShelf,
          books: [...currentShelf.books, newBook],
        },
      };
    });
  };

  // Definir como Livro de Leitura da Vez
  const handleSetCurrentBook = async () => {
    if (!isMaster) return;

    toast(
      'Atualizar Leitura da Vez',
      'Abra o popup de adicionar obra para escolher o novo livro do mês.',
      'info'
    );
    setIsAddBookModalOpen(true);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      
      {/* Voltar e Navegação */}
      <div className="flex items-center gap-3">
        <Link
          href="/clubs"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white hover:border-slate-700 transition"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Todos os Clubes</span>
        </Link>
      </div>

      {/* Hero Banner do Clube */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-950/80 via-slate-900 to-indigo-950/80 border border-slate-800 p-6 sm:p-10 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-400">
              <Crown className="h-3.5 w-3.5" />
              <span>Criado por {club.masterName}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">{club.name}</h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{club.description}</p>
          </div>

          {/* Destaque: Livro de Leitura da Vez */}
          {club.currentBook ? (
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-950/85 border border-amber-500/30 shadow-xl shrink-0">
              <div className="relative w-16 h-24 rounded-lg overflow-hidden shadow-md bg-slate-900 border border-slate-700">
                <Image src={club.currentBook.coverUrl} alt={club.currentBook.title} fill className="object-cover" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 block">
                  📖 Leitura da Vez
                </span>
                <h3 className="text-sm font-bold text-white max-w-[180px] truncate">{club.currentBook.title}</h3>
                <p className="text-xs text-slate-400 max-w-[180px] truncate">{club.currentBook.authors}</p>
                {club.readingDeadline && (
                  <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-1">
                    <Calendar className="h-3 w-3 text-amber-400" />
                    Prazo: {club.readingDeadline}
                  </p>
                )}
              </div>
            </div>
          ) : (
            isMaster && (
              <button
                onClick={handleSetCurrentBook}
                className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition shadow-lg"
              >
                <Plus className="h-4 w-4" />
                <span>Definir Livro da Vez</span>
              </button>
            )
          )}
        </div>

        {/* Abas de Navegação Interna do Clube */}
        <div className="flex items-center gap-2 pt-4 border-t border-white/10">
          <button
            onClick={() => setActiveTab('SHELF')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'SHELF'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>Estante do Clube</span>
          </button>

          <button
            onClick={() => setActiveTab('CHAT')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'CHAT'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            <span>Chat da Comunidade ({(club.messages || []).length})</span>
          </button>

          <button
            onClick={() => setActiveTab('MEMBERS')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'MEMBERS'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Membros Leitores ({(club.members || []).length})</span>
          </button>
        </div>
      </div>

      {/* ======================================================================
          CONTEÚDO DA ABA 1: ESTANTE OFICIAL DO CLUBE
          ====================================================================== */}
      {activeTab === 'SHELF' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-white">Estante de Leituras Coletivas</h2>
              <p className="text-xs text-slate-400">
                {isMaster
                  ? 'Como Leitor Master, você tem a permissão exclusiva de gerenciar e adicionar livros nesta estante.'
                  : 'Obras recomendadas pela liderança do clube para debate dos membros.'}
              </p>
            </div>

            {isMaster && (
              <button
                onClick={() => setIsAddBookModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition shadow-lg shadow-amber-900/30"
              >
                <Plus className="h-4 w-4 stroke-[3]" />
                <span>Adicionar Obra à Estante do Clube</span>
              </button>
            )}
          </div>

          <VirtualShelf
            shelf={
              club.shelf || {
                id: `shelf_${club.id}`,
                name: `Estante Oficial de ${club.name}`,
                theme: 'WOOD',
                isPublic: true,
                books: [],
                createdAt: new Date().toISOString(),
              }
            }
            userRole={isMaster ? 'MASTER' : 'FREE'}
            onBookClick={(b) => {
              setSelectedBook(b);
              setIsBookModalOpen(true);
            }}
            onAddBookClick={isMaster ? () => setIsAddBookModalOpen(true) : undefined}
          />
        </div>
      )}

      {/* ======================================================================
          CONTEÚDO DA ABA 2: CHAT DO CLUBE
          ====================================================================== */}
      {activeTab === 'CHAT' && (
        <div className="rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col h-[600px] overflow-hidden">
          {/* Header do Chat */}
          <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">Bate-papo de Leitura - {club.name}</h3>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">Livre de spoilers</span>
          </div>

          {/* Mensagens */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {(club.messages || []).map((msg) => {
              const isCurrentUser = msg.userId === user?.id;
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-bold text-slate-300">{msg.userName}</span>
                    <span className="text-[9px] text-slate-500 font-mono">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div
                    className={`p-3.5 rounded-2xl max-w-md text-xs leading-relaxed ${
                      isCurrentUser
                        ? 'bg-amber-500 text-slate-950 font-medium shadow-md rounded-tr-none'
                        : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Input de Envio */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-800 bg-slate-950/80 flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Compartilhe suas reflexões sobre a leitura do clube..."
              className="flex-1 h-11 px-4 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none transition shadow-inner"
            />
            <button
              type="submit"
              className="px-5 h-11 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition flex items-center gap-1.5 shadow"
            >
              <Send className="h-4 w-4" />
              <span>Enviar</span>
            </button>
          </form>
        </div>
      )}

      {/* ======================================================================
          CONTEÚDO DA ABA 3: LISTA DE USUÁRIOS & GESTÃO DO LEITOR MASTER
          ====================================================================== */}
      {activeTab === 'MEMBERS' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-white">Membros do Clube</h2>
              <p className="text-xs text-slate-400">
                Leitores ativos e solicitações de entrada com aprovação necessária.
              </p>
            </div>

            {isMaster && (
              <button
                onClick={handleInviteUser}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black text-xs transition shadow-lg shadow-amber-900/30"
              >
                <UserPlus className="h-4 w-4" />
                <span>Solicitar Entrada para Usuário</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(club.members || []).map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-amber-400">
                    {member.userName.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-white">{member.userName}</h4>
                      {member.memberRole === 'MASTER' && (
                        <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[9px] font-bold flex items-center gap-0.5">
                          <Crown className="h-2.5 w-2.5" /> Criador
                        </span>
                      )}
                      {member.status === 'INVITED' && (
                        <span className="px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30 text-[9px] font-bold flex items-center gap-0.5">
                          <Clock className="h-2.5 w-2.5" /> Convite Pendente
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{member.userEmail}</p>
                  </div>
                </div>

                {/* Ações do Leitor Master sobre os membros */}
                {isMaster && member.memberRole !== 'MASTER' && (
                  <button
                    onClick={() => handleRemoveMember(member)}
                    title="Excluir usuário do clube"
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal de Detalhes da Obra */}
      <BookModal
        book={selectedBook}
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
      />

      {/* Popup de Busca para Adicionar Livro na Estante do Clube */}
      <AddBookSearchModal
        isOpen={isAddBookModalOpen}
        onClose={() => setIsAddBookModalOpen(false)}
        shelfName={`Estante Oficial de ${club.name}`}
        onBookSelected={handleAddBookToClubShelf}
      />
    </div>
  );
}
