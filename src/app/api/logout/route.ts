import { NextResponse } from "next/server"

export async function POST() {
  const response = NextResponse.redirect(new URL("/login", "http://localhost:3005"))
  response.cookies.set("session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  })
  return response
}
