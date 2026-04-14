import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/db"
import { compare } from "bcryptjs"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface User {
    id: string
    role: string
    departamentoId: string | null
  }
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: string
      departamentoId: string | null
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: string
    departamentoId: string | null
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: {
            departamento: true,
            taughtGroups: {
              include: {
                grupoMateria: {
                  include: {
                    grupo: true,
                    materia: true
                  }
                }
              }
            }
          }
        })

        if (!user) {
          return null
        }

        const isPasswordValid = await compare(credentials.password, user.password)

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: `${user.nombre} ${user.apellido1}`,
          role: user.role,
          departamentoId: user.departamentoId,
          image: null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: any }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.departamentoId = user.departamentoId
      }
      return token
    },
    async session({ session, token }: { session: any; token: JWT }) {
      session.user.id = token.id
      session.user.role = token.role
      session.user.departamentoId = token.departamentoId
      return session
    }
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
}