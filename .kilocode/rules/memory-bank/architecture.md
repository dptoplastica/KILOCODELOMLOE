# System Patterns: Gestión Educativa Cantabria

## Architecture Overview

```
src/
├── app/                    # Next.js App Router
│   ├── (dashboard)/        # Dashboard (route group)
│   │   ├── layout.tsx      # Dashboard shell
│   │   └── calificaciones/
│   │       └── page.tsx   # Cuaderno de Calificaciones
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Landing/redirect
│   └── globals.css         # Tailwind + variables
├── lib/
│   ├── db.ts              # Prisma client singleton
│   └── utils.ts           # CN utility (clsx + tailwind-merge)
└── components/
    └── ui/                # Shadcn/UI components
        ├── button.tsx
        ├── card.tsx
        ├── select.tsx
        ├── table.tsx
        └── badge.tsx

prisma/
└── schema.prisma           # LOMLOE data model
```

## Key Design Patterns

### 1. App Router + Route Groups

Los grupos de rutas con `(dashboard)` permiten layout diferenciado sin cambiar URL:
- `(dashboard)/` → Dashboard autenticado
- `(public)/` → Páginas públicas (login, etc.)

### 2. Server Components por Defecto

Todos los componentes son Server Components excepto los que necesitan interacción:
```tsx
// Server Component - fetching de datos desde Prisma
export default async function Page() {
  const data = await prisma.alumno.findMany();
  return <Table data={data} />;
}

// Client Component - interactividad
"use client";
export function EvaluacionSelector() {
  const [trimestre, setTrimestre] = useState("PRIMERO");
  return <Select value={trimestre} onChange={setTrimestre} />;
}
```

### 3. Patrón de Evaluación por Competencias

```
Alumno → SDA → Criterios → Puntuación (1-4) → Nota (0-10)
```

- Criterios tienen `pesoPorcentual` configurable por Jefe Dept.
- Calificación se calcula automáticamente:
  - Nota = Σ(puntuación_criterio × peso) / Σ(pesos) × 2.5

### 4. Shadcn/UI + Tailwind

Componentes Radix con Tailwind para estilos:
```tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
```

## Styling Conventions

Tailwind CSS 4 con variables CSS customizadas:
```css
:root {
  --background: 0 0% 100%;
  --primary: 222.2 47.4% 11.2%;
  --radius: 0.5rem;
}
```

## State Management

- **Server State**: Prisma + Server Components
- **Client State**: useState/useReducer para componentes interactivos
- **Auth**: NextAuth.js (credentials provider)

## File Naming

- Componentes UI: PascalCase (`Button.tsx`)
- Utilidades: camelCase (`utils.ts`, `db.ts`)
- Páginas: lowercase (`page.tsx`, `layout.tsx`)