"use client"

import { useState, useEffect } from "react"
import { prisma } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
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
import { Plus, Pencil, Trash2, Building2 } from "lucide-react"

interface Departamento {
  id: string
  nombre: string
  codigo: string
  jefeId: string | null
  _count: { materias: number }
}

export default function DepartamentosPage() {
  const [departamentos, setDepartamentos] = useState<Departamento[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [editando, setEditando] = useState<Departamento | null>(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({ nombre: "", codigo: "" })

  useEffect(() => {
    loadDepartamentos()
  }, [])

  async function loadDepartamentos() {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/departamentos")
      const data = await res.json()
      setDepartamentos(data)
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
      
      await fetch("/api/admin/departamentos", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      
      setIsOpen(false)
      setEditando(null)
      setFormData({ nombre: "", codigo: "" })
      loadDepartamentos()
    } catch (error) {
      console.error("Error saving:", error)
    }
  }

  const handleEdit = (dept: Departamento) => {
    setEditando(dept)
    setFormData({ nombre: dept.nombre, codigo: dept.codigo })
    setIsOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este departamento?")) return
    try {
      await fetch(`/api/admin/departamentos?id=${id}`, { method: "DELETE" })
      loadDepartamentos()
    } catch (error) {
      console.error("Error deleting:", error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Departamentos</h3>
          <p className="text-sm text-slate-500">Gestiona los departamentos del centro</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditando(null); setFormData({ nombre: "", codigo: "" }) }}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Departamento
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editando ? "Editar" : "Nuevo"} Departamento</DialogTitle>
              <DialogDescription>
                {editando ? "Modifica los datos del departamento" : "Crea un nuevo departamento"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Nombre</Label>
                <Input
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Departamento de..."
                />
              </div>
              <div className="space-y-2">
                <Label>Código</Label>
                <Input
                  value={formData.codigo}
                  onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                  placeholder="ej. MAT, LENG, TEC"
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

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Código</TableHead>
            <TableHead>Materias</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {departamentos.map((dept) => (
            <TableRow key={dept.id}>
              <TableCell className="font-medium flex items-center gap-2">
                <Building2 className="h-4 w-4 text-slate-400" />
                {dept.nombre}
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{dept.codigo}</Badge>
              </TableCell>
              <TableCell>{dept._count.materias} materias</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" onClick={() => handleEdit(dept)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(dept.id)}>
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