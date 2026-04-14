# Active Context: Gestión Educativa Cantabria (LOMLOE)

## Current State

**Project Status**: ✅ Completado - Instituto de Secundaria y Bachillerato

Aplicación web de gestión educativa complying with LOMLOE and Consejeria de Educación de Cantabria regulations.

## Recently Completed

- [x] Schema Prisma con modelo LOMLOE (Competencias Clave, Específicas, Criterios, Saberes)
- [x] Estructura de carpetas del proyecto Next.js 16
- [x] Componentes UI (Button, Card, Select, Table, Badge, Dialog, Textarea, Input, Label)
- [x] Dashboard layout con navegación por roles
- [x] Autenticación NextAuth.js con credentials
- [x] Login pages con validación
- [x] Panel Administrador CRUD completo (Departamentos, Profesores, Materias, Grupos)
- [x] Panel Jefe de Departamento - Programaciones Didácticas
- [x] Página Cuaderno de Calificaciones con evaluación por SDA
- [x] Informe final por alumno con gráficos (Radar, Barras, Línea)
- [x] Conexión a Neon PostgreSQL configurada
- [x] Schema publicado a la base de datos (db push)
- [x] Seed de datos con usuarios de prueba

## Estructura del Proyecto

| Directorio | Propósito |
|------------|-----------|
| `prisma/schema.prisma` | Modelo de datos LOMLOE |
| `prisma/seed.ts` | Datos de prueba |
| `src/lib/` | Utils, DB y Auth |
| `src/components/ui/` | Componentes Shadcn/UI |
| `src/app/(dashboard)/` | Dashboard del sistema |
| `src/app/(dashboard)/admin/` | Panel Administrador |
| `src/app/(dashboard)/programaciones/` | Programaciones Didácticas |
| `src/app/(dashboard)/calificaciones/` | Cuaderno de calificaciones |
| `src/app/(dashboard)/informes/` | Informes de evaluación |
| `src/app/(auth)/login/` | Página de login |
| `src/app/api/` | API routes |

## Funcionalidades Implementadas

### Autenticación
- NextAuth.js con credentials provider
- Roles: ADMINISTRADOR, JEFE_DEPARTAMENTO, PROFESOR
- Contraseñas hasheadas con bcrypt
- Sesión JWT con información de usuario

### Panel Administrador
- CRUD Departamentos
- CRUD Profesores (con asignación de departamento y rol)
- CRUD Materias (con nivel educativo y horas semanales)
- CRUD Grupos (ESO/Bachillerato con curso y letra)

### Programaciones Didácticas (Jefe Dept.)
- Crear/Editar programaciones por materia
- Campos: objetivo general, evaluación, recuperación, actividades
- Vinculación con departamento del jefe

### Cuaderno de Calificaciones (Profesor)
- Selector de grupo, SDA y trimestre
- Tabla de evaluación por criterios con pesos%
- Niveles: En Inicio, En Desarrollo, Adquirido, Dominado
- Gráficos Radar y Barras de competencias

### Informes de Evaluación
- Selector de alumno y trimestre
- Progreso de notas por gráfico de línea
- Radar de competencias alcanzadas
- Barras apiladas por nivel de competencia
- Resumen de criterios de evaluación
- Exportar PDF (botón)

## Credenciales de Prueba

| Email | Contraseña | Rol |
|-------|------------|-----|
| admin@instituto.es | admin123 | Administrador |
| jefe@instituto.es | jefe123 | Jefe de Departamento |
| profesor@instituto.es | prof123 | Profesor |

## Pendiente

- [ ] Crear/Editar Situaciones de Aprendizaje (SDA)
- [ ] Asignar carga lectiva (profesor → materia → grupo)
- [ ] Panel de родитель/es para familias
- [ ] Notificaciones y alertas

## Session History

| Date | Changes |
|------|---------|
| 2026-04-14 | Implementación completa: Auth, Admin, Programaciones, Calificaciones, Informes |
| 2026-04-14 | Schema Prisma + estructura proyecto + Cuaderno de Calificaciones |
| Initial | Template Next.js base |