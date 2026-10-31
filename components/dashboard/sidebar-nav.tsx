"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Monitor,
  FolderOpen,
  Award,
  BarChart3,
  Briefcase,
  User,
  X,
  GraduationCap,
} from "lucide-react"

const navItems = [
  { icon: LayoutDashboard, label: "Tableau de bord", href: "/simulateurs" },
  { icon: Monitor, label: "Mes Simulateurs", href: "/simulateurs" },
  { icon: FolderOpen, label: "Mon Portfolio", href: "/portfolio" },
  { icon: Award, label: "Badge & Certification", href: "/certifications" },
  { icon: BarChart3, label: "Mes Performances", href: "/performances" },
  { icon: Briefcase, label: "Opportunités", href: "/opportunities" },
]

const bottomItems = [
  { icon: User, label: "Mon Profil", href: "/portfolio" },
]

interface SidebarNavProps {
  open: boolean
  onClose: () => void
}

export function SidebarNav({ open, onClose }: SidebarNavProps) {
  const pathname = usePathname()

  function isActive(href: string) {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-sidebar text-sidebar-foreground transition-transform duration-300 lg:static lg:z-auto lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-2.5 border-b border-sidebar-border px-5">
          <div className="flex size-9 items-center justify-center rounded-lg bg-sidebar-primary">
            <GraduationCap className="size-5 text-sidebar-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-sidebar-foreground">StudieSkills</span>
          <button
            onClick={onClose}
            className="ml-auto rounded-md p-1 text-sidebar-foreground/70 hover:text-sidebar-foreground lg:hidden"
            aria-label="Fermer le menu"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Label */}
        <div className="px-5 pt-5 pb-2">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/50">Navigation</p>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 px-3" aria-label="Navigation principale">
          <ul className="flex flex-col gap-0.5" role="list">
            {navItems.map((item) => {
              const active = isActive(item.href)
              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      active
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    <item.icon className="size-[18px] shrink-0" />
                    <span className="flex-1">{item.label}</span>

                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Bottom items */}
        <div className="border-t border-sidebar-border px-3 py-3">
          <ul className="flex flex-col gap-0.5" role="list">
            {bottomItems.map((item) => {
              const active = isActive(item.href)
              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      active
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                    )}
                  >
                    <item.icon className="size-[18px] shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </aside>
    </>
  )
}
