import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import Link from "next/link"
import { Building2, Users, BookOpen, GraduationCap, ChevronRight } from "lucide-react"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)
  const user = session?.user as any

  if (!session || user?.role !== "ADMINISTRADOR") {
    redirect("/dashboard")
  }

  const menuItems = [
    { href: "/admin/departamentos", label: "Departamentos", icon: Building2 },
    { href: "/admin/profesores", label: "Profesores", icon: Users },
    { href: "/admin/materias", label: "Materias", icon: BookOpen },
    { href: "/admin/grupos", label: "Grupos", icon: GraduationCap },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Panel de Administración</h2>
        <p className="text-slate-500">Gestiona la estructura del centro educativo</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-4 p-4 bg-white rounded-lg border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all"
          >
            <div className="p-3 bg-blue-50 rounded-lg">
              <item.icon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <span className="font-medium text-slate-900">{item.label}</span>
            </div>
            <ChevronRight className="h-5 w-5 text-slate-400" />
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-slate-200">
        {children}
      </div>
    </div>
  )
}