import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, Users, BookOpen, ClipboardList, TrendingUp } from "lucide-react"
import Link from "next/link"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect("/login")
  }

  const user = session.user as any
  const isAdmin = user?.role === "ADMINISTRADOR"
  const isJefeDept = user?.role === "JEFE_DEPARTAMENTO"

  const stats = [
    { label: "Mis Grupos", value: "3", icon: Users, color: "bg-blue-500" },
    { label: "SDA Activas", value: "5", icon: BookOpen, color: "bg-green-500" },
    { label: "Alumnos", value: "87", icon: GraduationCap, color: "bg-purple-500" },
    { label: "Media Clase", value: "7.2", icon: TrendingUp, color: "bg-orange-500" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Bienvenido, {user?.name}</h2>
        <p className="text-slate-500">Panel de control del sistema educativo</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 ${stat.color} rounded-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Accesos Rápidos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/calificaciones" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
              <ClipboardList className="h-5 w-5 text-blue-600" />
              <span className="text-slate-700">Cuaderno de Calificaciones</span>
            </Link>
            {isJefeDept && (
              <Link href="/programaciones" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                <BookOpen className="h-5 w-5 text-green-600" />
                <span className="text-slate-700">Programaciones Didácticas</span>
              </Link>
            )}
            {isAdmin && (
              <Link href="/admin" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                <Users className="h-5 w-5 text-purple-600" />
                <span className="text-slate-700">Panel de Administración</span>
              </Link>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Información del Sistema</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-600">Curso escolar:</span>
              <span className="font-medium">2025-2026</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Tu rol:</span>
              <span className="font-medium">{user?.role === "ADMINISTRADOR" ? "Administrador" : user?.role === "JEFE_DEPARTAMENTO" ? "Jefe de Departamento" : "Profesor"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Trimestre actual:</span>
              <span className="font-medium">1º Trimestre</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}