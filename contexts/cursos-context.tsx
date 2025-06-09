"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type Regime = "seriado" | "aberto"

export interface Curso {
  id: string
  nome: string
  valorCredito: number
}

interface CursosContextType {
  cursos: Record<Regime, Curso[]>
  adicionarCurso: (regime: Regime, curso: Omit<Curso, "id">) => void
  atualizarCurso: (regime: Regime, id: string, curso: Omit<Curso, "id">) => void
  excluirCurso: (regime: Regime, id: string) => void
  obterCurso: (regime: Regime, id: string) => Curso | undefined
}

const CursosContext = createContext<CursosContextType | undefined>(undefined)

const cursosIniciais: Record<Regime, Curso[]> = {
  seriado: [
    { id: "1", nome: "ADMINISTRAÇÃO", valorCredito: 40.74 },
    { id: "2", nome: "AGRONOMIA", valorCredito: 60.08 },
    { id: "3", nome: "ARQUITETURA E URBANISMO", valorCredito: 74.42 },
    { id: "4", nome: "BIOMEDICINA", valorCredito: 69.71 },
    { id: "5", nome: "CIÊNCIA DA COMPUTAÇÃO", valorCredito: 50.5 },
    { id: "6", nome: "CIÊNCIAS CONTÁBEIS", valorCredito: 40.76 },
    { id: "7", nome: "DIREITO", valorCredito: 68.97 },
    { id: "8", nome: "ENFERMAGEM", valorCredito: 69.63 },
    { id: "9", nome: "ENGENHARIA CIVIL", valorCredito: 75.4 },
    { id: "10", nome: "MEDICINA", valorCredito: 340.9 },
  ],
  aberto: [
    { id: "1", nome: "COMPLEMENTAÇÃO PSICOLOGIA", valorCredito: 43.49 },
    { id: "2", nome: "CURSO SUPERIOR DE TECNOLOGIA EM ESTETICA E COSMETICA", valorCredito: 41.88 },
    { id: "3", nome: "EDUCACAO FISICA - BACHARELADO", valorCredito: 42.38 },
    { id: "4", nome: "EDUCACAO FISICA - LICENCIATURA", valorCredito: 40.91 },
    { id: "5", nome: "ENGENHARIA DE MINAS", valorCredito: 83.44 },
    { id: "6", nome: "ENGENHARIA DE SOFTWARE", valorCredito: 50.5 },
    { id: "7", nome: "FARMÁCIA", valorCredito: 69.71 },
    { id: "8", nome: "FISIOTERAPIA", valorCredito: 69.71 },
    { id: "9", nome: "JOGOS DIGITAIS", valorCredito: 50.5 },
    { id: "10", nome: "SISTEMAS DE INFORMAÇÃO", valorCredito: 52.17 },
  ],
}

export function CursosProvider({ children }: { children: ReactNode }) {
  const [cursos, setCursos] = useState<Record<Regime, Curso[]>>(cursosIniciais)

  // Carregar dados do localStorage
  useEffect(() => {
    const cursosStorage = localStorage.getItem("cursos")

    if (cursosStorage) {
      setCursos(JSON.parse(cursosStorage))
    }
  }, [])

  // Salvar no localStorage sempre que houver mudanças
  useEffect(() => {
    localStorage.setItem("cursos", JSON.stringify(cursos))
  }, [cursos])

  const adicionarCurso = (regime: Regime, novoCurso: Omit<Curso, "id">) => {
    const id = Date.now().toString()
    setCursos((prev) => ({
      ...prev,
      [regime]: [...prev[regime], { ...novoCurso, id }],
    }))
  }

  const atualizarCurso = (regime: Regime, id: string, cursoAtualizado: Omit<Curso, "id">) => {
    setCursos((prev) => ({
      ...prev,
      [regime]: prev[regime].map((curso) => (curso.id === id ? { ...cursoAtualizado, id } : curso)),
    }))
  }

  const excluirCurso = (regime: Regime, id: string) => {
    setCursos((prev) => ({
      ...prev,
      [regime]: prev[regime].filter((curso) => curso.id !== id),
    }))
  }

  const obterCurso = (regime: Regime, id: string) => {
    return cursos[regime].find((curso) => curso.id === id)
  }

  return (
    <CursosContext.Provider
      value={{
        cursos,
        adicionarCurso,
        atualizarCurso,
        excluirCurso,
        obterCurso,
      }}
    >
      {children}
    </CursosContext.Provider>
  )
}

export function useCursos() {
  const context = useContext(CursosContext)
  if (context === undefined) {
    throw new Error("useCursos deve ser usado dentro de um CursosProvider")
  }
  return context
}
