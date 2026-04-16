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
    const materias = await prisma.materia.findMany({
      select: { id: true, nombre: true, codigo: true },
      orderBy: { nombre: "asc" }
    })
    return NextResponse.json({ materias })
  } catch (error) {
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const user = await getSession()
  if (!user || user.role !== "ADMINISTRADOR") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { nombre, codigo, nivelEducativo, horasSemanales, departamentoId } = body

    if (!nombre || !codigo || !departamentoId) {
      return NextResponse.json({ error: "Faltan datos requeridos" }, { status: 400 })
    }

    const materia = await prisma.materia.create({
      data: { nombre, codigo, nivelEducativo, horasSemanales: horasSemanales || 3, departamentoId }
    })

    return NextResponse.json(materia)
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json({ error: "El código ya existe" }, { status: 400 })
    }
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  const user = await getSession()
  if (!user || user.role !== "ADMINISTRADOR") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { id, nombre, codigo, nivelEducativo, horasSemanales, departamentoId } = body

    if (!id || !nombre || !codigo || !departamentoId) {
      return NextResponse.json({ error: "Faltan datos requeridos" }, { status: 400 })
    }

    const materia = await prisma.materia.update({
      where: { id },
      data: { nombre, codigo, nivelEducativo, horasSemanales: horasSemanales || 3, departamentoId }
    })

    return NextResponse.json(materia)
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json({ error: "El código ya existe" }, { status: 400 })
    }
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const user = await getSession()
  if (!user || user.role !== "ADMINISTRADOR") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID requerido" }, { status: 400 })
    }

    await prisma.materia.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
