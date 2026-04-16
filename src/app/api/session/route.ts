import { NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"

const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET!)

export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get("session")

    if (!sessionCookie?.value) {
      return NextResponse.json({ user: null }, { status: 401 })
    }

    const { payload } = await jwtVerify(sessionCookie.value, secret)

    return NextResponse.json({ user: payload })
  } catch (error) {
    return NextResponse.json({ user: null }, { status: 401 })
  }
}
