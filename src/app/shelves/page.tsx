'use client';

import React, { useState } from 'react';
import { Plus, BookOpen, Layers, Sparkles, Lock } from 'lucide-react';
import { VirtualShelf } from '@/components/shelf/VirtualShelf';
import { ShelfData, BookItem, Role } from '@/types';
import { BookModal } from '@/components/shelf/BookModal';
import { AddBookSearchModal } from '@/components/shelf/AddBookSearchModal';
import { useNotification } from '@/components/ui/NotificationProvider';
import { useAuth } from '@/context/AuthContext';

export default function ShelvesPage() {
  const { toast, prompt } = useNotification();
  const { user } = useAuth();
  const userRole = user?.role || 'FREE';

  // Estado das Estantes do Usuário
  const [shelves, setShelves] = useState<ShelfData[]>([
    {
      id: 'shelf_1',
      name: '📖 Lendo Atualmente',
      description: 'Livros e mangás que estou lendo no momento',
      theme: 'WOOD',
      isPublic: true,
      createdAt: new Date().toISOString(),
      books: [
        {
          id: 'b1',
          title: 'Duna',
          authors: 'Frank Herbert',
          coverUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80',
          synopsis: 'A saga épica de Paul Atreides no desértico planeta Arrakis.',
          pageCount: 680,
          publishedYear: 1965,
          type: 'BOOK',
          status: 'READING',
          currentPage: 340,
          rating: 5,
        },
        {
          id: 'b2',
          title: 'One Piece - Vol. 1',
          authors: 'Eiichiro Oda',
          coverUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&auto=format&fit=crop&q=80',
          synopsis: 'Romance Dawn: O início do sonho de Monkey D. Luffy.',
          pageCount: 200,
          publishedYear: 1997,
          type: 'MANGA',
          status: 'READING',
          currentPage: 150,
          rating: 5,
        },
      ],
    },
    {
      id: 'shelf_2',
      name: '🏆 Favoritos inesquecíveis',
      description: 'Minhas obras favoritas de todos os tempos',
      theme: 'VINTAGE',
      isPublic: true,
      createdAt: new Date().toISOString(),
      books: [
        {
          id: 'b3',
          title: 'Watchmen: Edição Definitiva',
          authors: 'Alan Moore, Dave Gibbons',
          coverUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&auto=format&fit=crop&q=80',
          synopsis: 'Uma das HQs mais aclamadas da história dos quadrinhos.',
          pageCount: 416,
          publishedYear: 1986,
          type: 'COMIC',
          status: 'READ',
          rating: 5,
        },
        {
          id: 'b4',
          title: 'O Hobbit',
          authors: 'J.R.R. Tolkien',
          coverUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&auto=format&fit=crop&q=80',
          synopsis: 'A clássica jornada de Bilbo Bolseiro na Terra-média.',
          pageCount: 310,
          publishedYear: 1937,
          type: 'BOOK',
          status: 'READ',
          rating: 5,
        },
      ],
    },
  ]);

  const [selectedBook, setSelectedBook] = useState<BookItem | null>(null);
  const [activeShelfId, setActiveShelfId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Estado do Pop-up de busca rápida para adicionar livro em uma estante específica
  const [searchModalState, setSearchModalState] = useState<{
    isOpen: boolean;
    shelfId: string;
    shelfName: string;
  }>({
    isOpen: false,
    shelfId: '',
    shelfName: '',
  });

  // Validação de Limite de Estantes para o Plano Free (Máximo 2 estantes)
  const isFreeMaxShelvesReached = userRole === 'FREE' && shelves.length >= 2;

  const handleCreateShelf = async () => {
    if (isFreeMaxShelvesReached) {
      toast(
        'Limite do Plano FREE atingido!',
        'Você já possui 2 estantes virtuais. Assine o Leitor Plus ou Master para ter estantes ilimitadas.',
        'warning'
      );
      return;
    }

    const newShelfName = await prompt({
      title: 'Criar Nova Estante Virtual',
      description: 'Dê um nome para organizar seus livros, mangás ou quadrinhos.',
      placeholder: 'Ex: Ficção Científica Favorita, Mangás de Ação...',
      confirmLabel: 'Criar Estante',
    });

    if (!newShelfName) return;

    const newShelf: ShelfData = {
      id: `shelf_${Date.now()}`,
      name: newShelfName,
      description: 'Estante criada recentemente',
      theme: 'WOOD',
      isPublic: true,
      createdAt: new Date().toISOString(),
      books: [],
    };

    setShelves([...shelves, newShelf]);
    toast('Estante criada com sucesso!', `A estante "${newShelfName}" foi adicionada.`, 'success');
  };

  const handleOpenAddBookModal = (shelf: ShelfData) => {
    if (userRole === 'FREE' && shelf.books.length >= 30) {
      toast(
        'Limite de 30 livros atingido!',
        'O Plano FREE suporta até 30 obras por estante. Assine o Leitor Plus para livros ilimitados!',
        'warning'
      );
      return;
    }

    setSearchModalState({
      isOpen: true,
      shelfId: shelf.id,
      shelfName: shelf.name,
    });
  };

  const handleAddBookToShelf = (newBook: BookItem) => {
    setShelves((prevShelves) =>
      prevShelves.map((shelf) => {
        if (shelf.id === searchModalState.shelfId) {
          const alreadyExists = shelf.books.some((b) => b.id === newBook.id || b.title === newBook.title);
          if (alreadyExists) return shelf;
          return {
            ...shelf,
            books: [...shelf.books, newBook],
          };
        }
        return shelf;
      })
    );
  };

  const handleSaveBook = (updatedBook: BookItem) => {
    setShelves((prevShelves) =>
      prevShelves.map((shelf) => ({
        ...shelf,
        books: shelf.books.map((b) => (b.id === updatedBook.id ? updatedBook : b)),
      }))
    );
  };

  const handleRemoveBook = (bookId: string) => {
    setShelves((prevShelves) =>
      prevShelves.map((shelf) => ({
        ...shelf,
        books: shelf.books.filter((b) => b.id !== bookId),
      }))
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header com Informações da Conta e Botão de Nova Estante */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-black text-white">Minhas Estantes Virtuais</h1>
          <p className="text-xs text-slate-400 mt-1">
            Gerencie suas prateleiras, acompanhe o progresso e troque de tema visual.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Botão Nova Estante */}
          <button
            onClick={handleCreateShelf}
            disabled={isFreeMaxShelvesReached}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-lg ${
              isFreeMaxShelvesReached
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 shadow-amber-900/30'
            }`}
          >
            {isFreeMaxShelvesReached ? <Lock className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            <span>Nova Estante</span>
          </button>
        </div>
      </div>

      {/* Lista de Estantes Virtuais com o botão "Adicionar Obra" que abre o popup de busca */}
      <div className="space-y-12">
        {shelves.map((shelf) => (
          <VirtualShelf
            key={shelf.id}
            shelf={shelf}
            userRole={userRole}
            onBookClick={(book) => {
              setSelectedBook(book);
              setActiveShelfId(shelf.id);
              setIsModalOpen(true);
            }}
            onAddBookClick={() => handleOpenAddBookModal(shelf)}
            onThemeChange={(newTheme) => {
              setShelves((prev) =>
                prev.map((s) => (s.id === shelf.id ? { ...s, theme: newTheme } : s))
              );
            }}
          />
        ))}
      </div>

      {/* Modal de Detalhes / Atualização de Leitura */}
      <BookModal
        book={selectedBook}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveBook}
        onRemove={handleRemoveBook}
      />

      {/* Pop-up de Busca e Inclusão Direta na Estante Selecionada */}
      <AddBookSearchModal
        isOpen={searchModalState.isOpen}
        onClose={() => setSearchModalState((prev) => ({ ...prev, isOpen: false }))}
        shelfName={searchModalState.shelfName}
        onBookSelected={handleAddBookToShelf}
      />
    </div>
  );
}
