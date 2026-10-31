"use client"

import { useState } from "react"
import {
  LayoutDashboard,
  Monitor,
  Briefcase,
  Award,
  BarChart3,
  Lightbulb,
  Heart,
  User,
  LogOut,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "Tableau de bord", icon: LayoutDashboard, active: true },
  { label: "Mes Simulateurs", icon: Monitor, badge: 2 },
  { label: "Mon Portfolio", icon: Briefcase },
  { label: "Badge & Certification", icon: Award },
  { label: "Mes Performances", icon: BarChart3 },
  { label: "Opportunites", icon: Lightbulb, badge: 4 },
  { label: "Programmes RSE", icon: Heart, badge: 3 },
  { label: "Mon Profil", icon: User },
  { label: "Deconnexion", icon: LogOut },
]

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  onNavigate: (view: string) => void
  activeView: string
}

export function Sidebar({ isOpen, onClose, onNavigate, activeView }: SidebarProps) {
  const viewMap: Record<string, string> = {
    "Tableau de bord": "dashboard",
    "Mes Simulateurs": "simulators",
    "Mon Portfolio": "portfolio",
    "Badge & Certification": "certifications",
    "Mes Performances": "performances",
    "Opportunites": "opportunities",
  }

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/30 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 z-50 flex h-full w-64 flex-col border-r border-sidebar-border bg-sidebar transition-transform duration-300 lg:static lg:z-auto lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary">
              <span className="text-lg font-bold text-primary-foreground">S</span>
            </div>
            <span className="text-lg font-bold text-sidebar-foreground">StudieSkills</span>
          </div>
          <button
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted lg:hidden"
            aria-label="Fermer le menu"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Navigations
          </p>
          <ul className="flex flex-col gap-1">
            {navItems.map((item) => {
              const viewKey = viewMap[item.label] || item.label.toLowerCase()
              const isActive = activeView === viewKey
              return (
                <li key={item.label}>
                  <button
                    onClick={() => {
                      onNavigate(viewKey)
                      onClose()
                    }}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                  >
                    <item.icon className="size-5 shrink-0" />
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <span
                        className={cn(
                          "flex size-5 items-center justify-center rounded-full text-xs font-bold",
                          isActive
                            ? "bg-primary-foreground text-primary"
                            : "bg-destructive text-destructive-foreground"
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>
      </aside>
    </>
  )
}
