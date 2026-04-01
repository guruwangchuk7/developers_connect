"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { MessageSquare, X, Send } from "lucide-react"

interface MessagesOverlayProps {
  isOpen: boolean
  setIsOpen: (val: boolean) => void
}

export function MessagesOverlay({
  isOpen,
  setIsOpen
}: MessagesOverlayProps) {
  return (
    <div className={cn(
      "fixed inset-y-0 right-0 w-full md:w-[450px] bg-background border-l border-border/40 shadow-2xl z-[100] transform transition-transform duration-500 ease-in-out flex flex-col",
      isOpen ? "translate-x-0" : "translate-x-full"
    )}>
      <div className="p-6 md:p-8 border-b border-border/20 flex items-center justify-between bg-primary/5">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 md:h-12 md:w-12 rounded-sm bg-primary flex items-center justify-center text-background">
            <MessageSquare className="h-5 w-5 md:h-6 md:w-6" />
          </div>
          <div>
            <h3 className="text-[16px] md:text-[18px] font-bold text-foreground">Synchronized Comms</h3>
            <p className="text-[11px] md:text-[12px] font-medium text-muted-foreground/50 uppercase tracking-widest">Active Channels</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="p-2 md:p-3 hover:bg-secondary rounded-sm transition-colors group"
        >
          <X className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground/40 group-hover:text-foreground" />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-6">
        <div className="h-20 w-20 md:h-24 md:w-24 rounded-sm bg-secondary/40 border border-border/20 flex items-center justify-center animate-pulse">
          <MessageSquare className="h-8 w-8 md:h-10 md:w-10 text-muted-foreground/20" />
        </div>
        <div className="space-y-2">
          <h4 className="text-[15px] font-bold text-foreground/60">Initialize Conversation</h4>
          <p className="text-[12px] font-medium text-muted-foreground/30 max-w-[240px] leading-relaxed">Select a peer from the directory to start a technical synchronization.</p>
        </div>
      </div>

      <div className="p-6 md:p-8 border-t border-border/20 bg-secondary/10">
        <div className="flex items-center gap-4 bg-background border border-border/40 p-1.5 md:p-2 rounded-sm focus-within:border-primary/40 transition-all">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 bg-transparent border-none outline-none px-3 md:px-4 text-[13px] md:text-[14px] font-medium"
            disabled
          />
          <button className="h-10 w-10 md:h-12 md:w-12 bg-primary text-background rounded-sm flex items-center justify-center opacity-30 cursor-not-allowed">
            <Send className="h-4 w-4 md:h-5 md:w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
