"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { LayoutGrid, Search, Users, MessageCircle, HelpCircle } from "lucide-react"

interface DashboardNavigationProps {
  activeTab: string
  setActiveTab: (id: string) => void
}

export function DashboardNavigation({
  activeTab,
  setActiveTab
}: DashboardNavigationProps) {
  const tabs = [
    { id: "all", label: "Feed", icon: LayoutGrid },
    { id: "discover", label: "Devs", icon: Search },
    { id: "teams", label: "Teams", icon: Users },
    { id: "projects", label: "Project", icon: LayoutGrid },
    { id: "help", label: "Help", icon: HelpCircle },
  ]

  return (
    <div className="hidden lg:flex items-center w-full overflow-x-auto lg:overflow-visible scrollbar-hide md:gap-8 border-b border-border/10 md:border-border/20 mt-4 px-1 md:px-0">
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex-1 md:flex-none flex items-center justify-center md:justify-start gap-1.5 md:gap-2.5 px-4 md:px-0 py-4 text-[11px] md:text-[14px] font-bold md:font-medium transition-all whitespace-nowrap relative group uppercase md:normal-case tracking-wider md:tracking-normal",
              isActive ? "text-primary" : "text-muted-foreground/40 md:text-muted-foreground/60 hover:text-foreground"
            )}
          >
            <Icon className={cn("h-3.5 w-3.5 md:h-4 md:w-4", isActive ? "opacity-100" : "opacity-60")} />
            {tab.label}
            {isActive && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
            )}
            {!isActive && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-transparent group-hover:bg-primary/20 transition-all md:block hidden" />
            )}
          </button>
        )
      })}
    </div>
  )
}
