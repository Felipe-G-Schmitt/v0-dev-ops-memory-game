"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RotateCcw, Clock, Target } from "lucide-react"
import MemoryCard from "@/components/memory-card"

type CardType = {
  id: number
  content: string
  type: "term" | "definition"
  pairId: number
  icon: string
  isFlipped: boolean
  isMatched: boolean
}

const devOpsPairs = [
  {
    term: "Planejar",
    definition: "Etapa onde as equipes definem metas, requisitos e tarefas antes de começar o desenvolvimento.",
    icon: "📋",
  },
  {
    term: "Codificar",
    definition: "Fase em que os desenvolvedores escrevem o código-fonte das aplicações.",
    icon: "💻",
  },
  {
    term: "Construir",
    definition: "Processo de compilar o código e gerar versões executáveis do software.",
    icon: "🔨",
  },
  {
    term: "Testar",
    definition: "Verificação automática ou manual para garantir que o sistema funciona conforme esperado.",
    icon: "🧪",
  },
  {
    term: "Entregar",
    definition: "Etapa que prepara o software testado para ser enviado a ambientes de produção.",
    icon: "📦",
  },
  {
    term: "Implantar (Deploy)",
    definition: "Publicação do software em produção, tornando-o disponível para os usuários finais.",
    icon: "🚀",
  },
  {
    term: "Operar",
    definition: "Manutenção do sistema em funcionamento no ambiente de produção.",
    icon: "⚙️",
  },
  {
    term: "Monitorar",
    definition: "Observação contínua do desempenho e da saúde do sistema para detectar falhas e otimizar recursos.",
    icon: "📊",
  },
  {
    term: "Automação",
    definition: "Uso de ferramentas e scripts para executar tarefas repetitivas de forma eficiente.",
    icon: "🤖",
  },
  {
    term: "Feedback Contínuo",
    definition: "Retorno constante sobre o funcionamento do sistema e satisfação do usuário para melhorias futuras.",
    icon: "🔄",
  },
]

function createCards(): CardType[] {
  const cards: CardType[] = []
  devOpsPairs.forEach((pair, index) => {
    cards.push({
      id: index * 2,
      content: pair.term,
      type: "term",
      pairId: index,
      icon: pair.icon,
      isFlipped: false,
      isMatched: false,
    })
    cards.push({
      id: index * 2 + 1,
      content: pair.definition,
      type: "definition",
      pairId: index,
      icon: pair.icon,
      isFlipped: false,
      isMatched: false,
    })
  })
  return cards.sort(() => Math.random() - 0.5)
}

export default function MemoryGame() {
  const [cards, setCards] = useState<CardType[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [attempts, setAttempts] = useState(0)
  const [time, setTime] = useState(0)
  const [isGameActive, setIsGameActive] = useState(false)
  const [isGameComplete, setIsGameComplete] = useState(false)

  useEffect(() => {
    initializeGame()
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isGameActive && !isGameComplete) {
      interval = setInterval(() => {
        setTime((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isGameActive, isGameComplete])

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [firstId, secondId] = flippedCards
      const firstCard = cards.find((c) => c.id === firstId)
      const secondCard = cards.find((c) => c.id === secondId)

      if (firstCard && secondCard && firstCard.pairId === secondCard.pairId) {
        // Match found
        setTimeout(() => {
          setCards((prev) =>
            prev.map((card) => (card.id === firstId || card.id === secondId ? { ...card, isMatched: true } : card)),
          )
          setFlippedCards([])
          checkGameComplete()
        }, 500)
      }
      // Cards stay flipped - no auto flip back
      setAttempts((prev) => prev + 1)
    }
  }, [flippedCards, cards])

  function initializeGame() {
    const newCards = createCards()
    setCards(newCards)
    setFlippedCards([])
    setAttempts(0)
    setTime(0)
    setIsGameActive(false)
    setIsGameComplete(false)
  }

  function handleCardClick(id: number) {
    if (!isGameActive) setIsGameActive(true)

    const card = cards.find((c) => c.id === id)
    if (!card || card.isFlipped || card.isMatched) {
      return
    }

    // If two cards are already flipped and not matched, flip them back
    if (flippedCards.length === 2) {
      const [firstId, secondId] = flippedCards
      const firstCard = cards.find((c) => c.id === firstId)
      const secondCard = cards.find((c) => c.id === secondId)

      // Only flip back if they're not a match
      if (firstCard && secondCard && firstCard.pairId !== secondCard.pairId) {
        setCards((prev) => prev.map((c) => (c.id === firstId || c.id === secondId ? { ...c, isFlipped: false } : c)))
      }
      setFlippedCards([])
    }

    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, isFlipped: true } : c)))
    setFlippedCards((prev) => [...prev, id])
  }

  function checkGameComplete() {
    setTimeout(() => {
      const allMatched = cards.every(
        (card) => card.isMatched || card.id === flippedCards[0] || card.id === flippedCards[1],
      )
      if (allMatched) {
        setIsGameComplete(true)
        setIsGameActive(false)
      }
    }, 600)
  }

  function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-6xl space-y-6 md:space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-balance bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Jogo da Memória DevOps
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto text-pretty">
            Encontre os pares correspondentes de termos e definições do ciclo DevOps
          </p>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Card className="px-6 py-3 bg-card/50 backdrop-blur border-border/50">
            <div className="flex items-center gap-3">
              <Target className="w-5 h-5 text-primary" />
              <div className="text-left">
                <p className="text-xs text-muted-foreground font-medium">Tentativas</p>
                <p className="text-2xl font-bold text-foreground">{attempts}</p>
              </div>
            </div>
          </Card>

          <Card className="px-6 py-3 bg-card/50 backdrop-blur border-border/50">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-secondary" />
              <div className="text-left">
                <p className="text-xs text-muted-foreground font-medium">Tempo</p>
                <p className="text-2xl font-bold font-mono text-foreground">{formatTime(time)}</p>
              </div>
            </div>
          </Card>

          <Button
            onClick={initializeGame}
            variant="outline"
            size="lg"
            className="gap-2 bg-card/50 backdrop-blur border-border/50 hover:bg-accent hover:text-accent-foreground"
          >
            <RotateCcw className="w-4 h-4" />
            Reiniciar
          </Button>
        </div>

        {/* Game Complete Message */}
        {isGameComplete && (
          <Card className="p-6 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 border-primary/50 backdrop-blur">
            <div className="text-center space-y-2">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">🎉 Parabéns! Você completou o jogo!</h2>
              <p className="text-muted-foreground">
                Tentativas: <span className="font-bold text-foreground">{attempts}</span> | Tempo:{" "}
                <span className="font-bold text-foreground font-mono">{formatTime(time)}</span>
              </p>
            </div>
          </Card>
        )}

        {/* Game Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
          {cards.map((card) => (
            <MemoryCard key={card.id} card={card} onClick={() => handleCardClick(card.id)} />
          ))}
        </div>
      </div>
    </div>
  )
}
