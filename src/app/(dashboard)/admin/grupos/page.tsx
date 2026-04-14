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
import { Plus, Pencil, Trash2, GraduationCap } from "lucide-react"

interface Grupo {
  id: string
  nombre: string
  nivelEducativo: string
  curso: number
  letra: string
  _count: { alumnos: number }
}

export default function GruposPage() {
  const [grupos, setGrupos] = useState<Grupo[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [editando, setEditando] = useState<Grupo | null>(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    nombre: "",
    nivelEducativo: "ESO",
    curso: 1,
    letra: "",
  })

  useEffect(() => {
    loadGrupos()
  }, [])

  async function loadGrupos() {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/grupos")
      const data = await res.json()
      setGrupos(data)
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

      await fetch("/api/admin/grupos", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      
      setIsOpen(false)
      setEditando(null)
      setFormData({ nombre: "", nivelEducativo: "ESO", curso: 1, letra: "" })
      loadGrupos()
    } catch (error) {
      console.error("Error saving:", error)
    }
  }

  const handleEdit = (g: Grupo) => {
    setEditando(g)
    setFormData({
      nombre: g.nombre,
      nivelEducativo: g.nivelEducativo,
      curso: g.curso,
      letra: g.letra,
    })
    setIsOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este grupo?")) return
    try {
      await fetch(`/api/admin/grupos?id=${id}`, { method: "DELETE" })
      loadGrupos()
    } catch (error) {
      console.error("Error deleting:", error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Grupos</h3>
          <p className="text-sm text-slate-500">Gestiona los grupos del centro</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditando(null); setFormData({ nombre: "", nivelEducativo: "ESO", curso: 1, letra: "" }) }}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Grupo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editando ? "Editar" : "Nuevo"} Grupo</DialogTitle>
              <DialogDescription>
                {editando ? "Modifica los datos del grupo" : "Crea un nuevo grupo"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
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
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Curso</Label>
                  <Select 
                    value={String(formData.curso)} 
                    onValueChange={(v) => setFormData({ ...formData, curso: parseInt(v) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1º</SelectItem>
                      <SelectItem value="2">2º</SelectItem>
                      <SelectItem value="3">3º</SelectItem>
                      <SelectItem value="4">4º</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Letra</Label>
                  <Input
                    value={formData.letra}
                    onChange={(e) => setFormData({ ...formData, letra: e.target.value.toUpperCase() })}
                    placeholder="A"
                    maxLength={1}
                  />
                </div>
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
            <TableHead>Nivel</TableHead>
            <TableHead>Curso</TableHead>
            <TableHead>Alumnos</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {grupos.map((g) => (
            <TableRow key={g.id}>
              <TableCell className="font-medium flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-slate-400" />
                {g.nombre}
              </TableCell>
              <TableCell>{g.nivelEducativo}</TableCell>
              <TableCell>{g.curso}º</TableCell>
              <TableCell>{g._count.alumnos} alumnos</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" onClick={() => handleEdit(g)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(g.id)}>
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