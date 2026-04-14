# Active Context: Gestión Educativa Cantabria (LOMLOE)

## Current State

**Project Status**: ✅ En desarrollo - Instituto de Secundaria y Bachillerato

Aplicación web de gestión educativa complying with LOMLOE and Consejeria de Educación de Cantabria regulations.

## Recently Completed

- [x] Schema Prisma con modelo LOMLOE (Competencias Clave, Específicas, Criterios, Saberes)
- [x] Estructura de carpetas del proyecto Next.js 16
- [x] Componentes UI (Button, Card, Select, Table, Badge)
- [x] Dashboard layout con navegación
- [x] Página Cuaderno de Calificaciones con evaluación por SDA
- [x] Gráficos Recharts para visualización de competencias
- [x] Conexión a Neon PostgreSQL configurada
- [x] Schema publicado a la base de datos (db push)

## Estructura del Proyecto

| Directorio | Propósito |
|------------|-----------|
| `prisma/schema.prisma` | Modelo de datos LOMLOE |
| `src/lib/` | Utils y conexión BD |
| `src/components/ui/` | Componentes Shadcn/UI |
| `src/app/(dashboard)/` | Dashboard del sistema |
| `src/app/(dashboard)/calificaciones/` | Cuaderno de calificaciones |

## Funcionalidades Implementadas

### Cuaderno de Calificaciones (Profesor)
- Selector de grupo, SDA y trimestre
- Tabla de evaluación por criterios con pesos porcentuales
- Cálculo automático de nota final
- Niveles de competencia: En Inicio, En Desarrollo, Adquirido, Dominado
- Gráficos Radar y Barras para visualización de progreso

### Schema LOMLOE
- Competencias Clave (CCL, CMCT, CD, CP, CSC, CE, CC)
- Competencias Específicas por materia
- Criterios de Evaluación con peso porcentual configurable
- Situaciones de Aprendizaje (SDA) con modelo Cantabria
- Calificaciones vinculadas a criterios

## Pendiente

- [ ] Autenticación (NextAuth.js / Clerk)
- [ ] Panel Administrador (CRUD Departamentos, Materias, Grupos)
- [ ] Panel Jefe de Departamento (Programaciones Didácticas)
- [ ] Generar informe final por alumno

## Session History

| Date | Changes |
|------|---------|
| 2026-04-14 | Schema Prisma + estructura proyecto + Cuaderno de Calificaciones |
| Initial | Template Next.js base |