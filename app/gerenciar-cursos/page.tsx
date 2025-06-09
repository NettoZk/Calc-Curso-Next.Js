"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Edit, Trash2, Save, X } from "lucide-react"
import { useCursos, type Curso, type Regime } from "@/contexts/cursos-context"
import { useAdminGuard } from "@/hooks/use-admin-guard"

export default function GerenciarCursos() {
  const { isLoading, canAccess } = useAdminGuard()
  const { cursos, adicionarCurso, atualizarCurso, excluirCurso } = useCursos()
  const [regimeSelecionado, setRegimeSelecionado] = useState<Regime>("seriado")
  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [adicionandoNovo, setAdicionandoNovo] = useState(false)
  const [formData, setFormData] = useState({ nome: "", valorCredito: "" })

  // Mostrar loading enquanto verifica permissões
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Verificando permissões...</p>
        </div>
      </div>
    )
  }

  // Se não tem acesso, não renderizar nada (o hook já redirecionou)
  if (!canAccess) {
    return null
  }

  const cursosDoRegime = cursos[regimeSelecionado]

  const handleSalvarNovo = () => {
    if (formData.nome.trim() && formData.valorCredito) {
      adicionarCurso(regimeSelecionado, {
        nome: formData.nome.trim().toUpperCase(),
        valorCredito: Number.parseFloat(formData.valorCredito),
      })
      setFormData({ nome: "", valorCredito: "" })
      setAdicionandoNovo(false)
    }
  }

  const handleSalvarEdicao = () => {
    if (editandoId && formData.nome.trim() && formData.valorCredito) {
      atualizarCurso(regimeSelecionado, editandoId, {
        nome: formData.nome.trim().toUpperCase(),
        valorCredito: Number.parseFloat(formData.valorCredito),
      })
      setEditandoId(null)
      setFormData({ nome: "", valorCredito: "" })
    }
  }

  const handleIniciarEdicao = (curso: Curso) => {
    setEditandoId(curso.id)
    setFormData({
      nome: curso.nome,
      valorCredito: curso.valorCredito.toString(),
    })
    setAdicionandoNovo(false)
  }

  const handleCancelar = () => {
    setEditandoId(null)
    setAdicionandoNovo(false)
    setFormData({ nome: "", valorCredito: "" })
  }

  const handleExcluir = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este curso?")) {
      excluirCurso(regimeSelecionado, id)
    }
  }

  const handleMudarRegime = (novoRegime: Regime) => {
    setRegimeSelecionado(novoRegime)
    handleCancelar() // Cancelar qualquer edição em andamento
  }

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Gerenciar Cursos</h1>
          <p className="text-gray-600">Adicione, edite ou remova cursos do sistema</p>
        </div>

        <div className="grid gap-6">
          {/* Seletor de Regime */}
          <Card>
            <CardHeader>
              <CardTitle>Selecionar Regime</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Button
                  variant={regimeSelecionado === "seriado" ? "default" : "outline"}
                  onClick={() => handleMudarRegime("seriado")}
                  className="flex-1"
                >
                  Regime Seriado
                </Button>
                <Button
                  variant={regimeSelecionado === "aberto" ? "default" : "outline"}
                  onClick={() => handleMudarRegime("aberto")}
                  className="flex-1"
                >
                  Regime Aberto
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Gerenciamento de Cursos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Cursos do Regime {regimeSelecionado === "seriado" ? "Seriado" : "Aberto"}</span>
                <Button
                  onClick={() => setAdicionandoNovo(true)}
                  disabled={adicionandoNovo || editandoId !== null}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Adicionar Curso
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {adicionandoNovo && (
                <div className="mb-6 p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50">
                  <h3 className="font-semibold mb-4">Adicionar Novo Curso</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nome">Nome do Curso</Label>
                      <Input
                        id="nome"
                        value={formData.nome}
                        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                        placeholder="Ex: ENGENHARIA DE PRODUÇÃO"
                      />
                    </div>
                    <div>
                      <Label htmlFor="valor">Valor do Crédito (R$)</Label>
                      <Input
                        id="valor"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.valorCredito}
                        onChange={(e) => setFormData({ ...formData, valorCredito: e.target.value })}
                        placeholder="Ex: 45.50"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button onClick={handleSalvarNovo} className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      Salvar
                    </Button>
                    <Button variant="outline" onClick={handleCancelar} className="flex items-center gap-2">
                      <X className="h-4 w-4" />
                      Cancelar
                    </Button>
                  </div>
                </div>
              )}

              {/* Lista de cursos */}
              <div className="space-y-2">
                {cursosDoRegime.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Nenhum curso cadastrado neste regime.</p>
                ) : (
                  cursosDoRegime.map((curso) => (
                    <div
                      key={curso.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white hover:bg-gray-50"
                    >
                      {editandoId === curso.id ? (
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input
                            value={formData.nome}
                            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                            placeholder="Nome do curso"
                          />
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            value={formData.valorCredito}
                            onChange={(e) => setFormData({ ...formData, valorCredito: e.target.value })}
                            placeholder="Valor do crédito"
                          />
                        </div>
                      ) : (
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{curso.nome}</h3>
                          <p className="text-gray-600">Valor do crédito: {formatarMoeda(curso.valorCredito)}</p>
                        </div>
                      )}

                      <div className="flex gap-2 ml-4">
                        {editandoId === curso.id ? (
                          <>
                            <Button size="sm" onClick={handleSalvarEdicao} className="flex items-center gap-1">
                              <Save className="h-3 w-3" />
                              Salvar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleCancelar}
                              className="flex items-center gap-1"
                            >
                              <X className="h-3 w-3" />
                              Cancelar
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleIniciarEdicao(curso)}
                              disabled={editandoId !== null || adicionandoNovo}
                              className="flex items-center gap-1"
                            >
                              <Edit className="h-3 w-3" />
                              Editar
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleExcluir(curso.id)}
                              disabled={editandoId !== null || adicionandoNovo}
                              className="flex items-center gap-1"
                            >
                              <Trash2 className="h-3 w-3" />
                              Excluir
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
