# Product Context: Gestión Educativa Cantabria

## Why This Exists

La aplicación proporciona una plataforma digital para la gestión integral de un Instituto de Secundaria y Bachillerato, facilitando:
- Cumplimiento normativo LOMLOE
- Evaluación por competencias
- Seguimiento del progreso del alumnado
- Colaboración entre departamentos

## User Flows

### Administrador
1. Login → Panel Admin → CRUD Departamentos/Profesores/Materias/Grupos
2. Asignar Jefaturas de Departamento
3. Configurar carga lectiva (profesor → materia → grupo)

### Jefe de Departamento
1. Login → Panel Departamento → Ver Programación
2. Editar Programación Didáctica
3. Crear/Editar Situaciones de Aprendizaje (SDA)
4. Configurar pesos de Criterios de Evaluación

### Profesor
1. Login → Cuaderno de Calificaciones
2. Seleccionar Grupo y SDA
3. Evaluar alumnos por criterios
4. Ver gráficos de competencias de la clase

## UX Goals

- Interfaz limpia tipo Dashboard profesional
- Navegación intuitiva por roles
- Visualización clara del progreso en competencias
- Informes finales con gráficos (Radar/Barras)
- Acceso rápido a programaciones y SDAs

## LOMLOE Cantabria Specifics

### Estructura SDA (Modelo Cantabria)
1. **Contextualización**: Descripción del contexto educativo
2. **Justificación**: Fundamentación del enfoque
3. **Conexión**: Vinculación con competencias específicas
4. **Criterios**: Criterios de evaluación relacionados
5. **Actividades**: Secuencia de actividades
6. **Recursos**: Materiales necesarios
7. **Atención a la diversidad**: Adaptaciones

### Evaluación por Competencias
- Niveles: En Inicio (1), En Desarrollo (2), Adquirido (3), Dominado (4)
- Cálculo automático: media ponderada por pesos de criterios
- Informes trimestrales y finales