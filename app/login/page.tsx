"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GraduationCap } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export default function Login() {
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [erro, setErro] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro("")

    if (!email || !senha) {
      setErro("Por favor, preencha todos os campos.")
      return
    }

    setIsLoading(true)

    try {
      const resultado = await login(email, senha)

      if (!resultado.success) {
        setErro(resultado.message || "Erro ao fazer login.")
      }
    } catch (error) {
      setErro("Ocorreu um erro ao fazer login. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <GraduationCap className="h-12 w-12 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Calculadora de Mensalidades</CardTitle>
          <CardDescription>Entre com suas credenciais para acessar o sistema</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu.email@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="senha">Senha</Label>
              <Input id="senha" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required />
            </div>
            {erro && (
              <div
                className={`p-3 rounded-md text-sm ${
                  erro.includes("bloqueado") ? "bg-red-50 text-red-700 border border-red-200" : "bg-red-50 text-red-700"
                }`}
              >
                {erro}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </CardFooter>
        </form>
        <div className="p-4 bg-gray-50 text-center text-sm text-gray-500 rounded-b-lg space-y-1">
          <p>
            <strong>Admin:</strong> admin@exemplo.com / admin123
          </p>
          <p>
            <strong>Usuário:</strong> user@exemplo.com / user123
          </p>
        </div>
      </Card>
    </div>
  )
}
