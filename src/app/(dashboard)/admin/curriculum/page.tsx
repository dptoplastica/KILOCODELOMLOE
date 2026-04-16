"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select"
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Edit, BookOpen, Target, ListChecks } from "lucide-react"

interface CompetenciaClave {
  id: string
  codigo: string
  nombre: string
  descripcion: string
  competencias?: CompetenciaEspecifica[]
}

interface CompetenciaEspecifica {
  id: string
  codigo: string
  nombre: string
  descripcion: string
  materiaId: string
  materia?: { id: string; nombre: string }
  criterios?: Criterio[]
  saberes?: { saber: Saber }[]
}

interface Criterio {
  id: string
  codigo: string
  descripcion: string
  pesoPorcentual: number
  orden: number
}

interface Saber {
  id: string
  bloque: string
  contenido: string
  materiaId: string
}

interface Materia {
  id: string
  nombre: string
}

export default function CurriculumPage() {
  const [competencias, setCompetencias] = useState<CompetenciaClave[]>([])
  const [materias, setMaterias] = useState<Materia[]>([])
  const [loading, setLoading] = useState(true)
  const [editItem, setEditItem] = useState<any>(null)
  const [dialogType, setDialogType] = useState<string>("")
  const [dialogOpen, setDialogOpen] = useState(false)

  const [formData, setFormData] = useState<any>({})

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const res = await fetch("/api/admin/curriculum")
      const data = await res.json()
      setCompetencias(data)
      
      const mRes = await fetch("/api/admin/materias")
      const mData = await mRes.json()
      setMaterias(mData.materias || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      const method = editItem?.id ? "PUT" : "POST"
      const res = await fetch("/api/admin/curriculum", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: dialogType, id: editItem?.id, data: formData })
      })
      if (res.ok) {
        setDialogOpen(false)
        fetchData()
        setEditItem(null)
        setFormData({})
      }
    } catch (e) {
      console.error(e)
    }
  }

  async function handleDelete(type: string, id: string) {
    if (!confirm("¿Eliminar?")) return
    try {
      await fetch(`/api/admin/curriculum?type=${type}&id=${id}`, { method: "DELETE" })
      fetchData()
    } catch (e) {
      console.error(e)
    }
  }

  function openDialog(type: string, item?: any) {
    setDialogType(type)
    setEditItem(item || null)
    setFormData(item || {})
    setDialogOpen(true)
  }

  if (loading) return <div className="p-8">Cargando...</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestión del Currículo LOMLOE</h1>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Competencias Clave
              </CardTitle>
              <CardDescription>Competencias clave según LOMLOE</CardDescription>
            </div>
            <Button onClick={() => openDialog("competenciaClave")}>
              <Plus className="h-4 w-4 mr-2" /> Nueva
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {competencias.map((cc) => (
                <div key={cc.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Badge variant="outline">{cc.codigo}</Badge>
                    <span className="ml-2 font-medium">{cc.nombre}</span>
                    <p className="text-sm text-slate-500 mt-1">{cc.descripcion}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => openDialog("competenciaClave", cc)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete("competenciaClave", cc.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
              {competencias.length === 0 && <p className="text-slate-500">No hay competencias clave</p>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Competencias Específicas
              </CardTitle>
              <CardDescription>Vinculadas a materias y competencias clave</CardDescription>
            </div>
            <Button onClick={() => openDialog("competenciaEspecifica")}>
              <Plus className="h-4 w-4 mr-2" /> Nueva
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {competencias.flatMap(cc => 
                (cc.competencias || []).map(ce => (
                  <div key={ce.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <Badge>{cc.codigo}</Badge>
                      <Badge variant="outline" className="ml-1">{ce.codigo}</Badge>
                      <span className="ml-2 font-medium">{ce.nombre}</span>
                      <p className="text-sm text-slate-500 mt-1">{ce.descripcion}</p>
                      {ce.materia && <Badge variant="secondary" className="mt-1">{ce.materia.nombre}</Badge>}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => openDialog("competenciaEspecifica", ce)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete("competenciaEspecifica", ce.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
              {competencias.every(c => !c.competencias?.length) && (
                <p className="text-slate-500">No hay competencias específicas</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ListChecks className="h-5 w-5" />
                Criterios de Evaluación
              </CardTitle>
              <CardDescription>Por cada competencia específica</CardDescription>
            </div>
            <Button onClick={() => openDialog("criterio")}>
              <Plus className="h-4 w-4 mr-2" /> Nuevo
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {competencias.flatMap(cc => 
                (cc.competencias || []).flatMap(ce => 
                  (ce.criterios || []).map(c => (
                    <div key={c.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <Badge>{ce.codigo}</Badge>
                        <span className="ml-2 font-medium">{c.codigo}</span>
                        <span className="ml-2 text-sm text-slate-600">{c.descripcion}</span>
                        <Badge variant="secondary" className="ml-2">{c.pesoPorcentual}%</Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => openDialog("criterio", c)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete("criterio", c.id)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))
                )
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Saberes Básicos
              </CardTitle>
              <CardDescription>Contenido por materia</CardDescription>
            </div>
            <Button onClick={() => openDialog("saber")}>
              <Plus className="h-4 w-4 mr-2" /> Nuevo
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {competencias.flatMap(cc => 
                (cc.competencias || []).flatMap(ce => 
                  (ce.saberes || []).map(s => (
                    <div key={s.saber.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <Badge variant="outline">{s.saber.bloque}</Badge>
                        <span className="ml-2 text-sm">{s.saber.contenido}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => openDialog("saber", s.saber)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete("saber", s.saber.id)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))
                )
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editItem?.id ? "Editar" : "Nueva"} {dialogType === "competenciaClave" ? "Competencia Clave" : 
                dialogType === "competenciaEspecifica" ? "Competencia Específica" :
                dialogType === "criterio" ? "Criterio" : "Saber"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {dialogType === "competenciaClave" && (
              <>
                <div className="space-y-2">
                  <Label>Código</Label>
                  <Input value={formData.codigo || ""} onChange={e => setFormData({...formData, codigo: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label>Nombre</Label>
                  <Input value={formData.nombre || ""} onChange={e => setFormData({...formData, nombre: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label>Descripción</Label>
                  <Textarea value={formData.descripcion || ""} onChange={e => setFormData({...formData, descripcion: e.target.value})} />
                </div>
              </>
            )}
            {dialogType === "competenciaEspecifica" && (
              <>
                <div className="space-y-2">
                  <Label>Competencia Clave</Label>
                  <Select value={formData.competenciaClaveId} onValueChange={v => setFormData({...formData, competenciaClaveId: v})}>
                    <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                    <SelectContent>
                      {competencias.map(cc => (
                        <SelectItem key={cc.id} value={cc.id}>{cc.codigo} - {cc.nombre}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Materia</Label>
                  <Select value={formData.materiaId} onValueChange={v => setFormData({...formData, materiaId: v})}>
                    <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                    <SelectContent>
                      {materias.map(m => (
                        <SelectItem key={m.id} value={m.id}>{m.nombre}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Código</Label>
                  <Input value={formData.codigo || ""} onChange={e => setFormData({...formData, codigo: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label>Nombre</Label>
                  <Input value={formData.nombre || ""} onChange={e => setFormData({...formData, nombre: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label>Descripción</Label>
                  <Textarea value={formData.descripcion || ""} onChange={e => setFormData({...formData, descripcion: e.target.value})} />
                </div>
              </>
            )}
            {dialogType === "criterio" && (
              <>
                <div className="space-y-2">
                  <Label>Competencia Específica</Label>
                  <Select value={formData.competenciaEspecificaId} onValueChange={v => setFormData({...formData, competenciaEspecificaId: v})}>
                    <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                    <SelectContent>
                      {competencias.flatMap(cc => cc.competencias || []).map(ce => (
                        <SelectItem key={ce.id} value={ce.id}>{ce.codigo} - {ce.nombre}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Código</Label>
                  <Input value={formData.codigo || ""} onChange={e => setFormData({...formData, codigo: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label>Descripción</Label>
                  <Textarea value={formData.descripcion || ""} onChange={e => setFormData({...formData, descripcion: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Peso (%)</Label>
                  <Input type="number" value={formData.pesoPorcentual || 0} onChange={e => setFormData({...formData, pesoPorcentual: parseFloat(e.target.value)})} />
                </div>
                <div className="space-y-2">
                  <Label>Orden</Label>
                  <Input type="number" value={formData.orden || 0} onChange={e => setFormData({...formData, orden: parseInt(e.target.value)})} />
                </div>
              </>
            )}
            {dialogType === "saber" && (
              <>
                <div className="space-y-2">
                  <Label>Materia</Label>
                  <Select value={formData.materiaId} onValueChange={v => setFormData({...formData, materiaId: v})}>
                    <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                    <SelectContent>
                      {materias.map(m => (
                        <SelectItem key={m.id} value={m.id}>{m.nombre}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Bloque</Label>
                  <Input value={formData.bloque || ""} onChange={e => setFormData({...formData, bloque: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label>Contenido</Label>
                  <Textarea value={formData.contenido || ""} onChange={e => setFormData({...formData, contenido: e.target.value})} />
                </div>
              </>
            )}
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button type="submit">Guardar</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
