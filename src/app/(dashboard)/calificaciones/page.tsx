"use client"

import { useSearchParams } from "next/navigation"
import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Badge } from "@/components/ui/badge"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import { GraduationCap, Users, BookOpen, TrendingUp } from "lucide-react"

const nivelsCompetencia = {
  EN_INICIO: { label: "En inicio", color: "bg-red-100 text-red-800", value: 1 },
  EN_DESARROLLO: { label: "En desarrollo", color: "bg-yellow-100 text-yellow-800", value: 2 },
  ADQUIRIDO: { label: "Adquirido", color: "bg-blue-100 text-blue-800", value: 3 },
  DOMINADO: { label: "Dominado", color: "bg-green-100 text-green-800", value: 4 },
}

const competenciasData = [
  { subject: "CCL", A: 75, B: 82, fullMark: 100 },
  { subject: "CMCT", A: 68, B: 75, fullMark: 100 },
  { subject: "CD", A: 88, B: 85, fullMark: 100 },
  { subject: "CP", A: 72, B: 78, fullMark: 100 },
  { subject: "CSC", A: 80, B: 88, fullMark: 100 },
  { subject: "CE", A: 65, B: 72, fullMark: 100 },
  { subject: "CC", A: 78, B: 84, fullMark: 100 },
]

const estudiantesDemo = [
  { id: "1", nombre: "Alejandro Fernández García", competencias: { CCL: 3, CMCT: 2, CD: 4, CP: 3, CSC: 3, CE: 2, CC: 3 }, nota: 7.5 },
  { id: "2", nombre: "María López Martínez", competencias: { CCL: 4, CMCT: 3, CD: 4, CP: 4, CSC: 4, CE: 3, CC: 4 }, nota: 9.2 },
  { id: "3", nombre: "Carlos Ruiz Sánchez", competencias: { CCL: 2, CMCT: 2, CD: 3, CP: 2, CSC: 2, CE: 1, CC: 2 }, nota: 5.8 },
  { id: "4", nombre: "Ana García López", competencias: { CCL: 3, CMCT: 3, CD: 4, CP: 3, CSC: 4, CE: 3, CC: 3 }, nota: 8.1 },
  { id: "5", nombre: "David Pérez González", competencias: { CCL: 1, CMCT: 1, CD: 2, CP: 1, CSC: 2, CE: 1, CC: 1 }, nota: 4.2 },
]

const criteriosDemo = [
  { id: "1", codigo: "1.1", descripcion: "Identificar fontes de información reliability", peso: 25 },
  { id: "2", codigo: "1.2", descripcion: "Analizar a información con criterio", peso: 30 },
  { id: "3", codigo: "2.1", descripcion: "Comunicar de forma clara eoida", peso: 25 },
  { id: "4", codigo: "2.2", descripcion: "Usar ferramentas diitales de forma efectiva", peso: 20 },
]

const mockGrupos = [
  { id: "1", nombre: "1º ESO A", curso: 1, letra: "A", nivelEducativo: "ESO" },
  { id: "2", nombre: "1º ESO B", curso: 1, letra: "B", nivelEducativo: "ESO" },
  { id: "3", nombre: "2º Bach. A", curso: 2, letra: "A", nivelEducativo: "BACHILLERATO" },
]

const mockSdas = [
  { id: "sda-1", titulo: "Investigación sobre el cambio climático", criterios: criteriosDemo },
  { id: "sda-2", titulo: "Proyecto de creación digital", criterios: criteriosDemo },
]

export default function CalificacionesPage() {
  const searchParams = useSearchParams()
  const [grupoId, setGrupoId] = useState(searchParams.get("grupo") || "1")
  const [sdaId, setSdaId] = useState(searchParams.get("sda") || "sda-1")
  const [trimestre, setTrimestre] = useState(searchParams.get("trimestre") || "PRIMERO")

  const currentSDA = useMemo(() => 
    mockSdas.find((s) => s.id === sdaId) || mockSdas[0]
  , [sdaId])

  const mediaClase = useMemo(() => 
    (estudiantesDemo.reduce((acc, e) => acc + e.nota, 0) / estudiantesDemo.length).toFixed(1)
  , [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Cuaderno de Calificaciones</h2>
          <p className="text-slate-500">Evalúa el progreso de tus alumnos por Situación de Aprendizaje</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <GraduationCap className="h-4 w-4" />
          <span>Curso 2025-2026</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500 rounded-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-blue-700 font-medium">Total Alumnos</p>
                <p className="text-2xl font-bold text-blue-900">{estudiantesDemo.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500 rounded-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-green-700 font-medium">SDA Activas</p>
                <p className="text-2xl font-bold text-green-900">{mockSdas.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500 rounded-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-purple-700 font-medium">Media Clase</p>
                <p className="text-2xl font-bold text-purple-900">{mediaClase}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-500 rounded-lg">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-orange-700 font-medium">Trimestre</p>
                <p className="text-2xl font-bold text-orange-900">
                  {trimestre === "PRIMERO" ? "1º" : trimestre === "SEGUNDO" ? "2º" : "3º"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Select value={grupoId} onValueChange={setGrupoId}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Seleccionar grupo" />
          </SelectTrigger>
          <SelectContent>
            {mockGrupos.map((grupo) => (
              <SelectItem key={grupo.id} value={grupo.id}>
                {grupo.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sdaId} onValueChange={setSdaId}>
          <SelectTrigger className="w-full sm:w-[300px]">
            <SelectValue placeholder="Seleccionar SDA" />
          </SelectTrigger>
          <SelectContent>
            {mockSdas.map((sda) => (
              <SelectItem key={sda.id} value={sda.id}>
                {sda.titulo}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={trimestre} onValueChange={setTrimestre}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="Trimestre" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PRIMERO">1º Trimestre</SelectItem>
            <SelectItem value="SEGUNDO">2º Trimestre</SelectItem>
            <SelectItem value="TERCERO">3º Trimestre</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader className="border-b">
          <CardTitle className="flex items-center justify-between">
            <span>
              {currentSDA.titulo} - {trimestre === "PRIMERO" ? "1º Trimestre" : trimestre === "SEGUNDO" ? "2º Trimestre" : "3º Trimestre"}
            </span>
            <Badge variant="outline" className="text-sm">
              {estudiantesDemo.length} alumnos
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="font-bold text-slate-900 w-[250px]">Alumno</TableHead>
                  {currentSDA.criterios.map((c) => (
                    <TableHead key={c.id} className="text-center min-w-[120px]">
                      <div className="text-xs text-slate-500">{c.codigo}</div>
                      <div className="text-xs text-slate-400">{c.peso}%</div>
                    </TableHead>
                  ))}
                  <TableHead className="text-center font-bold text-slate-900">Nota</TableHead>
                  <TableHead className="text-center font-bold text-slate-900">Nivel</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {estudiantesDemo.map((estudiante) => {
                  const nivel = Object.values(estudiante.competencias).reduce((a, b) => a + b, 0) / 7
                  const nivelLabel = nivel < 2 ? "EN_INICIO" : nivel < 3 ? "EN_DESARROLLO" : nivel < 3.5 ? "ADQUIRIDO" : "DOMINADO"
                  return (
                    <TableRow key={estudiante.id} className="hover:bg-slate-50">
                      <TableCell className="font-medium">
                        {estudiante.nombre}
                      </TableCell>
                      {currentSDA.criterios.map((c) => {
                        const val = estudiante.competencias["CCL"]
                        return (
                          <TableCell key={c.id} className="text-center">
                            <select
                              className="w-16 p-1 text-center border rounded-md text-sm"
                              defaultValue={val}
                            >
                              <option value="1">1</option>
                              <option value="2">2</option>
                              <option value="3">3</option>
                              <option value="4">4</option>
                            </select>
                          </TableCell>
                        )
                      })}
                      <TableCell className="text-center font-bold">
                        <span
                          className={`text-lg ${
                            Number(estudiante.nota.toFixed(1)) < 5
                              ? "text-red-600"
                              : Number(estudiante.nota.toFixed(1)) < 7
                              ? "text-yellow-600"
                              : "text-green-600"
                          }`}
                        >
                          {estudiante.nota.toFixed(1)}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={nivelsCompetencia[nivelLabel as keyof typeof nivelsCompetencia].color}>
                          {nivelsCompetencia[nivelLabel as keyof typeof nivelsCompetencia].label}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Distribución de Competencias - Clase</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={competenciasData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: "#64748b", fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#94a3b8", fontSize: 10 }} />
                  <Radar
                    name="Media Clase"
                    dataKey="A"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.3}
                  />
                  <Radar
                    name="Obj. Curso"
                    dataKey="B"
                    stroke="#22c55e"
                    fill="#22c55e"
                    fillOpacity={0.2}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px" }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Progreso por Competencias Clave</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={competenciasData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" domain={[0, 100]} tick={{ fill: "#64748b", fontSize: 12 }} />
                  <YAxis type="category" dataKey="subject" tick={{ fill: "#64748b", fontSize: 12 }} width={40} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px" }}
                    formatter={(value: number) => [`${value}%`, "Consecución"]}
                  />
                  <Bar dataKey="A" fill="#3b82f6" radius={[0, 4, 4, 0]} name="Media Actual" />
                  <Bar dataKey="B" fill="#e2e8f0" radius={[0, 4, 4, 0]} name="Objetivo" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}