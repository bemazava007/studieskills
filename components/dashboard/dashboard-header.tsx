"use client"

import { Menu, Bell, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"

interface DashboardHeaderProps {
  onMenuClick: () => void
  title: string
}

export function DashboardHeader({ onMenuClick, title }: DashboardHeaderProps) {
  const router = useRouter()
  const { profile, signOut } = useAuth()

  const initials = (profile?.full_name || "?")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  const firstName = profile?.full_name?.split(" ")[0] || "Apprenant"

  async function handleSignOut() {
    await signOut()
    router.push("/login")
  }

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
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold leading-tight text-card-foreground">{firstName}</p>
            <p className="text-xs leading-tight text-muted-foreground">
              {profile?.role === "recruiter" ? "Recruteur" : profile?.role === "admin" ? "Admin" : "Apprenant"}
            </p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="shrink-0"
          onClick={handleSignOut}
          aria-label="Déconnexion"
        >
          <LogOut className="size-5" />
        </Button>
      </div>
    </header>
  )
}
