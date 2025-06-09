"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, Calculator, Settings, Menu, X, Users, LogOut } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { cn } from "@/lib/utils"

export default function Navbar() {
  const { usuario, logout, canAccessAdminFeatures } = useAuth()
  const [menuAberto, setMenuAberto] = useState(false)
  const pathname = usePathname()

  // Se estiver na página de login, não mostrar a navbar
  if (pathname === "/login") return null

  const navItems = [{ href: "/", label: "Calculadora", icon: Calculator }]

  // Adicionar itens de menu apenas para administradores
  if (canAccessAdminFeatures()) {
    navItems.push(
      { href: "/gerenciar-cursos", label: "Gerenciar Cursos", icon: Settings },
      { href: "/gerenciar-usuarios", label: "Gerenciar Usuários", icon: Users },
    )
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <GraduationCap className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">Calculadora</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    pathname === item.href
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>

          {/* User Info */}
          <div className="hidden md:flex items-center space-x-4">
            {usuario && (
              <div className="flex items-center space-x-4">
                <div className="text-sm flex items-center gap-2">
                  <span className="text-gray-500">Olá, </span>
                  <span className="font-medium text-gray-900">{usuario.nome}</span>
                  {usuario.role === "admin" && (
                    <Badge variant="secondary" className="text-xs">
                      Admin
                    </Badge>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="flex items-center space-x-1 text-gray-600 hover:text-gray-900"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sair</span>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setMenuAberto(!menuAberto)}>
              {menuAberto ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {menuAberto && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium",
                      pathname === item.href
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
                    )}
                    onClick={() => setMenuAberto(false)}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}

              {usuario && (
                <div className="px-3 py-2 border-t border-gray-200 mt-2">
                  <div className="mb-2 text-sm flex items-center gap-2">
                    <span className="text-gray-500">Logado como </span>
                    <span className="font-medium text-gray-900">{usuario.nome}</span>
                    {usuario.role === "admin" && (
                      <Badge variant="secondary" className="text-xs">
                        Admin
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={logout}
                    className="flex items-center space-x-1 w-full justify-center"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sair</span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
