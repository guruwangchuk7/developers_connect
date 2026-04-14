"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

interface IdentityTabsProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  isFilterOpen: boolean
  setIsFilterOpen: (val: boolean) => void
}

export function IdentityTabs({
  activeTab,
  setActiveTab,
  isFilterOpen,
  setIsFilterOpen
}: IdentityTabsProps) {
  const tabs = ["My details", "Profile", "Password", "Team", "Email"]

  return (
    <>
      <div className="md:hidden w-full relative">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="w-full bg-background border border-border rounded-lg p-3 text-sm font-semibold text-foreground flex items-center justify-between transition-all"
        >
          {activeTab}
          <ChevronDown className="h-4 w-4" />
        </button>

        {isFilterOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-xl shadow-xl z-50 overflow-hidden divide-y divide-border/40">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab)
                  setIsFilterOpen(false)
                }}
                className={cn(
                  "w-full text-left p-4 text-sm font-semibold transition-colors",
                  activeTab === tab ? "bg-primary text-background" : "hover:bg-secondary"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        )}
      </div>

      <nav className="hidden md:flex items-center gap-8 border-b border-border/60 overflow-x-auto pb-px">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "pb-4 text-[14px] font-semibold whitespace-nowrap transition-all border-b-2",
              activeTab === tab ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {tab}
          </button>
        ))}
      </nav>
    </>
  )
}
