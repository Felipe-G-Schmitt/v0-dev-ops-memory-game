"use client"

import { Card } from "@/components/ui/card"
import { Settings } from "lucide-react"

type CardType = {
  id: number
  content: string
  type: "term" | "definition"
  pairId: number
  icon: string
  isFlipped: boolean
  isMatched: boolean
}

type MemoryCardProps = {
  card: CardType
  onClick: () => void
}

export default function MemoryCard({ card, onClick }: MemoryCardProps) {
  return (
    <div className="relative aspect-[3/4] cursor-pointer perspective-1000" onClick={onClick}>
      <div
        className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${
          card.isFlipped || card.isMatched ? "rotate-y-180" : ""
        }`}
      >
        {/* Card Back */}
        <Card
          className={`absolute inset-0 backface-hidden flex items-center justify-center bg-gradient-to-br from-card via-card to-muted border-2 ${
            card.isMatched ? "border-primary/50" : "border-border hover:border-primary/50"
          } transition-colors`}
        >
          <div className="flex flex-col items-center justify-center gap-3 p-4">
            <Settings className="w-8 h-8 md:w-10 md:h-10 text-primary animate-spin-slow" />
            <div className="text-xs font-mono text-muted-foreground">DevOps</div>
          </div>
        </Card>

        {/* Card Front */}
        <Card
          className={`absolute inset-0 backface-hidden rotate-y-180 flex flex-col items-center justify-center p-3 md:p-4 ${
            card.isMatched
              ? "bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 border-2 border-primary"
              : "bg-gradient-to-br from-card via-muted to-card border-2 border-border"
          } transition-all`}
        >
          <div className="flex flex-col items-center justify-center gap-2 md:gap-3 text-center h-full">
            <div className="text-3xl md:text-4xl">{card.icon}</div>
            <p
              className={`text-sm md:text-base lg:text-lg leading-relaxed ${
                card.type === "term" ? "font-bold text-foreground" : "font-medium text-foreground/90"
              }`}
            >
              {card.content}
            </p>
          </div>
        </Card>
      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  )
}
