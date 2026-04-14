"use client"

import { useState, useEffect } from "react"
import { getServerSession } from "next-auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Pencil, BookOpen, GraduationCap } from "lucide-react"

interface Programacion {
  id: string
  departamentoId: string
  materiaId: string
  cursoEscolar: string
  objetivoGeneral: string
  evaluacion: string
  recuperacion: string
  actividades: string
  materia?: { nombre: string }
  _count: { sdas: number }
}

interface Materia {
  id: string
  nombre: string
}

export default function ProgramacionesPage() {
  const [programaciones, setProgramaciones] = useState<Programacion[]>([])
  const [materias, setMaterias] = useState<Materia[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [editando, setEditando] = useState<Programacion | null>(null)
  const [loading, setLoading] = useState(true)
  const [departamentoId, setDepartamentoId] = useState<string>("")
  const [formData, setFormData] = useState({
    materiaId: "",
    cursoEscolar: "2025-2026",
    objetivoGeneral: "",
    evaluacion: "",
    recuperacion: "",
    actividades: "",
  })

  useEffect(() => {
    const init = async () => {
      const session = await getServerSession()
      const user = (session?.user as any)
      if (user?.departamentoId) {
        setDepartamentoId(user.departamentoId)
        loadData(user.departamentoId)
      }
    }
    init()
  }, [])

  async function loadData(deptId: string) {
    setLoading(true)
    try {
      const [progRes, matRes] = await Promise.all([
        fetch(`/api/programaciones?departamentoId=${deptId}`),
        fetch(`/api/admin/materias`),
      ])
      const progData = await progRes.json()
      const matData = await matRes.json()
      setProgramaciones(progData)
      setMaterias(matData.filter((m: any) => m.departamentoId === deptId))
    } catch (error) {
      console.error("Error fetching:", error)
    }
    setLoading(false)
  }

  const handleSubmit = async () => {
    try {
      const method = editando ? "PUT" : "POST"
      const body = editando 
        ? { ...formData, id: editando.id }
        : { ...formData, departamentoId }

      await fetch("/api/programaciones", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      
      setIsOpen(false)
      setEditando(null)
      setFormData({ materiaId: "", cursoEscolar: "2025-2026", objetivoGeneral: "", evaluacion: "", recuperacion: "", actividades: "" })
      loadData(departamentoId)
    } catch (error) {
      console.error("Error saving:", error)
    }
  }

  const handleEdit = (p: Programacion) => {
    setEditando(p)
    setFormData({
      materiaId: p.materiaId,
      cursoEscolar: p.cursoEscolar,
      objetivoGeneral: p.objetivoGeneral,
      evaluacion: p.evaluacion,
      recuperacion: p.recuperacion,
      actividades: p.actividades,
    })
    setIsOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Programaciones Didácticas</h2>
          <p className="text-slate-500">Gestiona las programaciones de tu departamento</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditando(null); setFormData({ materiaId: "", cursoEscolar: "2025-2026", objetivoGeneral: "", evaluacion: "", recuperacion: "", actividades: "" }) }}>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Programación
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editando ? "Editar" : "Nueva"} Programación Didáctica</DialogTitle>
              <DialogDescription>
                {editando ? "Modifica la programación" : "Crea una nueva programación didáctica"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Materia</Label>
                  <Select 
                    value={formData.materiaId} 
                    onValueChange={(v) => setFormData({ ...formData, materiaId: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar..." />
                    </SelectTrigger>
                    <SelectContent>
                      {materias.map((m) => (
                        <SelectItem key={m.id} value={m.id}>{m.nombre}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Curso Escolar</Label>
                  <Select 
                    value={formData.cursoEscolar} 
                    onValueChange={(v) => setFormData({ ...formData, cursoEscolar: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2025-2026">2025-2026</SelectItem>
                      <SelectItem value="2024-2025">2024-2025</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Objetivo General</Label>
                <Textarea
                  value={formData.objetivoGeneral}
                  onChange={(e) => setFormData({ ...formData, objetivoGeneral: e.target.value })}
                  placeholder="Objetivo general de la materia..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Procedimientos de Evaluación</Label>
                <Textarea
                  value={formData.evaluacion}
                  onChange={(e) => setFormData({ ...formData, evaluacion: e.target.value })}
                  placeholder="Procedimientos e instrumentos de evaluación..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Procedimientos de Recuperación</Label>
                <Textarea
                  value={formData.recuperacion}
                  onChange={(e) => setFormData({ ...formData, recuperacion: e.target.value })}
                  placeholder="Procedimientos de recuperación..."
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>Actividades de Apoyo y Refuerzo</Label>
                <Textarea
                  value={formData.actividades}
                  onChange={(e) => setFormData({ ...formData, actividades: e.target.value })}
                  placeholder="Actividades de apoyo y refuerzo..."
                  rows={2}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
              <Button onClick={handleSubmit}>{editando ? "Guardar" : "Crear"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {programaciones.map((p) => (
          <Card key={p.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <BookOpen className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{p.materia?.nombre}</CardTitle>
                    <p className="text-sm text-slate-500">Curso {p.cursoEscolar}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{p._count.sdas} SDAs</Badge>
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(p)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-500 font-medium">Objetivo:</span>
                  <p className="text-slate-700 mt-1">{p.objetivoGeneral || "No definido"}</p>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Evaluación:</span>
                  <p className="text-slate-700 mt-1">{p.evaluacion || "No definido"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {programaciones.length === 0 && !loading && (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">No hay programaciones creadas</p>
              <Button variant="outline" className="mt-4" onClick={() => setIsOpen(true)}>
                Crear primera programación
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}