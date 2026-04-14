"use client"

import * as React from "react"
import { Search } from "lucide-react"

interface DashboardHeaderProps {
  title: React.ReactNode
  subtitle: string | null
  activeTab: string
  discoverSearch: string
  setDiscoverSearch: (val: string) => void
}

export function DashboardHeader({
  title,
  subtitle,
  activeTab,
  discoverSearch,
  setDiscoverSearch
}: DashboardHeaderProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border/10 pt-2 pb-4">
        <div className="flex flex-col justify-center space-y-1 text-left">
          <h1 className="text-[26px] md:text-[34px] font-medium tracking-tighter leading-none">
            {title}
          </h1>
          <div className="h-[20px]">
            {subtitle && (
              <p className="text-[14px] font-medium text-muted-foreground/50 animate-in fade-in duration-300">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 min-w-0 md:min-w-[256px] justify-end">
          {["discover", "teams", "projects"].includes(activeTab) && (
            <div className="relative w-full md:w-auto animate-in fade-in slide-in-from-right-2 duration-300">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/30" />
              <input
                type="text"
                placeholder={
                  activeTab === "teams"
                    ? "Search teams..."
                    : activeTab === "projects"
                    ? "Search projects..."
                    : "Search by skill or name..."
                }
                className="pl-10 pr-4 py-2 bg-secondary/20 border border-border/10 rounded-sm text-[13px] focus:outline-none focus:border-primary/40 w-full md:w-64"
                value={discoverSearch}
                onChange={(e) => setDiscoverSearch(e.target.value)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
