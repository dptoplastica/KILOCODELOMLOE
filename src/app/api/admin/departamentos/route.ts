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

    const departamentos = await prisma.departamento.findMany({
      include: {
        _count: {
          select: { materias: true }
        }
      },
      orderBy: { nombre: "asc" }
    })

    return NextResponse.json(departamentos)
  } catch (error) {
    console.error("Error fetching departamentos:", error)
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
    const { nombre, codigo } = body

    if (!nombre || !codigo) {
      return NextResponse.json({ error: "Faltan datos requeridos" }, { status: 400 })
    }

    const departamento = await prisma.departamento.create({
      data: { nombre, codigo }
    })

    return NextResponse.json(departamento)
  } catch (error: any) {
    console.error("Error creating departamento:", error)
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
    const { id, nombre, codigo } = body

    if (!id || !nombre || !codigo) {
      return NextResponse.json({ error: "Faltan datos requeridos" }, { status: 400 })
    }

    const departamento = await prisma.departamento.update({
      where: { id },
      data: { nombre, codigo }
    })

    return NextResponse.json(departamento)
  } catch (error: any) {
    console.error("Error updating departamento:", error)
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

    await prisma.departamento.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting departamento:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}