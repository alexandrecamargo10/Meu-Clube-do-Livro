'use client';

import React, { useState } from 'react';
import { Plus, BookOpen, Layers, Sparkles, Lock } from 'lucide-react';
import { VirtualShelf } from '@/components/shelf/VirtualShelf';
import { ShelfData, BookItem, Role } from '@/types';
import { BookModal } from '@/components/shelf/BookModal';

export default function ShelvesPage() {
  // Simulação do Nível de Assinatura (FREE, PLUS, MASTER)
  const [userRole, setUserRole] = useState<Role>('FREE');

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

  // Validação de Limite de Estantes para o Plano Free (Máximo 2 estantes)
  const isFreeMaxShelvesReached = userRole === 'FREE' && shelves.length >= 2;

  const handleCreateShelf = () => {
    if (isFreeMaxShelvesReached) {
      alert('Limite do Plano FREE atingido (máximo de 2 estantes). Assine o Leitor Plus ou Master para criar estantes ilimitadas!');
      return;
    }

    const newShelfName = prompt('Digite o nome da nova estante:');
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
      
      {/* Header com Seletor de Role para Demonstração de Aprendizado */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-black text-white">Minhas Estantes Virtuais</h1>
          <p className="text-xs text-slate-400 mt-1">
            Gerencie suas prateleiras, acompanhe o progresso e troque de tema visual.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Seletor de Simulação de Plano */}
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

      {/* Lista de Estantes Virtuais */}
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
            onThemeChange={(newTheme) => {
              setShelves((prev) =>
                prev.map((s) => (s.id === shelf.id ? { ...s, theme: newTheme } : s))
              );
            }}
          />
        ))}
      </div>

      {/* Modal de Interação com o Livro */}
      <BookModal
        book={selectedBook}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveBook}
        onRemove={handleRemoveBook}
      />
    </div>
  );
}
