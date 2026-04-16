import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { jwtVerify } from "jose"
import Link from "next/link"
import { GraduationCap, LogOut } from "lucide-react"

const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET!)

async function getSession() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get("session")

  if (!sessionCookie?.value) {
    return null
  }

  try {
    const { payload } = await jwtVerify(sessionCookie.value, secret)
    return payload
  } catch {
    return null
  }
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getSession()
  
  if (!user) {
    redirect("/login")
  }

  const isAdmin = user.role === "ADMINISTRADOR"
  const isJefeDept = user.role === "JEFE_DEPARTAMENTO"

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <GraduationCap className="h-6 w-6 text-blue-600" />
                Instituto de Secundaria
              </h1>
              <nav className="hidden md:flex gap-6 ml-10">
                <Link href="/dashboard" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                  Inicio
                </Link>
                <Link href="/calificaciones" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                  Calificaciones
                </Link>
                <Link href="/informes" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                  Informes
                </Link>
                {isJefeDept && (
                  <Link href="/programaciones" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                    Programaciones
                  </Link>
                )}
                {isAdmin && (
                  <Link href="/admin" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                    Administración
                  </Link>
                )}
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <span className="text-slate-600">{user.name as string}</span>
                <span className="ml-2 text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">
                  {user.role === "ADMINISTRADOR" ? "Admin" : user.role === "JEFE_DEPARTAMENTO" ? "Jefe Dpto." : "Profesor"}
                </span>
              </div>
              <form action="/api/logout" method="POST">
                <button type="submit" className="text-slate-500 hover:text-slate-700">
                  <LogOut className="h-5 w-5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
