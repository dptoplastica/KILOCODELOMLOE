"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  LineChart,
  Line,
} from "recharts"
import { GraduationCap, TrendingUp, Award, Download } from "lucide-react"

const competenciasDemo = [
  { competencia: "CCL", inicio: 20, desarrollo: 40, adquirido: 30, dominado: 10 },
  { competencia: "CMCT", inicio: 15, desarrollo: 35, adquirido: 35, dominado: 15 },
  { competencia: "CD", inicio: 10, desarrollo: 30, adquirido: 40, dominado: 20 },
  { competencia: "CP", inicio: 25, desarrollo: 45, adquirido: 25, dominado: 5 },
  { competencia: "CSC", inicio: 20, desarrollo: 35, adquirido: 35, dominado: 10 },
  { competencia: "CE", inicio: 30, desarrollo: 40, adquirido: 20, dominado: 10 },
  { competencia: "CC", inicio: 15, desarrollo: 40, adquirido: 30, dominado: 15 },
]

const progresoData = [
  { trimestre: "1º Trim", nota: 6.5 },
  { trimestre: "2º Trim", nota: 7.2 },
  { trimestre: "3º Trim", nota: 7.8 },
]

const radarData = [
  { subject: "CCL", A: 75, fullMark: 100 },
  { subject: "CMCT", A: 68, fullMark: 100 },
  { subject: "CD", A: 88, fullMark: 100 },
  { subject: "CP", A: 72, fullMark: 100 },
  { subject: "CSC", A: 80, fullMark: 100 },
  { subject: "CE", A: 65, fullMark: 100 },
  { subject: "CC", A: 78, fullMark: 100 },
]

export default function InformesPage() {
  const [alumnoId, setAlumnoId] = useState("1")
  const [trimestre, setTrimestre] = useState("FINAL")

  const estudiantes = [
    { id: "1", nombre: "Alejandro Fernández García", nota: 7.5, nivel: "ADQUIRIDO" },
    { id: "2", nombre: "María López Martínez", nota: 9.2, nivel: "DOMINADO" },
    { id: "3", nombre: "Carlos Ruiz Sánchez", nota: 5.8, nivel: "EN_DESARROLLO" },
    { id: "4", nombre: "Ana García López", nota: 8.1, nivel: "ADQUIRIDO" },
    { id: "5", nombre: "David Pérez González", nota: 4.2, nivel: "EN_INICIO" },
  ]

  const currentAlumno = useMemo(() => 
    estudiantes.find(e => e.id === alumnoId) || estudiantes[0]
  , [alumnoId])

  const getNivelColor = (nivel: string) => {
    switch (nivel) {
      case "DOMINADO": return "bg-green-500"
      case "ADQUIRIDO": return "bg-blue-500"
      case "EN_DESARROLLO": return "bg-yellow-500"
      case "EN_INICIO": return "bg-red-500"
      default: return "bg-slate-500"
    }
  }

  const getNivelLabel = (nivel: string) => {
    switch (nivel) {
      case "DOMINADO": return "Dominado"
      case "ADQUIRIDO": return "Adquirido"
      case "EN_DESARROLLO": return "En Desarrollo"
      case "EN_INICIO": return "En Inicio"
      default: return nivel
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Informe de Evaluación</h2>
          <p className="text-slate-500">Informe final de competencias por alumno</p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Exportar PDF
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Select value={alumnoId} onValueChange={setAlumnoId}>
          <SelectTrigger className="w-full sm:w-[300px]">
            <SelectValue placeholder="Seleccionar alumno" />
          </SelectTrigger>
          <SelectContent>
            {estudiantes.map((e) => (
              <SelectItem key={e.id} value={e.id}>{e.nombre}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={trimestre} onValueChange={setTrimestre}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Trimestre" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PRIMERO">1º Trimestre</SelectItem>
            <SelectItem value="SEGUNDO">2º Trimestre</SelectItem>
            <SelectItem value="TERCERO">3º Trimestre</SelectItem>
            <SelectItem value="FINAL">Evaluación Final</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">{currentAlumno.nombre}</CardTitle>
              <p className="text-sm text-slate-500">1º ESO A - Tecnología</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-slate-900">{currentAlumno.nota.toFixed(1)}</div>
              <div className="text-sm text-slate-500">Nota Final</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mt-4">
            <div className={`px-4 py-2 rounded-full text-white ${getNivelColor(currentAlumno.nivel)}`}>
              {getNivelLabel(currentAlumno.nivel)}
            </div>
            <div className="text-sm text-slate-500">
              Curso 2025-2026
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Progressión de Notas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progresoData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="trimestre" tick={{ fill: "#64748b", fontSize: 12 }} />
                  <YAxis domain={[0, 10]} tick={{ fill: "#64748b", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px" }}
                  />
                  <Line type="monotone" dataKey="nota" stroke="#3b82f6" strokeWidth={3} dot={{ fill: "#3b82f6", r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Award className="h-5 w-5 text-green-600" />
              Competencias Alcanzadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: "#64748b", fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#94a3b8", fontSize: 10 }} />
                  <Radar
                    name="Consecución"
                    dataKey="A"
                    stroke="#22c55e"
                    fill="#22c55e"
                    fillOpacity={0.3}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px" }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-purple-600" />
            Distribución por Competencias Clave
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={competenciasDemo} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" domain={[0, 100]} tick={{ fill: "#64748b", fontSize: 12 }} />
                <YAxis type="category" dataKey="competencia" tick={{ fill: "#64748b", fontSize: 12 }} width={40} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px" }}
                  formatter={(value: number, name: string) => {
                    const labels: Record<string, string> = {
                      inicio: "En Inicio",
                      desarrollo: "En Desarrollo",
                      adquirido: "Adquirido",
                      dominado: "Dominado"
                    }
                    return [`${value}%`, labels[name] || name]
                  }}
                />
                <Bar dataKey="inicio" stackId="a" fill="#ef4444" name="inicio" />
                <Bar dataKey="desarrollo" stackId="a" fill="#eab308" name="desarrollo" />
                <Bar dataKey="adquirido" stackId="a" fill="#3b82f6" name="adquirido" />
                <Bar dataKey="dominado" stackId="a" fill="#22c55e" name="dominado" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span className="text-sm text-slate-600">En Inicio</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded"></div>
              <span className="text-sm text-slate-600">En Desarrollo</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span className="text-sm text-slate-600">Adquirido</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-sm text-slate-600">Dominado</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Resumen de Criterios de Evaluación</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { criterio: "1.1", desc: "Identificar fontes", peso: 25, nota: 8 },
              { criterio: "1.2", desc: "Analizar información", peso: 30, nota: 7.5 },
              { criterio: "2.1", desc: "Comunicar claramente", peso: 25, nota: 7 },
              { criterio: "2.2", desc: "Usar ferramentas digitais", peso: 20, nota: 8.5 },
            ].map((c) => (
              <div key={c.criterio} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold text-slate-900">{c.criterio}</span>
                  <span className="text-xs text-slate-500">{c.peso}%</span>
                </div>
                <p className="text-sm text-slate-500 mb-2">{c.desc}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400">Nota: {c.nota}</span>
                  <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${c.nota >= 5 ? 'bg-green-500' : 'bg-red-500'}`}
                      style={{ width: `${c.nota * 10}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}