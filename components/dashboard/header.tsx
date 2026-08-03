"use client"

import { ArrowLeft, Bell, Menu } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface HeaderProps {
  onMenuToggle: () => void
  title?: string
  showBack?: boolean
  onBack?: () => void
}

export function Header({ onMenuToggle, title = "Tableau de bord", showBack, onBack }: HeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-border bg-card px-4 py-3 md:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="flex size-9 items-center justify-center rounded-md text-muted-foreground hover:bg-muted lg:hidden"
          aria-label="Ouvrir le menu"
        >
          <Menu className="size-5" />
        </button>
        {showBack && (
          <button
            onClick={onBack}
            className="flex size-9 items-center justify-center rounded-md text-muted-foreground hover:bg-muted"
            aria-label="Retour"
          >
            <ArrowLeft className="size-5" />
          </button>
        )}
        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      </div>
      <div className="flex items-center gap-4">
        <button
          className="relative flex size-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
          aria-label="Notifications"
        >
          <Bell className="size-5" />
          <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-destructive" />
        </button>
        <div className="flex items-center gap-2.5">
          <Avatar className="size-9">
            <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
              AN
            </AvatarFallback>
          </Avatar>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-foreground leading-tight">Anderson</p>
            <p className="text-xs text-muted-foreground leading-tight">Apprenant</p>
          </div>
        </div>
      </div>
    </header>
  )
}
