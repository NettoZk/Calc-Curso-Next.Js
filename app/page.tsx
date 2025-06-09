"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calculator, GraduationCap, ArrowLeft } from "lucide-react"
import CalculadoraMensalidade from "@/components/calculadora-mensalidade"
import type { Regime } from "@/contexts/cursos-context"

export default function Home() {
  const [regimeSelecionado, setRegimeSelecionado] = useState<Regime | null>(null)

  if (regimeSelecionado) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => setRegimeSelecionado(null)}
              className="mb-4 flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para Seleção de Regime
            </Button>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Calculadora de Mensalidades</h1>
            <p className="text-gray-600">
              Regime selecionado: <span className="font-semibold capitalize">{regimeSelecionado}</span>
            </p>
          </div>
          <CalculadoraMensalidade regime={regimeSelecionado} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <GraduationCap className="w-16 h-16 mx-auto mb-4 text-blue-600" />
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Calculadora de Mensalidades</h1>
          <p className="text-lg text-gray-600 mb-8">Escolha o tipo de regime para calcular suas mensalidades</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <Card
            className="hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-105"
            onClick={() => setRegimeSelecionado("seriado")}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Calculator className="w-6 h-6 text-blue-600" />
                Regime Seriado
              </CardTitle>
              <CardDescription className="text-left">
                Para cursos organizados em períodos sequenciais com disciplinas pré-definidas por semestre.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">Calcular Mensalidades</Button>
            </CardContent>
          </Card>

          <Card
            className="hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-105"
            onClick={() => setRegimeSelecionado("aberto")}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Calculator className="w-6 h-6 text-green-600" />
                Regime Aberto
              </CardTitle>
              <CardDescription className="text-left">
                Para cursos com flexibilidade na escolha de disciplinas e montagem de grade curricular.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-green-600 hover:bg-green-700">Calcular Mensalidades</Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 p-4 bg-white/50 rounded-lg">
          <p className="text-sm text-gray-600">
            💡 <strong>Dica:</strong> Você pode alternar entre os regimes a qualquer momento durante o uso da
            calculadora.
          </p>
        </div>
      </div>
    </div>
  )
}
