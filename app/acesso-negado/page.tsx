"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldX, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AcessoNegado() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="space-y-4">
          <div className="flex justify-center">
            <ShieldX className="h-16 w-16 text-red-500" />
          </div>
          <CardTitle className="text-2xl text-red-700">Acesso Negado</CardTitle>
          <CardDescription className="text-gray-600">
            Você não tem permissão para acessar esta página. Esta área é restrita apenas para administradores.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-sm text-red-700">
              Se você acredita que deveria ter acesso a esta funcionalidade, entre em contato com um administrador do
              sistema.
            </p>
          </div>
          <Button onClick={() => router.push("/")} className="w-full flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar para Página Inicial
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
