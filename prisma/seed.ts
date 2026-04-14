import { prisma } from "@/lib/db"
import { hash } from "bcryptjs"

async function main() {
  console.log("Creating seed data...")

  // Create competencias clave
  const competenciasClave = await Promise.all([
    prisma.competenciaClave.create({
      data: {
        codigo: "CCL",
        nombre: "Competencia en Comunicación Lingüística",
        descripcion: "capacidad para interactuar en contextos sociales y culturales diversos",
      },
    }),
    prisma.competenciaClave.create({
      data: {
        codigo: "CMCT",
        nombre: "Competencia Matemática y en Ciencia y Tecnología",
        descripcion: "capacidad para usar el conocimiento científico y matemático",
      },
    }),
    prisma.competenciaClave.create({
      data: {
        codigo: "CD",
        nombre: "Competencia Digital",
        descripcion: "capacidad para usar las tecnologías digitales de forma segura y crítica",
      },
    }),
    prisma.competenciaClave.create({
      data: {
        codigo: "CP",
        nombre: "Competencia Personal, Social y de Aprender a Aprender",
        descripcion: "capacidad para gestionar el propio aprendizaje",
      },
    }),
    prisma.competenciaClave.create({
      data: {
        codigo: "CSC",
        nombre: "Competencia en Sentido de Iniciativa y Espíritu Emprendedor",
        descripcion: "capacidad para transformar ideas en acciones",
      },
    }),
    prisma.competenciaClave.create({
      data: {
        codigo: "CE",
        nombre: "Competencia en Conciencia y Expresión Cultural",
        descripcion: "capacidad para apreciar y crear expresiones culturales",
      },
    }),
    prisma.competenciaClave.create({
      data: {
        codigo: "CC",
        nombre: "Competencia Plurilingüe",
        descripcion: "capacidad para usar diferentes lenguas de manera adecuada",
      },
    }),
  ])

  console.log("Created competencias clave")

  // Create departamento
  const departamento = await prisma.departamento.create({
    data: {
      nombre: "Departamento de Tecnología",
      codigo: "TEC",
    },
  })

  console.log("Created departamento")

  // Create users
  const adminPassword = await hash("admin123", 10)
  const jefePassword = await hash("jefe123", 10)
  const profPassword = await hash("prof123", 10)

  const admin = await prisma.user.create({
    data: {
      email: "admin@instituto.es",
      password: adminPassword,
      nombre: "Administrador",
      apellido1: "Sistema",
      role: "ADMINISTRADOR",
    },
  })

  const jefe = await prisma.user.create({
    data: {
      email: "jefe@instituto.es",
      password: jefePassword,
      nombre: "Carlos",
      apellido1: "García",
      role: "JEFE_DEPARTAMENTO",
      departamentoId: departamento.id,
    },
  })

  const prof = await prisma.user.create({
    data: {
      email: "profesor@instituto.es",
      password: profPassword,
      nombre: "María",
      apellido1: "López",
      role: "PROFESOR",
      departamentoId: departamento.id,
    },
  })

  console.log("Created users")
  console.log("  admin@instituto.es / admin123")
  console.log("  jefe@instituto.es / jefe123")
  console.log("  profesor@instituto.es / prof123")

  // Create materia
  const materia = await prisma.materia.create({
    data: {
      nombre: "Tecnología",
      codigo: "TEC1",
      departamentoId: departamento.id,
      nivelEducativo: "ESO",
      horasSemanales: 2,
    },
  })

  // Create competencias específicas
  for (const comp of competenciasClave.slice(0, 3)) {
    await prisma.competenciaEspecifica.create({
      data: {
        codigo: `${comp.codigo}-1`,
        nombre: `Competencia ${comp.codigo} - Nivel 1`,
        descripcion: `Desarrollo de la competencia ${comp.nombre}`,
        materiaId: materia.id,
        competenciaClaveId: comp.id,
      },
    })
  }

  console.log("Created materia y competencias específicas")

  // Create grupo
  const grupo = await prisma.grupo.create({
    data: {
      nombre: "1º ESO A",
      nivelEducativo: "ESO",
      curso: 1,
      letra: "A",
    },
  })

  // Create grupoMateria
  const grupoMateria = await prisma.grupoMateria.create({
    data: {
      grupoId: grupo.id,
      materiaId: materia.id,
    },
  })

  // Assign profesor to grupoMateria
  await prisma.grupoProfesor.create({
    data: {
      userId: prof.id,
      grupoMateriaId: grupoMateria.id,
    },
  })

  console.log("Created grupo y asignación")

  // Create students
  const estudiantes = [
    { nombre: "Alejandro", apellido1: "Fernández", nif: "12345678A" },
    { nombre: "María", apellido1: "López", nif: "23456789B" },
    { nombre: "Carlos", apellido1: "Ruiz", nif: "34567890C" },
    { nombre: "Ana", apellido1: "García", nif: "45678901D" },
    { nombre: "David", apellido1: "Pérez", nif: "56789012E" },
  ]

  for (const est of estudiantes) {
    await prisma.alumno.create({
      data: {
        nombre: est.nombre,
        apellido1: est.apellido1,
        nif: est.nif,
        fechaNac: new Date("2014-01-15"),
        grupoId: grupo.id,
      },
    })
  }

  console.log("Created students")
  console.log("Seed completed!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })