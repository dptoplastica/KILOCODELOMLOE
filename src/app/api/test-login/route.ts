import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { compare } from "bcryptjs"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    const user = await prisma.user.findUnique({
      where: { email },
      include: { departamento: true }
    })

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 401 })
    }

    const isValid = await compare(password, user.password)

    if (!isValid) {
      return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 })
    }

    return NextResponse.json({
      id: user.id,
      email: user.email,
      nombre: user.nombre,
      role: user.role
    })
  } catch (error: any) {
    console.error("Login error:", error)
    return NextResponse.json({ error: error.message || "Error interno" }, { status: 500 })
  }
}