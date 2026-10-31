"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ProgressionCard() {
  const [mounted, setMounted] = useState(false)
  const percentage = 90
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <Card className="gap-0">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Progression Generale</CardTitle>
        <p className="text-xs text-muted-foreground">
          {"Note actuelle: 14/20 - Mention: Bien"}
        </p>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center py-4">
        <div className="relative size-36">
          <svg className="size-full -rotate-90" viewBox="0 0 120 120" aria-hidden="true">
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="10"
              className="text-muted/80"
            />
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={mounted ? offset : circumference}
              className="transition-all duration-1000 ease-out"
              style={{ stroke: "#e74c3c" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-card-foreground">{percentage}%</span>
          </div>
        </div>
        <p className="mt-3 text-center text-sm text-muted-foreground">
          <span className="font-semibold text-card-foreground">{"3 simulations"}</span>
          {" sur 5 en cours"}
        </p>
      </CardContent>
    </Card>
  )
}
