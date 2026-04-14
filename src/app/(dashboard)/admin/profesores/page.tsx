"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Plus, Pencil, Trash2, User } from "lucide-react"

interface User {
  id: string
  email: string
  nombre: string
  apellido1: string
  apellido2: string | null
  role: string
  departamentoId: string | null
  departamento?: { nombre: string } | null
}

interface Departamento {
  id: string
  nombre: string
}

export default function ProfesoresPage() {
  const [profesores, setProfesores] = useState<User[]>([])
  const [departamentos, setDepartamentos] = useState<Departamento[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [editando, setEditando] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    nombre: "",
    apellido1: "",
    apellido2: "",
    role: "PROFESOR",
    departamentoId: "",
  })

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    try {
      const [profRes, deptRes] = await Promise.all([
        fetch("/api/admin/profesores"),
        fetch("/api/admin/departamentos"),
      ])
      const profData = await profRes.json()
      const deptData = await deptRes.json()
      setProfesores(profData)
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
        ? { id: editando.id, ...formData, departamentoId: formData.departamentoId || null }
        : formData

      await fetch("/api/admin/profesores", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      
      setIsOpen(false)
      setEditando(null)
      setFormData({
        email: "",
        password: "",
        nombre: "",
        apellido1: "",
        apellido2: "",
        role: "PROFESOR",
        departamentoId: "",
      })
      loadData()
    } catch (error) {
      console.error("Error saving:", error)
    }
  }

  const handleEdit = (prof: User) => {
    setEditando(prof)
    setFormData({
      email: prof.email,
      password: "",
      nombre: prof.nombre,
      apellido1: prof.apellido1,
      apellido2: prof.apellido2 || "",
      role: prof.role,
      departamentoId: prof.departamentoId || "",
    })
    setIsOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este profesor?")) return
    try {
      await fetch(`/api/admin/profesores?id=${id}`, { method: "DELETE" })
      loadData()
    } catch (error) {
      console.error("Error deleting:", error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Profesores</h3>
          <p className="text-sm text-slate-500">Gestiona los profesores del centro</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditando(null); setFormData({ email: "", password: "", nombre: "", apellido1: "", apellido2: "", role: "PROFESOR", departamentoId: "" }) }}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Profesor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editando ? "Editar" : "Nuevo"} Profesor</DialogTitle>
              <DialogDescription>
                {editando ? "Modifica los datos del profesor" : "Crea un nuevo profesor"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="profesor@instituto.es"
                />
              </div>
              {!editando && (
                <div className="space-y-2">
                  <Label>Contraseña</Label>
                  <Input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                  />
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nombre</Label>
                  <Input
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Apellido</Label>
                  <Input
                    value={formData.apellido1}
                    onChange={(e) => setFormData({ ...formData, apellido1: e.target.value })}
                  />
                </div>
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
              <div className="space-y-2">
                <Label>Rol</Label>
                <Select 
                  value={formData.role} 
                  onValueChange={(v) => setFormData({ ...formData, role: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PROFESOR">Profesor</SelectItem>
                    <SelectItem value="JEFE_DEPARTAMENTO">Jefe de Departamento</SelectItem>
                    <SelectItem value="ADMINISTRADOR">Administrador</SelectItem>
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
            <TableHead>Email</TableHead>
            <TableHead>Departamento</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {profesores.map((prof) => (
            <TableRow key={prof.id}>
              <TableCell className="font-medium flex items-center gap-2">
                <User className="h-4 w-4 text-slate-400" />
                {prof.nombre} {prof.apellido1}
              </TableCell>
              <TableCell>{prof.email}</TableCell>
              <TableCell>{prof.departamento?.nombre || "-"}</TableCell>
              <TableCell>
                <Badge variant={prof.role === "ADMINISTRADOR" ? "default" : prof.role === "JEFE_DEPARTAMENTO" ? "secondary" : "outline"}>
                  {prof.role === "ADMINISTRADOR" ? "Admin" : prof.role === "JEFE_DEPARTAMENTO" ? "Jefe Dpto." : "Profesor"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" onClick={() => handleEdit(prof)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(prof.id)}>
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