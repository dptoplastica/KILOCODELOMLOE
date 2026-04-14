import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { hash } from "bcryptjs"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    const user = session?.user as any
    
    if (!session || user?.role !== "ADMINISTRADOR") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const profesores = await prisma.user.findMany({
      where: {
        role: { in: ["PROFESOR", "JEFE_DEPARTAMENTO", "ADMINISTRADOR"] }
      },
      include: {
        departamento: { select: { nombre: true } }
      },
      orderBy: { nombre: "asc" }
    })

    return NextResponse.json(profesores)
  } catch (error) {
    console.error("Error fetching:", error)
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
    const { email, password, nombre, apellido1, apellido2, role, departamentoId } = body

    if (!email || !password || !nombre || !apellido1 || !role) {
      return NextResponse.json({ error: "Faltan datos requeridos" }, { status: 400 })
    }

    const hashedPassword = await hash(password, 10)

    const nuevo = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        nombre,
        apellido1,
        apellido2: apellido2 || null,
        role,
        departamentoId: departamentoId || null,
      }
    })

    return NextResponse.json({ id: nuevo.id, email: nuevo.email, nombre: nuevo.nombre })
  } catch (error: any) {
    console.error("Error creating:", error)
    if (error.code === "P2002") {
      return NextResponse.json({ error: "El email ya existe" }, { status: 400 })
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
    const { id, email, password, nombre, apellido1, apellido2, role, departamentoId } = body

    if (!id || !email || !nombre || !apellido1 || !role) {
      return NextResponse.json({ error: "Faltan datos requeridos" }, { status: 400 })
    }

    const updateData: any = {
      email,
      nombre,
      apellido1,
      apellido2: apellido2 || null,
      role,
      departamentoId: departamentoId || null,
    }

    if (password) {
      updateData.password = await hash(password, 10)
    }

    const updated = await prisma.user.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json({ id: updated.id, email: updated.email })
  } catch (error: any) {
    console.error("Error updating:", error)
    if (error.code === "P2002") {
      return NextResponse.json({ error: "El email ya existe" }, { status: 400 })
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

    await prisma.user.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}