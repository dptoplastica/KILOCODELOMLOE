import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    const user = session?.user as any
    
    if (!session || user?.role !== "JEFE_DEPARTAMENTO") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const departamentoId = searchParams.get("departamentoId")

    if (!departamentoId) {
      return NextResponse.json({ error: "Departamento requerido" }, { status: 400 })
    }

    const programaciones = await prisma.programacionDidactica.findMany({
      where: { departamentoId },
      include: {
        materia: { select: { nombre: true } },
        _count: { select: { sdas: true } }
      },
      orderBy: { materia: { nombre: "asc" } }
    })

    return NextResponse.json(programaciones)
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    const user = session?.user as any
    
    if (!session || user?.role !== "JEFE_DEPARTAMENTO") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const { materiaId, departamentoId, cursoEscolar, objetivoGeneral, evaluacion, recuperacion, actividades } = body

    if (!materiaId || !departamentoId || !cursoEscolar) {
      return NextResponse.json({ error: "Faltan datos requeridos" }, { status: 400 })
    }

    const programacion = await prisma.programacionDidactica.create({
      data: {
        materiaId,
        departamentoId,
        cursoEscolar,
        objetivoGeneral: objetivoGeneral || "",
        evaluacion: evaluacion || "",
        recuperacion: recuperacion || "",
        actividades: actividades || "",
      }
    })

    return NextResponse.json(programacion)
  } catch (error: any) {
    console.error("Error:", error)
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Ya existe una programación para esta materia" }, { status: 400 })
    }
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    const user = session?.user as any
    
    if (!session || user?.role !== "JEFE_DEPARTAMENTO") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const { id, materiaId, cursoEscolar, objetivoGeneral, evaluacion, recuperacion, actividades } = body

    if (!id || !materiaId || !cursoEscolar) {
      return NextResponse.json({ error: "Faltan datos requeridos" }, { status: 400 })
    }

    const programacion = await prisma.programacionDidactica.update({
      where: { id },
      data: {
        materiaId,
        cursoEscolar,
        objetivoGeneral: objetivoGeneral || "",
        evaluacion: evaluacion || "",
        recuperacion: recuperacion || "",
        actividades: actividades || "",
      }
    })

    return NextResponse.json(programacion)
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}