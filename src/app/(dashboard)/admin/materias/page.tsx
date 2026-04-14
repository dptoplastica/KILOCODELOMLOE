"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Plus, Pencil, Trash2, BookOpen } from "lucide-react"

interface Materia {
  id: string
  nombre: string
  codigo: string
  nivelEducativo: string
  horasSemanales: number
  departamentoId: string
  departamento?: { nombre: string }
  _count: { competencias: number }
}

interface Departamento {
  id: string
  nombre: string
}

export default function MateriasPage() {
  const [materias, setMaterias] = useState<Materia[]>([])
  const [departamentos, setDepartamentos] = useState<Departamento[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [editando, setEditando] = useState<Materia | null>(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    nombre: "",
    codigo: "",
    nivelEducativo: "ESO",
    horasSemanales: 3,
    departamentoId: "",
  })

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    try {
      const [matRes, deptRes] = await Promise.all([
        fetch("/api/admin/materias"),
        fetch("/api/admin/departamentos"),
      ])
      const matData = await matRes.json()
      const deptData = await deptRes.json()
      setMaterias(matData)
      setDepartamentos(deptData)
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
        : formData

      await fetch("/api/admin/materias", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      
      setIsOpen(false)
      setEditando(null)
      setFormData({ nombre: "", codigo: "", nivelEducativo: "ESO", horasSemanales: 3, departamentoId: "" })
      loadData()
    } catch (error) {
      console.error("Error saving:", error)
    }
  }

  const handleEdit = (m: Materia) => {
    setEditando(m)
    setFormData({
      nombre: m.nombre,
      codigo: m.codigo,
      nivelEducativo: m.nivelEducativo,
      horasSemanales: m.horasSemanales,
      departamentoId: m.departamentoId,
    })
    setIsOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar esta materia?")) return
    try {
      await fetch(`/api/admin/materias?id=${id}`, { method: "DELETE" })
      loadData()
    } catch (error) {
      console.error("Error deleting:", error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Materias</h3>
          <p className="text-sm text-slate-500">Gestiona las materias del centro</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditando(null); setFormData({ nombre: "", codigo: "", nivelEducativo: "ESO", horasSemanales: 3, departamentoId: "" }) }}>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Materia
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editando ? "Editar" : "Nueva"} Materia</DialogTitle>
              <DialogDescription>
                {editando ? "Modifica los datos de la materia" : "Crea una nueva materia"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Nombre</Label>
                <Input
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="ej. Tecnología"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Código</Label>
                  <Input
                    value={formData.codigo}
                    onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                    placeholder="ej. TEC1"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Horas Semanales</Label>
                  <Input
                    type="number"
                    value={formData.horasSemanales}
                    onChange={(e) => setFormData({ ...formData, horasSemanales: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Nivel Educativo</Label>
                <Select 
                  value={formData.nivelEducativo} 
                  onValueChange={(v) => setFormData({ ...formData, nivelEducativo: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ESO">ESO</SelectItem>
                    <SelectItem value="BACHILLERATO">Bachillerato</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Departamento</Label>
                <Select 
                  value={formData.departamentoId} 
                  onValueChange={(v) => setFormData({ ...formData, departamentoId: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar..." />
                  </SelectTrigger>
                  <SelectContent>
                    {departamentos.map((d) => (
                      <SelectItem key={d.id} value={d.id}>{d.nombre}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
              <Button onClick={handleSubmit}>{editando ? "Guardar" : "Crear"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Código</TableHead>
            <TableHead>Nivel</TableHead>
            <TableHead>Horas</TableHead>
            <TableHead>Departamento</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {materias.map((m) => (
            <TableRow key={m.id}>
              <TableCell className="font-medium flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-slate-400" />
                {m.nombre}
              </TableCell>
              <TableCell>{m.codigo}</TableCell>
              <TableCell>{m.nivelEducativo}</TableCell>
              <TableCell>{m.horasSemanales}h</TableCell>
              <TableCell>{m.departamento?.nombre}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" onClick={() => handleEdit(m)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(m.id)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}