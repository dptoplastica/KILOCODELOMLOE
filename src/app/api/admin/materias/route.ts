import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    const user = session?.user as any
    
    if (!session || user?.role !== "ADMINISTRADOR") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const materias = await prisma.materia.findMany({
      include: {
        departamento: { select: { nombre: true } },
        _count: { select: { competencias: true } }
      },
      orderBy: { nombre: "asc" }
    })

    return NextResponse.json(materias)
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    const user = session?.user as any
    
    if (!session || user?.role !== "ADMINISTRADOR") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

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
    console.error("Error:", error)
    if (error.code === "P2002") {
      return NextResponse.json({ error: "El código ya existe" }, { status: 400 })
    }
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    const user = session?.user as any
    
    if (!session || user?.role !== "ADMINISTRADOR") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

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
    console.error("Error:", error)
    if (error.code === "P2002") {
      return NextResponse.json({ error: "El código ya existe" }, { status: 400 })
    }
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    const user = session?.user as any
    
    if (!session || user?.role !== "ADMINISTRADOR") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID requerido" }, { status: 400 })
    }

    await prisma.materia.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}