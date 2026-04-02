"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { MessageSquare, Users, Settings, User } from "lucide-react"

interface MobileNavPillProps {
  activeTab: string
  setActiveTab: (id: string) => void
  setIsMessagesOpen: (val: boolean) => void
  router: any
}

export function MobileNavPill({
  activeTab,
  setActiveTab,
  setIsMessagesOpen,
  router
}: MobileNavPillProps) {
  return (
    <div className="lg:hidden fixed bottom-1.5 left-0 right-0 px-4 pb-2 z-50 pointer-events-none">
      <div className="max-w-[400px] mx-auto bg-background/80 backdrop-blur-lg border border-border/40 px-6 py-2 rounded-full shadow-2xl flex items-center justify-between pointer-events-auto">
        <button
          onClick={() => setActiveTab("all")}
          className={cn(
            "flex flex-col items-center gap-1 transition-all",
            activeTab === "all" ? "text-primary scale-110" : "text-muted-foreground/40"
          )}
        >
          <User className="h-4.5 w-4.5" />
          <span className="text-[14px] font-medium">Feed</span>
        </button>
        <button
          onClick={() => setActiveTab("leaderboard")}
          className={cn(
            "flex flex-col items-center gap-1 transition-all",
            activeTab === "leaderboard" ? "text-primary scale-110" : "text-muted-foreground/40"
          )}
        >
          <Users className="h-4.5 w-4.5" />
          <span className="text-[14px] font-medium">Network</span>
        </button>
        <button
          onClick={() => setIsMessagesOpen(true)}
          className={cn(
            "flex flex-col items-center gap-1 transition-all",
            "text-muted-foreground/40"
          )}
        >
          <MessageSquare className="h-4.5 w-4.5" />
          <span className="text-[14px] font-medium">Messages</span>
        </button>
        <button
          onClick={() => router.push('/identity')}
          className="flex flex-col items-center gap-1 text-muted-foreground/40"
        >
          <Settings className="h-4.5 w-4.5" />
          <span className="text-[14px] font-medium">Settings</span>
        </button>
      </div>
    </div>
  )
}
