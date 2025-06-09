"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"

export interface Usuario {
  id: string
  nome: string
  email: string
  senha: string
  role: "admin" | "user"
  ativo: boolean
  dataCriacao: string
  ultimoLogin?: string
}

interface AuthContextType {
  usuario: Usuario | null
  usuarios: Usuario[]
  isLoading: boolean
  login: (email: string, senha: string) => Promise<{ success: boolean; message?: string }>
  logout: () => void
  adicionarUsuario: (usuario: Omit<Usuario, "id" | "dataCriacao">) => void
  atualizarUsuario: (id: string, usuario: Omit<Usuario, "id" | "dataCriacao">) => void
  excluirUsuario: (id: string) => void
  bloquearUsuario: (id: string) => void
  desbloquearUsuario: (id: string) => void
  obterUsuario: (id: string) => Usuario | undefined
  isAdmin: () => boolean
  canAccessAdminFeatures: () => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const usuariosIniciais: Usuario[] = [
  {
    id: "1",
    nome: "Administrador",
    email: "admin@exemplo.com",
    senha: "admin123",
    role: "admin",
    ativo: true,
    dataCriacao: new Date().toISOString(),
  },
  {
    id: "2",
    nome: "Usuário Comum",
    email: "user@exemplo.com",
    senha: "user123",
    role: "user",
    ativo: true,
    dataCriacao: new Date().toISOString(),
  },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [usuarios, setUsuarios] = useState<Usuario[]>(usuariosIniciais)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Carregar dados do localStorage
  useEffect(() => {
    const usuariosStorage = localStorage.getItem("usuarios")
    const usuarioLogadoStorage = localStorage.getItem("usuarioLogado")

    if (usuariosStorage) {
      setUsuarios(JSON.parse(usuariosStorage))
    } else {
      localStorage.setItem("usuarios", JSON.stringify(usuariosIniciais))
    }

    if (usuarioLogadoStorage) {
      const usuarioLogado = JSON.parse(usuarioLogadoStorage)
      // Verificar se o usuário ainda está ativo
      const usuarioAtual = JSON.parse(usuariosStorage || JSON.stringify(usuariosIniciais)).find(
        (u: Usuario) => u.id === usuarioLogado.id,
      )

      if (usuarioAtual && usuarioAtual.ativo) {
        setUsuario(usuarioAtual)
      } else {
        // Se usuário foi bloqueado, fazer logout
        localStorage.removeItem("usuarioLogado")
      }
    }

    setIsLoading(false)
  }, [])

  // Salvar usuários no localStorage
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("usuarios", JSON.stringify(usuarios))
    }
  }, [usuarios, isLoading])

  // Verificar autenticação e redirecionar
  useEffect(() => {
    if (!isLoading) {
      const rotasPublicas = ["/login"]
      const rotasAdmin = ["/gerenciar-usuarios", "/gerenciar-cursos"]

      if (!usuario && !rotasPublicas.includes(pathname)) {
        router.push("/login")
      } else if (usuario && pathname === "/login") {
        router.push("/")
      } else if (usuario && rotasAdmin.includes(pathname) && usuario.role !== "admin") {
        router.push("/acesso-negado")
      }
    }
  }, [usuario, pathname, router, isLoading])

  const login = async (email: string, senha: string) => {
    const usuarioEncontrado = usuarios.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.senha === senha)

    if (!usuarioEncontrado) {
      return { success: false, message: "Email ou senha incorretos." }
    }

    if (!usuarioEncontrado.ativo) {
      return { success: false, message: "Usuário bloqueado. Entre em contato com o administrador." }
    }

    // Atualizar último login
    const usuarioAtualizado = {
      ...usuarioEncontrado,
      ultimoLogin: new Date().toISOString(),
    }

    setUsuarios((prev) => prev.map((u) => (u.id === usuarioEncontrado.id ? usuarioAtualizado : u)))
    setUsuario(usuarioAtualizado)
    localStorage.setItem("usuarioLogado", JSON.stringify(usuarioAtualizado))

    return { success: true }
  }

  const logout = () => {
    setUsuario(null)
    localStorage.removeItem("usuarioLogado")
    router.push("/login")
  }

  const adicionarUsuario = (novoUsuario: Omit<Usuario, "id" | "dataCriacao">) => {
    const id = Date.now().toString()
    const usuarioCompleto = {
      ...novoUsuario,
      id,
      dataCriacao: new Date().toISOString(),
    }
    setUsuarios((prev) => [...prev, usuarioCompleto])
  }

  const atualizarUsuario = (id: string, usuarioAtualizado: Omit<Usuario, "id" | "dataCriacao">) => {
    setUsuarios((prev) => prev.map((u) => (u.id === id ? { ...usuarioAtualizado, id, dataCriacao: u.dataCriacao } : u)))

    // Atualizar usuário logado se for o mesmo
    if (usuario && usuario.id === id) {
      const usuarioAtualizadoCompleto = { ...usuarioAtualizado, id, dataCriacao: usuario.dataCriacao }
      setUsuario(usuarioAtualizadoCompleto)
      localStorage.setItem("usuarioLogado", JSON.stringify(usuarioAtualizadoCompleto))
    }
  }

  const excluirUsuario = (id: string) => {
    // Não permitir excluir o próprio usuário logado
    if (usuario && usuario.id === id) {
      return
    }

    setUsuarios((prev) => prev.filter((u) => u.id !== id))
  }

  const bloquearUsuario = (id: string) => {
    // Não permitir bloquear o próprio usuário logado
    if (usuario && usuario.id === id) {
      return
    }

    setUsuarios((prev) => prev.map((u) => (u.id === id ? { ...u, ativo: false } : u)))

    // Se o usuário bloqueado estiver logado, fazer logout
    if (usuario && usuario.id === id) {
      logout()
    }
  }

  const desbloquearUsuario = (id: string) => {
    setUsuarios((prev) => prev.map((u) => (u.id === id ? { ...u, ativo: true } : u)))
  }

  const obterUsuario = (id: string) => {
    return usuarios.find((u) => u.id === id)
  }

  const isAdmin = () => {
    return usuario?.role === "admin" && usuario?.ativo === true
  }

  const canAccessAdminFeatures = () => {
    return isAdmin()
  }

  return (
    <AuthContext.Provider
      value={{
        usuario,
        usuarios,
        isLoading,
        login,
        logout,
        adicionarUsuario,
        atualizarUsuario,
        excluirUsuario,
        bloquearUsuario,
        desbloquearUsuario,
        obterUsuario,
        isAdmin,
        canAccessAdminFeatures,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider")
  }
  return context
}
