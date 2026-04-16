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
    const programacionId = searchParams.get("programacionId")

    if (programacionId) {
      const sdas = await prisma.situacionAprendizaje.findMany({
        where: { programacionId },
        include: {
          criterioEvaluacion: {
            include: {
              competenciaEspecifica: {
                select: { id: true, codigo: true, nombre: true }
              }
            }
          }
        },
        orderBy: { titulo: "asc" }
      })
      return NextResponse.json(sdas)
    }

    const deptId = user.departamentoId as string
    if (user.role !== "ADMINISTRADOR" && user.role !== "JEFE_DEPARTAMENTO" && !deptId) {
      return NextResponse.json({ error: "Sin departamento" }, { status: 400 })
    }

    const whereClause = user.role === "ADMINISTRADOR" ? {} : { departamentoId: deptId }

    const programaciones = await prisma.programacionDidactica.findMany({
      where: whereClause,
      include: {
        materia: { select: { id: true, nombre: true, codigo: true } },
        _count: { select: { sdas: true } }
      },
      orderBy: { createdAt: "desc" }
    })

    return NextResponse.json(programaciones)
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
    const { type, data } = body

    if (type === "programacion") {
      const deptId = user.role === "ADMINISTRADOR" ? data.departamentoId : user.departamentoId
      const programacion = await prisma.programacionDidactica.create({
        data: {
          departamentoId: deptId as string,
          materiaId: data.materiaId,
          cursoEscolar: data.cursoEscolar,
          objetivoGeneral: data.objetivoGeneral || "",
          evaluacion: data.evaluacion || "",
          recuperacion: data.recuperacion || "",
          actividades: data.actividades || "",
          contextualizacion: data.contextualizacion || null,
          justificacion: data.justificacion || null,
        }
      })
      return NextResponse.json(programacion)
    }

    if (type === "sda") {
      const sda = await prisma.situacionAprendizaje.create({
        data: {
          titulo: data.titulo,
          descripcion: data.descripcion || "",
          justificacion: data.justificacion || "",
          contextualizacion: data.contextualizacion || "",
          duracionHoras: data.duracionHoras || 10,
          secuenciaActividades: data.secuenciaActividades || "",
          recursos: data.recursos || "",
          atencionDiversidad: data.atencionDiversidad || "",
          competencias: data.competencias || "",
          criterioEvaluacionId: data.criterioEvaluacionId,
          programacionId: data.programacionId,
        }
      })
      return NextResponse.json(sda)
    }

    return NextResponse.json({ error: "Tipo inválido" }, { status: 400 })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  const user = await getSession()
  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { type, id, data } = body

    if (type === "programacion") {
      const programacion = await prisma.programacionDidactica.update({
        where: { id },
        data: {
          objetivoGeneral: data.objetivoGeneral || "",
          evaluacion: data.evaluacion || "",
          recuperacion: data.recuperacion || "",
          actividades: data.actividades || "",
          contextualizacion: data.contextualizacion || "",
          justificacion: data.justificacion || "",
        }
      })
      return NextResponse.json(programacion)
    }

    if (type === "sda") {
      const sda = await prisma.situacionAprendizaje.update({
        where: { id },
        data: {
          titulo: data.titulo,
          descripcion: data.descripcion || "",
          justificacion: data.justificacion || "",
          contextualizacion: data.contextualizacion || "",
          duracionHoras: data.duracionHoras || 10,
          secuenciaActividades: data.secuenciaActividades || "",
          recursos: data.recursos || "",
          atencionDiversidad: data.atencionDiversidad || "",
          competencias: data.competencias || "",
          criterioEvaluacionId: data.criterioEvaluacionId,
        }
      })
      return NextResponse.json(sda)
    }

    return NextResponse.json({ error: "Tipo inválido" }, { status: 400 })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const user = await getSession()
  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    const id = searchParams.get("id")

    if (type === "programacion") {
      await prisma.programacionDidactica.delete({ where: { id } })
    } else if (type === "sda") {
      await prisma.situacionAprendizaje.delete({ where: { id } })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
