'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, Search, Users, Crown, Sparkles, ArrowRight, ShieldCheck, Heart, Star } from 'lucide-react';
import { VirtualShelf } from '@/components/shelf/VirtualShelf';
import { ShelfData, BookItem } from '@/types';
import { BookModal } from '@/components/shelf/BookModal';

export default function HomePage() {
  const [selectedBook, setSelectedBook] = useState<BookItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Estante de demonstração para a Landing Page
  const demoShelf: ShelfData = {
    id: 'demo_shelf_1',
    name: '📚 Obras em Destaque da Comunidade',
    description: 'Experimente clicar nos livros ou alterar o tema da estante abaixo!',
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
        status: 'READ',
        rating: 5,
      },
      {
        id: 'b3',
        title: 'Watchmen',
        authors: 'Alan Moore',
        coverUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&auto=format&fit=crop&q=80',
        synopsis: 'Quem vigia os vigilantes? A HQ que redefiniu o gênero.',
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
        synopsis: 'A inesquecível aventura de Bilbo Bolseiro.',
        pageCount: 310,
        publishedYear: 1937,
        type: 'BOOK',
        status: 'WANT_TO_READ',
      },
    ],
  };

  return (
    <div className="space-y-20 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/20 via-slate-950 to-slate-950 -z-10" />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-8">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-400"
          >
            <Sparkles className="h-4 w-4" />
            <span>Rede Social de Livros, Mangás e HQs com Estantes 3D</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto"
          >
            Sua biblioteca física ganha vida na <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-200">estante virtual</span>.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed"
          >
            Crie estantes interativas com temas realistas, acompanhe seu progresso de leitura, participe de clubes gerenciados por Leitores Master e conecte-se com outros apaixonados por histórias.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link
              href="/shelves"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm shadow-xl shadow-amber-900/30 flex items-center justify-center gap-2 group transition"
            >
              <span>Ver Minhas Estantes 3D</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/clubs"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm border border-slate-800 flex items-center justify-center gap-2 transition"
            >
              <Users className="h-4 w-4 text-amber-400" />
              <span>Explorar Clubes de Leitura</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Demo da Estante Virtual Interativa */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-white">Estantes Virtuais Personalizáveis</h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Escolha entre temas de Madeira, Dark Obsidian, Cyberpunk Neon ou Biblioteca de Época.
          </p>
        </div>

        <VirtualShelf
          shelf={demoShelf}
          userRole="MASTER"
          onBookClick={(book) => {
            setSelectedBook(book);
            setIsModalOpen(true);
          }}
        />
      </section>

      {/* Destaques das Funcionalidades */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <BookOpen className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Catálogo Unificado</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Busca em tempo real no Google Books API e Jikan (MAL API) para catalogar livros, mangás e quadrinhos com capas em alta definição.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Crown className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Clubes & Leitor Master</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Torne-se um Leitor Master para criar grupos de leitura, selecionar a obra do mês, definir metas de capítulos e moderar discussões anti-spoiler.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Experiência Freemium SaaS</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Plano FREE com permissões básicas para todos os leitores e planos Plus / Master para colecionadores e criadores de comunidade.
            </p>
          </div>

        </div>
      </section>

      {/* Modal de Detalhes do Livro */}
      <BookModal
        book={selectedBook}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(updated) => {
          setSelectedBook(updated);
        }}
      />
    </div>
  );
}
