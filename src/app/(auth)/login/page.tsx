"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [csrfToken, setCsrfToken] = useState("")
  const [ready, setReady] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    fetch("/api/auth/csrf")
      .then(res => res.json())
      .then(data => {
        setCsrfToken(data.csrfToken)
        setReady(true)
      })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    formRef.current?.submit()
  }

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-slate-500">Cargando...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Instituto de Secundaria</CardTitle>
          <CardDescription>Inicia sesión para acceder al sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            ref={formRef}
            action="/api/auth/callback/credentials"
            method="POST"
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <input type="hidden" name="csrfToken" value={csrfToken} />
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="profesor@instituto.es"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Iniciando sesión..." : "Iniciar sesión"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}