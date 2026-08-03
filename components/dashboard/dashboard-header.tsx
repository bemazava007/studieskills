"use client"

import { Menu, Bell } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

interface DashboardHeaderProps {
  onMenuClick: () => void
  title: string
}

export function DashboardHeader({ onMenuClick, title }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-card px-4 lg:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="shrink-0 lg:hidden"
        onClick={onMenuClick}
        aria-label="Ouvrir le menu"
      >
        <Menu className="size-5" />
      </Button>

      <h1 className="text-lg font-semibold text-card-foreground">{title}</h1>

      <div className="ml-auto flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
          <Bell className="size-5" />
          <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-red-500" />
        </Button>

        <div className="flex items-center gap-2.5">
          <Avatar className="size-9">
            <AvatarFallback className="bg-primary text-sm font-semibold text-primary-foreground">
              AA
            </AvatarFallback>
          </Avatar>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold leading-tight text-card-foreground">Anderson</p>
            <p className="text-xs leading-tight text-muted-foreground">Apprenant</p>
          </div>
        </div>
      </div>
    </header>
  )
}
