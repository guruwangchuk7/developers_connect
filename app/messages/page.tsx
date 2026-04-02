"use client"

import * as React from "react"
import { GlobalHeader } from "@/components/common/global-header"
import { 
  LayoutGrid, 
  Search, 
  Users, 
  Trophy, 
  MessageSquare, 
  Settings,
  Send,
  X
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter, usePathname } from "next/navigation"

export default function MessagesPage() {
   const router = useRouter()
   const pathname = usePathname()
   const activeTab = "messages"

   return (
      <div className="min-h-[100dvh] bg-background text-foreground flex flex-col font-outfit selection:bg-primary/20 overflow-y-scroll">
         <GlobalHeader />

         <main className="flex-1 flex justify-center w-full">
            <div className="w-full max-w-[1440px] px-4 md:px-6 py-6 md:py-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 pb-24 lg:pb-0">
               
               {/* Sidebar */}
               <div className="hidden lg:block lg:col-span-3 space-y-10">
                  <div className="space-y-10">
                     <div className="space-y-4">
                        <h4 className="text-[14px] font-normal text-primary/40 pl-0">Network</h4>
                        <nav className="flex flex-col gap-1">
                           <button onClick={() => router.push('/dashboard?tab=all')} className={cn("flex items-center gap-3 pl-0 transition-all text-[14px] font-normal text-muted-foreground/60 hover:text-foreground")}>
                              <LayoutGrid className="h-4 w-4" />
                              Feed
                           </button>
                           <button onClick={() => router.push('/dashboard?tab=discover')} className={cn("flex items-center gap-3 pl-0 transition-all text-[14px] font-normal text-muted-foreground/60 hover:text-foreground")}>
                              <Search className="h-4 w-4" />
                              Developers
                           </button>
                           <button onClick={() => router.push('/dashboard?tab=teams')} className={cn("flex items-center gap-3 pl-0 transition-all text-[14px] font-normal text-muted-foreground/60 hover:text-foreground")}>
                              <Users className="h-4 w-4" />
                              Teams
                           </button>
                           <button onClick={() => router.push('/dashboard?tab=leaderboard')} className={cn("flex items-center gap-3 pl-0 transition-all text-[14px] font-normal text-muted-foreground/60 hover:text-foreground")}>
                              <Trophy className="h-4 w-4" />
                              Leaderboard
                           </button>
                        </nav>
                     </div>

                     <div className="space-y-4">
                        <h4 className="text-[14px] font-normal text-primary/40 pl-0">Workspace</h4>
                        <nav className="flex flex-col gap-1">
                           <button onClick={() => router.push('/messages')} className={cn("flex items-center gap-3 pl-0 transition-all text-[14px] font-normal", activeTab === "messages" ? "text-primary" : "text-muted-foreground/60 hover:text-foreground")}>
                              <MessageSquare className="h-4 w-4" />
                              Messages
                           </button>
                           <button onClick={() => router.push('/identity')} className="flex items-center gap-3 pl-0 transition-all text-[14px] font-normal text-muted-foreground/60 hover:text-foreground">
                              <Settings className="h-4 w-4" />
                              Settings
                           </button>
                        </nav>
                     </div>
                  </div>
               </div>

               {/* Messages Content */}
               <div className="lg:col-span-9 space-y-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border/10 pb-6 min-h-[90px] md:min-h-[80px]">
                     <div className="flex flex-col justify-center space-y-1 text-left">
                        <h1 className="text-[26px] md:text-[36px] font-medium tracking-tighter leading-none">
                           Synchronized <span className="text-primary">Chat</span>
                        </h1>
                        <div className="h-[20px]">
                           <p className="text-[14px] font-medium text-muted-foreground/50">Direct technical synchronization with peers</p>
                        </div>
                     </div>
                  </div>

                  <div className="bg-background border border-border/40 rounded-sm shadow-xl shadow-black/[0.02] flex flex-col h-[600px] overflow-hidden">
                     <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-6">
                        <div className="h-20 w-20 md:h-24 md:w-24 rounded-sm bg-secondary/40 border border-border/20 flex items-center justify-center animate-pulse">
                           <MessageSquare className="h-8 w-8 md:h-10 md:w-10 text-muted-foreground/20" />
                        </div>
                        <div className="space-y-2">
                           <h4 className="text-[15px] font-bold text-foreground/60">Initialize Conversation</h4>
                           <p className="text-[12px] font-medium text-muted-foreground/30 max-w-[240px] leading-relaxed mx-auto">Select a peer from the directory to start a technical synchronization.</p>
                        </div>
                     </div>

                     <div className="p-6 md:p-8 border-t border-border/20 bg-secondary/10 mt-auto">
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
               </div>
            </div>
         </main>
      </div>
   )
}
