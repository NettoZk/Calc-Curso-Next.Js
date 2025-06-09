"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Save, X, Shield, ShieldOff, Clock } from "lucide-react"
import { useAuth, type Usuario } from "@/contexts/auth-context"
import { useAdminGuard } from "@/hooks/use-admin-guard"

export default function GerenciarUsuarios() {
  const { isLoading, canAccess } = useAdminGuard()
  const {
    usuario: usuarioLogado,
    usuarios,
    adicionarUsuario,
    atualizarUsuario,
    excluirUsuario,
    bloquearUsuario,
    desbloquearUsuario,
  } = useAuth()
  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [adicionandoNovo, setAdicionandoNovo] = useState(false)
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    role: "user" as "admin" | "user",
    ativo: true,
  })

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

  const handleSalvarNovo = () => {
    if (formData.nome.trim() && formData.email.trim() && formData.senha.trim()) {
      adicionarUsuario({
        nome: formData.nome.trim(),
        email: formData.email.trim(),
        senha: formData.senha,
        role: formData.role,
        ativo: formData.ativo,
      })
      setFormData({ nome: "", email: "", senha: "", role: "user", ativo: true })
      setAdicionandoNovo(false)
    }
  }

  const handleSalvarEdicao = () => {
    if (editandoId && formData.nome.trim() && formData.email.trim()) {
      // Se a senha estiver vazia, manter a senha atual
      const usuarioAtual = usuarios.find((u) => u.id === editandoId)
      const senhaFinal = formData.senha.trim() || usuarioAtual?.senha || ""

      atualizarUsuario(editandoId, {
        nome: formData.nome.trim(),
        email: formData.email.trim(),
        senha: senhaFinal,
        role: formData.role,
        ativo: formData.ativo,
        ultimoLogin: usuarioAtual?.ultimoLogin,
      })
      setEditandoId(null)
      setFormData({ nome: "", email: "", senha: "", role: "user", ativo: true })
    }
  }

  const handleIniciarEdicao = (usuario: Usuario) => {
    setEditandoId(usuario.id)
    setFormData({
      nome: usuario.nome,
      email: usuario.email,
      senha: "", // Não preencher a senha por segurança
      role: usuario.role,
      ativo: usuario.ativo,
    })
    setAdicionandoNovo(false)
  }

  const handleCancelar = () => {
    setEditandoId(null)
    setAdicionandoNovo(false)
    setFormData({ nome: "", email: "", senha: "", role: "user", ativo: true })
  }

  const handleExcluir = (id: string) => {
    // Não permitir excluir o próprio usuário
    if (usuarioLogado?.id === id) {
      alert("Você não pode excluir seu próprio usuário.")
      return
    }

    if (confirm("Tem certeza que deseja excluir este usuário?")) {
      excluirUsuario(id)
    }
  }

  const handleBloquear = (id: string) => {
    if (usuarioLogado?.id === id) {
      alert("Você não pode bloquear seu próprio usuário.")
      return
    }

    if (confirm("Tem certeza que deseja bloquear este usuário?")) {
      bloquearUsuario(id)
    }
  }

  const handleDesbloquear = (id: string) => {
    if (confirm("Tem certeza que deseja desbloquear este usuário?")) {
      desbloquearUsuario(id)
    }
  }

  const formatarData = (dataISO: string) => {
    return new Date(dataISO).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Gerenciar Usuários</h1>
          <p className="text-gray-600">Adicione, edite, bloqueie ou remova usuários do sistema</p>
        </div>

        <div className="grid gap-6">
          {/* Formulário para adicionar novo usuário */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Usuários do Sistema</span>
                <Button
                  onClick={() => setAdicionandoNovo(true)}
                  disabled={adicionandoNovo || editandoId !== null}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Adicionar Usuário
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {adicionandoNovo && (
                <div className="mb-6 p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50">
                  <h3 className="font-semibold mb-4">Adicionar Novo Usuário</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nome">Nome</Label>
                      <Input
                        id="nome"
                        value={formData.nome}
                        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                        placeholder="Nome completo"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="email@exemplo.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="senha">Senha</Label>
                      <Input
                        id="senha"
                        type="password"
                        value={formData.senha}
                        onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                        placeholder="Senha"
                      />
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="isAdmin"
                          checked={formData.role === "admin"}
                          onCheckedChange={(checked) => setFormData({ ...formData, role: checked ? "admin" : "user" })}
                        />
                        <Label htmlFor="isAdmin">Usuário Administrador</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="isAtivo"
                          checked={formData.ativo}
                          onCheckedChange={(checked) => setFormData({ ...formData, ativo: checked === true })}
                        />
                        <Label htmlFor="isAtivo">Usuário Ativo</Label>
                      </div>
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

              {/* Lista de usuários */}
              <div className="space-y-2">
                {usuarios.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Nenhum usuário cadastrado.</p>
                ) : (
                  usuarios.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white hover:bg-gray-50"
                    >
                      {editandoId === user.id ? (
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`edit-nome-${user.id}`}>Nome</Label>
                            <Input
                              id={`edit-nome-${user.id}`}
                              value={formData.nome}
                              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label htmlFor={`edit-email-${user.id}`}>Email</Label>
                            <Input
                              id={`edit-email-${user.id}`}
                              type="email"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label htmlFor={`edit-senha-${user.id}`}>Nova Senha (deixe em branco para manter)</Label>
                            <Input
                              id={`edit-senha-${user.id}`}
                              type="password"
                              value={formData.senha}
                              onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                              placeholder="Nova senha (opcional)"
                            />
                          </div>
                          <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={`edit-isAdmin-${user.id}`}
                                checked={formData.role === "admin"}
                                onCheckedChange={(checked) =>
                                  setFormData({ ...formData, role: checked ? "admin" : "user" })
                                }
                              />
                              <Label htmlFor={`edit-isAdmin-${user.id}`}>Usuário Administrador</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={`edit-isAtivo-${user.id}`}
                                checked={formData.ativo}
                                onCheckedChange={(checked) => setFormData({ ...formData, ativo: checked === true })}
                              />
                              <Label htmlFor={`edit-isAtivo-${user.id}`}>Usuário Ativo</Label>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900">{user.nome}</h3>
                            {user.role === "admin" && (
                              <Badge variant="secondary" className="text-xs">
                                Admin
                              </Badge>
                            )}
                            {!user.ativo && (
                              <Badge variant="destructive" className="text-xs">
                                Bloqueado
                              </Badge>
                            )}
                            {usuarioLogado?.id === user.id && (
                              <Badge variant="outline" className="text-xs">
                                Você
                              </Badge>
                            )}
                          </div>
                          <p className="text-gray-600 text-sm">{user.email}</p>
                          <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                            <span>Criado: {formatarData(user.dataCriacao)}</span>
                            {user.ultimoLogin && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Último login: {formatarData(user.ultimoLogin)}
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2 ml-4">
                        {editandoId === user.id ? (
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
                            {user.ativo ? (
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleBloquear(user.id)}
                                disabled={editandoId !== null || adicionandoNovo || usuarioLogado?.id === user.id}
                                className="flex items-center gap-1"
                              >
                                <ShieldOff className="h-3 w-3" />
                                Bloquear
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="default"
                                onClick={() => handleDesbloquear(user.id)}
                                disabled={editandoId !== null || adicionandoNovo}
                                className="flex items-center gap-1 bg-green-600 hover:bg-green-700"
                              >
                                <Shield className="h-3 w-3" />
                                Desbloquear
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleIniciarEdicao(user)}
                              disabled={editandoId !== null || adicionandoNovo}
                              className="flex items-center gap-1"
                            >
                              <Edit className="h-3 w-3" />
                              Editar
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleExcluir(user.id)}
                              disabled={editandoId !== null || adicionandoNovo || usuarioLogado?.id === user.id}
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
