# Project Brief: Gestión Educativa Cantabria (LOMLOE)

## Purpose

Web application for managing a Secondary and High School (Instituto de Secundaria y Bachillerato), complying with:
- LOMLOE (Ley Orgánica de Modificación de la LOE)
- Consejeria de Educación de Cantabria guidelines

## Target Users

- **Administrador**: CRUD de Departamentos, Profesores, Materias, Grupos, asignaciones de carga lectiva
- **Jefe de Departamento**: Editor de Programaciones Didácticas y Situaciones de Aprendizaje (SDA)
- **Profesor**: Cuaderno de Calificaciones para evaluar alumnos

## Core Features

### LOMLOE Competency Model
- Competencias Clave (7): CCL, CMCT, CD, CP, CSC, CE, CC
- Competencias Específicas por materia
- Criterios de Evaluación con peso porcentual configurable
- Saberes Básicos (bloques temáticos)

### Programaciones Didácticas
- Vinculadas a departamentos
- Editor de SDA modelo Cantabria (Contextualización, Justificación, Competencias, Criterios)

### Calificaciones
- Evaluaciones trimestrales (1ª, 2ª, 3ª) y Final
- Basadas en grado de adquisición de competencias
- Cálculo automático con pesos de criterios
- Informe final con gráficos de competencias

## Success Metrics

- Schema Prisma validación exitosa
- typecheck y lint sin errores
- UI funcional del Cuaderno de Calificaciones

## Constraints

- Framework: Next.js 16 + App Router
- DB: Neon (PostgreSQL) + Prisma
- Auth: NextAuth.js o Clerk
- Styles: Tailwind CSS 4 + Shadcn/UI
- Package manager: Bun