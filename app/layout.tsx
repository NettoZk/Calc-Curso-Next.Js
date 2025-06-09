import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { CursosProvider } from "@/contexts/cursos-context"
import { AuthProvider } from "@/contexts/auth-context"
import Navbar from "@/components/navbar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Calculadora de Mensalidades",
  description: "Sistema de cálculo de mensalidades para cursos superiores",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AuthProvider>
          <CursosProvider>
            <Navbar />
            <main className="pt-16">{children}</main>
          </CursosProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
