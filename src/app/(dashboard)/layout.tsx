import { redirect } from "next/navigation"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const isAuthenticated = false
  
  if (!isAuthenticated) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-slate-900">
                Instituto de Secundaria
              </h1>
              <nav className="hidden md:flex gap-6 ml-10">
                <a href="/dashboard" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                  Inicio
                </a>
                <a href="/calificaciones" className="text-sm font-medium text-slate-900">
                  Calificaciones
                </a>
                <a href="/programaciones" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                  Programaciones
                </a>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-600">Prof. García</span>
              <div className="h-8 w-8 bg-slate-200 rounded-full" />
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