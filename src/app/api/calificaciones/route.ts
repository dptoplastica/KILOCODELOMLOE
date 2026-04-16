import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { cookies } from "next/headers"
import { jwtVerify } from "jose"

const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET!)

async function getSession() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get("session")
  if (!sessionCookie?.value) return null
  try {
    const { payload } = await jwtVerify(sessionCookie.value, secret)
    return payload
  } catch {
    return null
  }
}

export async function GET(request: Request) {
  const user = await getSession()
  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get("action")

    if (action === "grupos") {
      const grupos = await prisma.grupoProfesor.findMany({
        where: { userId: user.id as string },
        include: {
          grupoMateria: {
            include: {
              grupo: true,
              materia: true
            }
          }
        }
      })
      return NextResponse.json(grupos)
    }

    if (action === "sdas") {
      const programacionId = searchParams.get("programacionId")
      const sdas = await prisma.situacionAprendizaje.findMany({
        where: { programacionId: programacionId! },
        include: {
          criterioEvaluacion: {
            select: { id: true, codigo: true, descripcion: true, pesoPorcentual: true }
          }
        },
        orderBy: { titulo: "asc" }
      })
      return NextResponse.json(sdas)
    }

    if (action === "alumnos") {
      const grupoId = searchParams.get("grupoId")
      const alumnos = await prisma.alumno.findMany({
        where: { grupoId: grupoId! },
        orderBy: [{ apellido1: "asc" }, { nombre: "asc" }]
      })
      return NextResponse.json(alumnos)
    }

    if (action === "calificaciones") {
      const sdaId = searchParams.get("sdaId")
      const trimestre = searchParams.get("trimestre")

      const calificaciones = await prisma.calificacion.findMany({
        where: {
          sdaId: sdaId || undefined,
          trimestre: trimestre as any
        },
        include: {
          alumno: { select: { id: true, nombre: true, apellido1: true, apellido2: true } },
          criterios: {
            include: { criterio: true }
          }
        }
      })
      return NextResponse.json(calificaciones)
    }

    return NextResponse.json({ error: "Acción inválida" }, { status: 400 })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const user = await getSession()
  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { action, data } = body

    if (action === "calificacion") {
      const existing = await prisma.calificacion.findFirst({
        where: {
          usuarioId: user.id as string,
          alumnoId: data.alumnoId,
          sdaId: data.sdaId,
          trimestre: data.trimestre as any
        }
      })

      if (existing) {
        const calificacion = await prisma.calificacion.update({
          where: { id: existing.id },
          data: {
            calificacion: data.calificacion,
            nivelCompetencia: data.nivelCompetencia as any,
            observaciones: data.observaciones || null
          }
        })
        return NextResponse.json(calificacion)
      } else {
        const calificacion = await prisma.calificacion.create({
          data: {
            usuarioId: user.id as string,
            alumnoId: data.alumnoId,
            sdaId: data.sdaId,
            trimestre: data.trimestre as any,
            calificacion: data.calificacion,
            nivelCompetencia: data.nivelCompetencia as any,
            observaciones: data.observaciones || null
          }
        })
        return NextResponse.json(calificacion)
      }
    }

    if (action === "criterio") {
      const existente = await prisma.calificacionCriterio.findUnique({
        where: {
          calificacionId_criterioId: {
            calificacionId: data.calificacionId,
            criterioId: data.criterioId
          }
        }
      })

      if (existente) {
        const updated = await prisma.calificacionCriterio.update({
          where: { id: existente.id },
          data: { puntuacion: data.puntuacion, nivel: data.nivel as any }
        })
        return NextResponse.json(updated)
      } else {
        const created = await prisma.calificacionCriterio.create({
          data: {
            calificacionId: data.calificacionId,
            criterioId: data.criterioId,
            puntuacion: data.puntuacion,
            nivel: data.nivel as any
          }
        })
        return NextResponse.json(created)
      }
    }

    return NextResponse.json({ error: "Acción inválida" }, { status: 400 })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
