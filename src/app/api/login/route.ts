import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { compare } from "bcryptjs"
import { SignJWT, jwtVerify } from "jose"

const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET!)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: "Email y contraseña requeridos" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { departamento: true }
    })

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 401 })
    }

    const isPasswordValid = await compare(password, user.password)

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 })
    }

    const sessionUser = {
      id: user.id,
      email: user.email,
      name: `${user.nombre} ${user.apellido1}`,
      role: user.role,
      departamentoId: user.departamentoId,
    }

    const token = await new SignJWT({ ...sessionUser })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(secret)

    const response = NextResponse.json(sessionUser)
    response.cookies.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
