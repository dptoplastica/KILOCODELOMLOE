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

    const grupos = await prisma.grupo.findMany({
      include: {
        _count: { select: { alumnos: true } }
      },
      orderBy: [{ nivelEducativo: "asc" }, { curso: "asc" }, { letra: "asc" }]
    })

    const gruposConNombre = grupos.map(g => ({
      ...g,
      nombre: `${g.curso}º ${g.nivelEducativo === "ESO" ? "ESO" : "Bach."} ${g.letra}`
    }))

    return NextResponse.json(gruposConNombre)
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
    const { nivelEducativo, curso, letra } = body

    if (!nivelEducativo || !curso || !letra) {
      return NextResponse.json({ error: "Faltan datos requeridos" }, { status: 400 })
    }

    const nombre = `${curso}º ${nivelEducativo === "ESO" ? "ESO" : "Bach."} ${letra}`

    const grupo = await prisma.grupo.create({
      data: { nombre, nivelEducativo, curso, letra }
    })

    return NextResponse.json(grupo)
  } catch (error: any) {
    console.error("Error:", error)
    if (error.code === "P2002") {
      return NextResponse.json({ error: "El grupo ya existe" }, { status: 400 })
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
    const { id, nivelEducativo, curso, letra } = body

    if (!id || !nivelEducativo || !curso || !letra) {
      return NextResponse.json({ error: "Faltan datos requeridos" }, { status: 400 })
    }

    const nombre = `${curso}º ${nivelEducativo === "ESO" ? "ESO" : "Bach."} ${letra}`

    const grupo = await prisma.grupo.update({
      where: { id },
      data: { nombre, nivelEducativo, curso, letra }
    })

    return NextResponse.json(grupo)
  } catch (error: any) {
    console.error("Error:", error)
    if (error.code === "P2002") {
      return NextResponse.json({ error: "El grupo ya existe" }, { status: 400 })
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

    await prisma.grupo.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}