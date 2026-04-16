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

export async function GET() {
  const user = await getSession()
  if (!user || user.role !== "ADMINISTRADOR") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  try {
    const competencias = await prisma.competenciaClave.findMany({
      include: {
        competencias: {
          include: {
            materia: { select: { id: true, nombre: true } },
            criterios: true,
            saberes: { include: { saber: true } }
          }
        }
      }
    })
    return NextResponse.json(competencias)
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener datos" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const user = await getSession()
  if (!user || user.role !== "ADMINISTRADOR") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { type, data } = body

    if (type === "competenciaClave") {
      const created = await prisma.competenciaClave.create({
        data: { codigo: data.codigo, nombre: data.nombre, descripcion: data.descripcion }
      })
      return NextResponse.json(created)
    }

    if (type === "competenciaEspecifica") {
      const created = await prisma.competenciaEspecifica.create({
        data: {
          codigo: data.codigo,
          nombre: data.nombre,
          descripcion: data.descripcion,
          materiaId: data.materiaId,
          competenciaClaveId: data.competenciaClaveId
        }
      })
      return NextResponse.json(created)
    }

    if (type === "criterio") {
      const created = await prisma.criterioEvaluacion.create({
        data: {
          codigo: data.codigo,
          descripcion: data.descripcion,
          pesoPorcentual: data.pesoPorcentual || 0,
          orden: data.orden || 0,
          competenciaEspecificaId: data.competenciaEspecificaId
        }
      })
      return NextResponse.json(created)
    }

    if (type === "saber") {
      const created = await prisma.saber.create({
        data: {
          bloque: data.bloque,
          contenido: data.contenido,
          materiaId: data.materiaId
        }
      })
      return NextResponse.json(created)
    }

    return NextResponse.json({ error: "Tipo no válido" }, { status: 400 })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Error al crear" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  const user = await getSession()
  if (!user || user.role !== "ADMINISTRADOR") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { type, id, data } = body

    if (type === "competenciaClave") {
      const updated = await prisma.competenciaClave.update({
        where: { id },
        data: { codigo: data.codigo, nombre: data.nombre, descripcion: data.descripcion }
      })
      return NextResponse.json(updated)
    }

    if (type === "competenciaEspecifica") {
      const updated = await prisma.competenciaEspecifica.update({
        where: { id },
        data: { codigo: data.codigo, nombre: data.nombre, descripcion: data.descripcion }
      })
      return NextResponse.json(updated)
    }

    if (type === "criterio") {
      const updated = await prisma.criterioEvaluacion.update({
        where: { id },
        data: { codigo: data.codigo, descripcion: data.descripcion, pesoPorcentual: data.pesoPorcentual, orden: data.orden }
      })
      return NextResponse.json(updated)
    }

    if (type === "saber") {
      const updated = await prisma.saber.update({
        where: { id },
        data: { bloque: data.bloque, contenido: data.contenido }
      })
      return NextResponse.json(updated)
    }

    return NextResponse.json({ error: "Tipo no válido" }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: "Error al actualizar" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const user = await getSession()
  if (!user || user.role !== "ADMINISTRADOR") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    const id = searchParams.get("id")

    if (!type || !id) {
      return NextResponse.json({ error: "Parámetros inválidos" }, { status: 400 })
    }

    if (type === "competenciaClave") {
      await prisma.competenciaClave.delete({ where: { id } })
    } else if (type === "competenciaEspecifica") {
      await prisma.competenciaEspecifica.delete({ where: { id } })
    } else if (type === "criterio") {
      await prisma.criterioEvaluacion.delete({ where: { id } })
    } else if (type === "saber") {
      await prisma.saber.delete({ where: { id } })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Error al eliminar" }, { status: 500 })
  }
}
