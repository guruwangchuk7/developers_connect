"use client"

import * as React from "react"
import { createClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { GlobalHeader } from "@/components/common/global-header"
import { cn } from "@/lib/utils"
import {
   MessageSquare, Users, UserPlus, Plus, Flame, Sparkles,
   ArrowRight, ShieldCheck, TrendingUp, Trophy, Bookmark,
   Send, MessageCircle, LinkIcon, Check, Fingerprint, X,
   ChevronRight, Heart, Bell, LayoutGrid, Search, User,
   Settings, LogOut, ChevronDown, ExternalLink
} from "lucide-react"

export default function DashboardPage() {
   const supabase = createClient()
   const router = useRouter()
   const [user, setUser] = React.useState<any>(null)
   const [profile, setProfile] = React.useState<any>(null)
   const [isLoading, setIsLoading] = React.useState(true)
   const [activeTab, setActiveTab] = React.useState("all")
   const [isMessagesOpen, setIsMessagesOpen] = React.useState(false)
   const [isProfileMenuOpen, setIsProfileMenuOpen] = React.useState(false)

   const refreshData = async (userId: string) => {
      const { data } = await supabase
         .from('profiles')
         .select('*')
         .eq('id', userId)
         .single()
      if (data) {
         setProfile(data)
      }
   }

   React.useEffect(() => {
      async function getSession() {
         const { data: { session } } = await supabase.auth.getSession()
         if (!session) {
            router.push('/join')
            return
         }
         setUser(session.user)
         await refreshData(session.user.id)
         setIsLoading(false)
      }
      getSession()
   }, [supabase, router])

   const handleSignOut = async () => {
      await supabase.auth.signOut()
      router.push('/')
   }

   if (isLoading || !user) return null

   // Feed Data (Same as previous)
   const feedPosts = [
      {
         id: 1,
         type: "HELP",
         user: "Pema Dorji",
         role: "Backend Engineer",
         content: "Integrating Supabase auth in Next.js 14 with Turbopack. Middleware session refresh issue?",
         tags: ["Supabase", "NextJS"],
         timestamp: "2h ago",
         likes: 45,
         comments: 12
      },
      {
         id: 2,
         type: "TEAM",
         user: "Sonam Yangzom",
         role: "Founder",
         content: "Looking for 2 teammates (Fullstack + UI/UX) for the upcoming Bhutan Innovation Hub Hackathon.",
         tags: ["React", "Web3"],
         timestamp: "4h ago",
         likes: 23,
         comments: 8
      }
   ]

   return (
      <div className="min-h-screen bg-[#fafafa] flex flex-col font-inter selection:bg-primary selection:text-background">
         {/* 
         REFINED CONTEXTUAL HEADER 
         Optimized avatar size + functional profile navigator.
      */}
         <GlobalHeader>
            <div className="flex items-center gap-6">
               <div className="h-4 w-px bg-border/40 hidden md:block" />
               <nav className="hidden md:flex items-center gap-8">
                  <button onClick={() => setActiveTab("all")} className={cn("text-[11px] font-bold uppercase tracking-[0.2em] transition-colors", activeTab === "all" ? "text-primary" : "text-muted-foreground/50 hover:text-foreground")}>Stream</button>
                  <button onClick={() => setActiveTab("teams")} className={cn("text-[11px] font-bold uppercase tracking-[0.2em] transition-colors", activeTab === "teams" ? "text-primary" : "text-muted-foreground/50 hover:text-foreground")}>Teams</button>
                  <button onClick={() => setActiveTab("projects")} className={cn("text-[11px] font-bold uppercase tracking-[0.2em] transition-colors", activeTab === "projects" ? "text-primary" : "text-muted-foreground/50 hover:text-foreground")}>Projects</button>
               </nav>
               <div className="h-4 w-px bg-border/40" />

               <div className="flex items-center gap-1 md:gap-4">
                  <button
                     onClick={() => setIsMessagesOpen(!isMessagesOpen)}
                     className="p-2 text-muted-foreground/50 hover:text-primary transition-colors hidden sm:block"
                  >
                     <MessageCircle className="h-5 w-5" />
                  </button>

                  {/* 
                  MINIMALIST PROFILE TRIGGER 
                  De-bulked: Circle-only interaction without pill borders.
               */}
                  <div className="relative">
                     <button
                        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                        className="flex items-center justify-center h-9 w-9 rounded-full bg-secondary border border-border/20 overflow-hidden text-[13px] font-black uppercase tracking-tighter transition-all hover:border-primary/40 active:scale-95 shadow-sm"
                     >
                        {profile?.avatar_url ? <img src={profile.avatar_url} className="h-full w-full object-cover" /> : profile?.full_name?.[0]}
                     </button>

                     {/* Profile Dropdown Menu */}
                     {isProfileMenuOpen && (
                        <div className="absolute top-14 right-0 w-64 bg-background border border-border/60 rounded-sm shadow-2xl z-[60] animate-in fade-in zoom-in-95 duration-200">
                           <div className="p-4 border-b border-border/40">
                              <p className="text-[11px] font-bold uppercase tracking-widest text-foreground">{profile?.full_name}</p>
                              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50 mt-1">{profile?.role}</p>
                           </div>
                           <div className="p-2 space-y-1">
                              <button onClick={() => router.push(`/profile/${profile?.id}`)} className="w-full text-left px-3 py-2 text-[11px] font-bold uppercase tracking-widest hover:bg-secondary flex items-center gap-3 transition-all rounded-sm">
                                 <User className="h-3.5 w-3.5 opacity-40" /> Public Profile
                              </button>
                              <button onClick={() => router.push('/identity')} className="w-full text-left px-3 py-2 text-[11px] font-bold uppercase tracking-widest hover:bg-secondary flex items-center gap-3 transition-all rounded-sm">
                                 <Settings className="h-3.5 w-3.5 opacity-40" /> Edit Identity
                              </button>
                              <div className="h-px bg-border/40 my-2" />
                              <button onClick={handleSignOut} className="w-full text-left px-3 py-2 text-[11px] font-bold uppercase tracking-widest text-red-600/80 hover:bg-red-50 flex items-center gap-3 transition-all rounded-sm">
                                 <LogOut className="h-3.5 w-3.5 opacity-40" /> Exit Terminal
                              </button>
                           </div>
                        </div>
                     )}
                  </div>
               </div>
            </div>
         </GlobalHeader>

         <main className="flex-1 flex justify-center">
            <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-12 px-6 py-12">

               {/* LEFT COLUMN: NAVIGATION */}
               <div className="lg:col-span-2 hidden lg:flex flex-col gap-8 sticky top-24 h-fit">
                  <div className="space-y-6">
                     <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">Nexus</h3>
                     <div className="flex flex-col gap-3 text-[11px] font-bold uppercase tracking-widest">
                        <button className="flex items-center gap-3 text-primary"><TrendingUp className="h-4 w-4" /> Global Feed</button>
                        <button className="flex items-center gap-3 text-muted-foreground/50 hover:text-foreground transition-all"><Search className="h-4 w-4" /> Discover</button>
                        <button className="flex items-center gap-3 text-muted-foreground/50 hover:text-foreground transition-all"><Users className="h-4 w-4" /> Teammates</button>
                        <button className="flex items-center gap-3 text-muted-foreground/50 hover:text-foreground transition-all"><Trophy className="h-4 w-4" /> Ranks</button>
                     </div>
                  </div>

                  <div className="pt-8 border-t border-border/40 space-y-4">
                     <button
                        onClick={() => router.push('/identity')}
                        className="w-full h-10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest rounded-sm hover:bg-primary hover:text-background transition-all"
                     >
                        Identity Sync
                     </button>
                  </div>
               </div>

               {/* CENTER COLUMN: THE STREAM */}
               <div className="lg:col-span-7 space-y-10">
                  {/* Quick Post Action */}
                  <div className="p-6 bg-background border border-border/60 rounded-sm shadow-sm flex items-center gap-4 group">
                     <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-[10px] font-black border border-border/20 shrink-0 uppercase">
                        {profile?.full_name?.[0]}
                     </div>
                     <button className="flex-1 text-left px-5 h-10 text-[11px] font-bold uppercase tracking-widest text-muted-foreground/40 bg-secondary/30 rounded-full hover:bg-secondary/60 transition-all border border-transparent group-hover:border-border/40">
                        Post a technical request...
                     </button>
                     <button className="p-2.5 bg-primary text-background rounded-full shadow-lg shadow-primary/10 hover:opacity-90 transition-all active:scale-95">
                        <Plus className="h-4 w-4" />
                     </button>
                  </div>

                  {/* Feed Content */}
                  <div className="space-y-8">
                     {feedPosts.map((post) => (
                        <article key={post.id} className="p-8 bg-background border border-border/40 rounded-sm hover:shadow-xl hover:shadow-black/[0.02] transition-all group">
                           <div className="flex items-start justify-between mb-8">
                              <div className="flex items-center gap-4 text-left">
                                 <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-[10px] font-black border border-border/20 uppercase">
                                    {post.user[0]}
                                 </div>
                                 <div>
                                    <h4 className="text-[13px] font-bold tracking-tight text-foreground">{post.user}</h4>
                                    <div className="flex items-center gap-2 mt-0.5">
                                       <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/50">{post.role}</span>
                                       <div className="h-1 w-1 rounded-full bg-border" />
                                       <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/30">{post.timestamp}</span>
                                    </div>
                                 </div>
                              </div>
                              <div className={cn(
                                 "px-2.5 py-1 rounded-sm text-[9px] font-black uppercase tracking-widest",
                                 post.type === 'HELP' ? "bg-amber-500/10 text-amber-600" : "bg-emerald-500/10 text-emerald-600"
                              )}>
                                 {post.type}
                              </div>
                           </div>

                           <div className="space-y-6 text-left">
                              <p className="text-[14px] leading-relaxed font-medium text-foreground/80 selection:bg-primary selection:text-background font-inter">
                                 {post.content}
                              </p>
                              <div className="flex gap-2.5">
                                 {post.tags.map(tag => (
                                    <span key={tag} className="text-[10px] font-bold text-muted-foreground/60 px-2 py-0.5 bg-secondary/40 rounded-sm">#{tag}</span>
                                 ))}
                              </div>
                           </div>

                           <div className="mt-8 pt-6 border-t border-border/20 flex items-center justify-between">
                              <div className="flex items-center gap-6">
                                 <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40 hover:text-primary transition-all">
                                    <Heart className="h-3.5 w-3.5" /> {post.likes}
                                 </button>
                                 <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40 hover:text-primary transition-all">
                                    <MessageCircle className="h-3.5 w-3.5" /> {post.comments}
                                 </button>
                              </div>
                              <button className="p-2 text-muted-foreground/30 hover:text-primary transition-all">
                                 <Bookmark className="h-4 w-4" />
                              </button>
                           </div>
                        </article>
                     ))}
                  </div>
               </div>

               {/* RIGHT COLUMN: ECOSYSTEM */}
               <div className="lg:col-span-3 hidden lg:flex flex-col gap-10">
                  <div className="p-8 border border-border/40 rounded-sm bg-background space-y-8 shadow-sm">
                     <div className="flex items-center justify-between">
                        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Ecosystem</h3>
                        <Sparkles className="h-3 w-3 text-primary opacity-30" />
                     </div>

                     <div className="space-y-6">
                        <div className="space-y-4">
                           <h4 className="text-[11px] font-bold uppercase tracking-widest text-foreground/60 underline decoration-primary/30 decoration-2 underline-offset-4">Top Connects</h4>
                           {[
                              "Tandin Wangchuck",
                              "Yeshi Lhamo",
                              "Karma Tashi"
                           ].map(dev => (
                              <div key={dev} className="flex items-center justify-between group cursor-pointer">
                                 <span className="text-[11px] font-bold group-hover:text-primary transition-colors">{dev}</span>
                                 <UserPlus className="h-3 w-3 text-muted-foreground/30 group-hover:text-primary transition-all" />
                              </div>
                           ))}
                        </div>

                        <div className="pt-6 border-t border-border/40 space-y-4">
                           <h4 className="text-[11px] font-bold uppercase tracking-widest text-foreground/60">Trending Project</h4>
                           <div className="p-3 bg-secondary/30 rounded-sm space-y-2 border border-border/40">
                              <h5 className="text-[10px] font-bold uppercase tracking-widest text-primary">OpenMaps API</h5>
                              <p className="text-[9px] font-medium text-muted-foreground/60 leading-relaxed uppercase pr-2">Collaborative Geospatial mapping protocols.</p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

            </div>
         </main>

         {/* SECURE DRAWER (MESSAGES) */}
         {isMessagesOpen && (
            <div className="fixed inset-y-0 right-0 w-full md:w-[400px] bg-background border-l border-border/40 shadow-2xl z-50 animate-in slide-in-from-right duration-300">
               <div className="flex items-center justify-between p-8 border-b border-border/40">
                  <div className="flex items-center gap-3">
                     <MessageSquare className="h-5 w-5 text-primary" />
                     <h3 className="text-xs font-bold uppercase tracking-widest">Secure Messages</h3>
                  </div>
                  <button
                     onClick={() => setIsMessagesOpen(false)}
                     className="p-2 hover:bg-secondary rounded-full"
                  >
                     <X className="h-5 w-5" />
                  </button>
               </div>

               <div className="p-12 text-center py-40 opacity-20">
                  <p className="text-[10px] font-bold uppercase tracking-widest">Searching Streams...</p>
               </div>
            </div>
         )}
      </div>
   )
}
