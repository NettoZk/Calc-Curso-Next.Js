"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calculator } from "lucide-react"
import { useCursos, type Regime } from "@/contexts/cursos-context"

interface CalculadoraProps {
  regime: Regime
}

interface ResultadoCalculo {
  mensalidadeComDesconto: number
  mensalidadeSemDesconto: number
  semestreComDesconto: number
  semestreSemDesconto: number
  valorCredito: number
}

export default function CalculadoraMensalidade({ regime }: CalculadoraProps) {
  const { cursos } = useCursos()
  const [cursoSelecionado, setCursoSelecionado] = useState<string>("")
  const [quantidadeCreditos, setQuantidadeCreditos] = useState<number>(0)
  const [prazoParcelamento, setPrazoParcelamento] = useState<number>(6)
  const [desconto, setDesconto] = useState<number>(0)
  const [resultado, setResultado] = useState<ResultadoCalculo | null>(null)
  const [erros, setErros] = useState<Record<string, string>>({})

  const cursosDoRegime = cursos[regime]

  // Resetar formulário quando o regime mudar
  useState(() => {
    setCursoSelecionado("")
    setQuantidadeCreditos(0)
    setPrazoParcelamento(6)
    setDesconto(0)
    setResultado(null)
    setErros({})
  })

  const validarFormulario = () => {
    const novosErros: Record<string, string> = {}

    if (!cursoSelecionado) {
      novosErros.curso = "Selecione um curso"
    }

    if (!quantidadeCreditos || quantidadeCreditos <= 0) {
      novosErros.creditos = "Informe uma quantidade válida de créditos"
    }

    if (desconto === undefined || desconto === null) {
      novosErros.desconto = "Informe o desconto (mesmo que seja 0)"
    }

    setErros(novosErros)
    return Object.keys(novosErros).length === 0
  }

  const calcularMensalidade = () => {
    if (!validarFormulario()) {
      return
    }

    const curso = cursosDoRegime.find((c) => c.id === cursoSelecionado)
    if (!curso) return

    const valorCredito = curso.valorCredito
    const mensalidadeSemDesconto = (valorCredito * quantidadeCreditos * 6) / prazoParcelamento
    const semestreSemDesconto = valorCredito * quantidadeCreditos * 6
    const mensalidadeComDesconto = mensalidadeSemDesconto * (1 - desconto / 100)
    const semestreComDesconto = semestreSemDesconto * (1 - desconto / 100)

    setResultado({
      mensalidadeComDesconto,
      mensalidadeSemDesconto,
      semestreComDesconto,
      semestreSemDesconto,
      valorCredito,
    })
  }

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor)
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Dados do Curso - Regime {regime === "seriado" ? "Seriado" : "Aberto"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="curso" className="flex items-center justify-between">
              <span>Curso</span>
              {erros.curso && <span className="text-sm text-red-500">{erros.curso}</span>}
            </Label>
            <Select
              value={cursoSelecionado}
              onValueChange={(value) => {
                setCursoSelecionado(value)
                setErros({ ...erros, curso: "" })
              }}
            >
              <SelectTrigger className={erros.curso ? "border-red-500" : ""}>
                <SelectValue placeholder="Selecione um curso" />
              </SelectTrigger>
              <SelectContent>
                {cursosDoRegime.length === 0 ? (
                  <div className="p-2 text-sm text-gray-500">Nenhum curso cadastrado para este regime</div>
                ) : (
                  cursosDoRegime.map((curso) => (
                    <SelectItem key={curso.id} value={curso.id}>
                      {curso.nome}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="creditos" className="flex items-center justify-between">
              <span>Quantidade de Créditos</span>
              {erros.creditos && <span className="text-sm text-red-500">{erros.creditos}</span>}
            </Label>
            <Input
              id="creditos"
              type="number"
              min="1"
              value={quantidadeCreditos || ""}
              onChange={(e) => {
                setQuantidadeCreditos(Number(e.target.value))
                setErros({ ...erros, creditos: "" })
              }}
              placeholder="Ex: 20"
              className={erros.creditos ? "border-red-500" : ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="prazo">Prazo de Parcelamento (meses)</Label>
            <Select value={prazoParcelamento.toString()} onValueChange={(value) => setPrazoParcelamento(Number(value))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 10 }, (_, i) => i + 1).map((mes) => (
                  <SelectItem key={mes} value={mes.toString()}>
                    {mes} {mes === 1 ? "mês" : "meses"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="desconto" className="flex items-center justify-between">
              <span>Desconto (%)</span>
              {erros.desconto && <span className="text-sm text-red-500">{erros.desconto}</span>}
            </Label>
            <Input
              id="desconto"
              type="number"
              min="0"
              max="100"
              value={desconto}
              onChange={(e) => {
                setDesconto(Number(e.target.value))
                setErros({ ...erros, desconto: "" })
              }}
              placeholder="Ex: 10"
              className={erros.desconto ? "border-red-500" : ""}
            />
            <p className="text-xs text-gray-500">Informe 0 caso não haja desconto.</p>
          </div>

          <Button onClick={calcularMensalidade} className="w-full">
            Calcular Mensalidade
          </Button>
        </CardContent>
      </Card>

      {resultado && (
        <Card>
          <CardHeader>
            <CardTitle>Resultados do Cálculo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm font-medium text-green-800">Mensalidade com Desconto</p>
                <p className="text-lg font-bold text-green-900">{formatarMoeda(resultado.mensalidadeComDesconto)}</p>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-800">Mensalidade sem Desconto</p>
                <p className="text-lg font-bold text-gray-900">{formatarMoeda(resultado.mensalidadeSemDesconto)}</p>
              </div>

              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-blue-800">Semestre com Desconto</p>
                <p className="text-lg font-bold text-blue-900">{formatarMoeda(resultado.semestreComDesconto)}</p>
              </div>

              <div className="p-3 bg-purple-50 rounded-lg">
                <p className="text-sm font-medium text-purple-800">Semestre sem Desconto</p>
                <p className="text-lg font-bold text-purple-900">{formatarMoeda(resultado.semestreSemDesconto)}</p>
              </div>
            </div>

            <div className="p-3 bg-yellow-50 rounded-lg">
              <p className="text-sm font-medium text-yellow-800">Valor do Crédito</p>
              <p className="text-lg font-bold text-yellow-900">{formatarMoeda(resultado.valorCredito)}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
