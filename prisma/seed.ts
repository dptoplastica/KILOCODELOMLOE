import { prisma } from "@/lib/db"
import { hash } from "bcryptjs"

async function main() {
  console.log("Creating/upserting seed data...")

  // Create competencias clave (upsert)
  const competenciasData = [
    { codigo: "CCL", nombre: "Competencia en Comunicación Lingüística", descripcion: "capacidad para interactuar en contextos sociales y culturales diversos" },
    { codigo: "CMCT", nombre: "Competencia Matemática y en Ciencia y Tecnología", descripcion: "capacidad para usar el conocimiento científico y matemático" },
    { codigo: "CD", nombre: "Competencia Digital", descripcion: "capacidad para usar las tecnologías digitales de forma segura y crítica" },
    { codigo: "CP", nombre: "Competencia Personal, Social y de Aprender a Aprender", descripcion: "capacidad para gestionar el propio aprendizaje" },
    { codigo: "CSC", nombre: "Competencia en Sentido de Iniciativa y Espíritu Emprendedor", descripcion: "capacidad para transformar ideas en acciones" },
    { codigo: "CE", nombre: "Competencia en Conciencia y Expresión Cultural", descripcion: "capacidad para apreciar y crear expresiones culturales" },
    { codigo: "CC", nombre: "Competencia Plurilingüe", descripcion: "capacidad para usar diferentes lenguas de manera adecuada" },
  ]

  for (const comp of competenciasData) {
    await prisma.competenciaClave.upsert({
      where: { codigo: comp.codigo },
      update: {},
      create: comp,
    })
  }
  console.log("Created/verified competencias clave")

  // Create or get departamento
  const departamento = await prisma.departamento.upsert({
    where: { codigo: "TEC" },
    update: {},
    create: { nombre: "Departamento de Tecnología", codigo: "TEC" },
  })
  console.log("Created/verified departamento")

  // Create users (upsert by email)
  const adminPassword = await hash("admin123", 10)
  const jefePassword = await hash("jefe123", 10)
  const profPassword = await hash("prof123", 10)

  await prisma.user.upsert({
    where: { email: "admin@instituto.es" },
    update: { password: adminPassword },
    create: {
      email: "admin@instituto.es",
      password: adminPassword,
      nombre: "Administrador",
      apellido1: "Sistema",
      role: "ADMINISTRADOR",
    },
  })

  await prisma.user.upsert({
    where: { email: "jefe@instituto.es" },
    update: { password: jefePassword },
    create: {
      email: "jefe@instituto.es",
      password: jefePassword,
      nombre: "Carlos",
      apellido1: "García",
      role: "JEFE_DEPARTAMENTO",
      departamentoId: departamento.id,
    },
  })

  await prisma.user.upsert({
    where: { email: "profesor@instituto.es" },
    update: { password: profPassword },
    create: {
      email: "profesor@instituto.es",
      password: profPassword,
      nombre: "María",
      apellido1: "López",
      role: "PROFESOR",
      departamentoId: departamento.id,
    },
  })

  console.log("Created/verified users")
  console.log("  admin@instituto.es / admin123")
  console.log("  jefe@instituto.es / jefe123")
  console.log("  profesor@instituto.es / prof123")

  // Create or get materia
  const materia = await prisma.materia.upsert({
    where: { codigo: "TEC1" },
    update: {},
    create: {
      nombre: "Tecnología",
      codigo: "TEC1",
      departamentoId: departamento.id,
      nivelEducativo: "ESO",
      horasSemanales: 2,
    },
  })

  // Create competencias específicas
  const compsClave = await prisma.competenciaClave.findMany()
  for (const comp of compsClave.slice(0, 3)) {
    const existingComp = await prisma.competenciaEspecifica.findFirst({
      where: { codigo: `${comp.codigo}-1` }
    })
    if (!existingComp) {
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
  }
  console.log("Created/verified competencias específicas")

  // Create or get grupo
  const existingGrupo = await prisma.grupo.findFirst({
    where: { nombre: "1º ESO A", nivelEducativo: "ESO", curso: 1, letra: "A" }
  })
  
  let grupo
  if (existingGrupo) {
    grupo = existingGrupo
  } else {
    grupo = await prisma.grupo.create({
      data: {
        nombre: "1º ESO A",
        nivelEducativo: "ESO",
        curso: 1,
        letra: "A",
      },
    })
  }

  // Create or get grupoMateria
  const existingGM = await prisma.grupoMateria.findFirst({
    where: { grupoId: grupo.id, materiaId: materia.id }
  })
  
  let grupoMateria
  if (!existingGM) {
    grupoMateria = await prisma.grupoMateria.create({
      data: {
        grupoId: grupo.id,
        materiaId: materia.id,
      },
    })
  } else {
    grupoMateria = existingGM
  }

  // Get professor user
  const prof = await prisma.user.findUnique({ where: { email: "profesor@instituto.es" } })
  if (prof) {
    const existingAsignacion = await prisma.grupoProfesor.findFirst({
      where: { userId: prof.id, grupoMateriaId: grupoMateria.id }
    })
    if (!existingAsignacion) {
      await prisma.grupoProfesor.create({
        data: {
          userId: prof.id,
          grupoMateriaId: grupoMateria.id,
        },
      })
    }
  }
  console.log("Created/verified grupo y asignación")

  // Create or get students
  const estudiantesData = [
    { nif: "12345678A", nombre: "Alejandro", apellido1: "Fernández" },
    { nif: "23456789B", nombre: "María", apellido1: "López" },
    { nif: "34567890C", nombre: "Carlos", apellido1: "Ruiz" },
    { nif: "45678901D", nombre: "Ana", apellido1: "García" },
    { nif: "56789012E", nombre: "David", apellido1: "Pérez" },
  ]

  for (const est of estudiantesData) {
    await prisma.alumno.upsert({
      where: { nif: est.nif },
      update: {},
      create: {
        nombre: est.nombre,
        apellido1: est.apellido1,
        nif: est.nif,
        fechaNac: new Date("2014-01-15"),
        grupoId: grupo.id,
      },
    })
  }
  console.log("Created/verified students")
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