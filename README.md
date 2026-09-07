# 📚 Meu Clube do Livro

> Aplicação Fullstack TypeScript para rede social de leitores de livros, HQs e mangás com estantes virtuais interativas e clubes de leitura.

Para acessar a documentação detalhada com arquitetura, modelo de negócios, estratégia de monetização e roadmap, consulte:
📖 [Especificação do Projeto (DOCS/PROJECT_SPEC.md)](./DOCS/PROJECT_SPEC.md)

---

## 🛠️ Tech Stack
- **Frontend**: Next.js 14+ (App Router), React 18, Tailwind CSS, Framer Motion
- **Backend**: Next.js Server Actions & API Routes
- **Database**: PostgreSQL (Supabase/Neon) + Prisma ORM
- **Auth**: NextAuth.js / Supabase Auth
- **APIs de Terceiros**: Google Books API, Jikan (MAL API), Stripe Billing

---

## 🚀 Como Iniciar (Desenvolvimento)

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente (.env.local)
# DATABASE_URL=...
# NEXTAUTH_SECRET=...

# 3. Rodar migrações do banco
npx prisma db push

# 4. Iniciar servidor de desenvolvimento
npm run dev
```
