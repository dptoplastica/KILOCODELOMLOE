# Technical Context: Gestión Educativa Cantabria

## Technology Stack

| Technology   | Version   | Purpose                         |
|---------------|-----------|--------------------------------|
| Next.js       | 16.x      | React framework with App Router|
| React         | 19.x      | UI library                     |
| TypeScript    | 5.9.x     | Type-safe JavaScript           |
| Tailwind CSS  | 4.x       | Utility-first CSS              |
| Bun           | Latest    | Package manager & runtime      |
| Prisma        | 6.x       | ORM for PostgreSQL (Neon)     |
| NextAuth.js   | 4.x       | Authentication                 |
| Recharts      | 2.x       | Charts for competency viz      |
| Shadcn/UI     | Latest    | UI components (Radix)          |

## Project Structure

```
/
├── prisma/
│   └── schema.prisma           # LOMLOE data model
├── src/
│   ├── lib/
│   │   ├── db.ts              # Prisma client singleton
│   │   └── utils.ts           # CN utility for Tailwind
│   ├── components/
│   │   └── ui/                 # Shadcn/UI components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── select.tsx
│   │       ├── table.tsx
│   │       └── badge.tsx
│   └── app/
│       ├── (dashboard)/        # Dashboard routes
│       │   ├── layout.tsx      # Dashboard shell
│       │   └── calificaciones/
│       │       └── page.tsx    # Cuaderno de Calificaciones
│       ├── globals.css
│       └── layout.tsx
└── package.json
```

## Commands

```bash
bun install        # Install dependencies
bun dev            # Start dev server
bun build          # Production build
bun typecheck      # TypeScript check
bun lint           # ESLint
bun db:push        # Push schema to Neon
bun db:generate    # Generate Prisma client
bun db:studio      # Open Prisma Studio
```

## Environment Variables

Create `.env.local`:
```env
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000
```