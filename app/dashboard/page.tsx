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
   const [activeTab, setActiveTab] = React.useState<string>("all")
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
         if (!supabase) return; // Exit early if correctly handled warning
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
      <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans selection:bg-primary selection:text-background text-foreground/80">
         <GlobalHeader>
            <div className="flex items-center gap-6">
               <div className="h-4 w-px bg-border/40 hidden md:block" />
               <nav className="hidden md:flex items-center gap-10">
                  <button onClick={() => setActiveTab("all")} className={cn("text-[14px] font-bold transition-all", activeTab === "all" ? "text-primary border-b-2 border-primary pb-px" : "text-muted-foreground/50 hover:text-foreground")}>Stream</button>
                  <button onClick={() => setActiveTab("teams")} className={cn("text-[14px] font-bold transition-all", activeTab === "teams" ? "text-primary border-b-2 border-primary pb-px" : "text-muted-foreground/50 hover:text-foreground")}>Teams</button>
                  <button onClick={() => setActiveTab("projects")} className={cn("text-[14px] font-bold transition-all", activeTab === "projects" ? "text-primary border-b-2 border-primary pb-px" : "text-muted-foreground/50 hover:text-foreground")}>Projects</button>
               </nav>
               <div className="h-4 w-px bg-border/40" />

               <div className="flex items-center gap-2 md:gap-4">
                  <button className="p-2 text-muted-foreground/50 hover:text-primary transition-colors hidden sm:block">
                     <Search className="h-4 w-4" />
                  </button>
                  <button
                     onClick={() => setIsMessagesOpen(!isMessagesOpen)}
                     className="p-2 text-muted-foreground/50 hover:text-primary transition-colors hidden sm:block"
                  >
                     <MessageCircle className="h-4 w-4" />
                  </button>

                  <div className="relative">
                     <button
                        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                        className="flex items-center justify-center h-8 w-8 rounded-full bg-secondary border border-border/20 overflow-hidden text-[11px] font-black uppercase tracking-tighter transition-all hover:border-primary/40 active:scale-95 shadow-sm"
                     >
                        {profile?.avatar_url ? <img src={profile.avatar_url} className="h-full w-full object-cover" /> : profile?.full_name?.[0]}
                     </button>

                     {isProfileMenuOpen && (
                        <div className="absolute top-12 right-0 w-64 bg-background border border-border/60 rounded-sm shadow-2xl z-[60] animate-in fade-in zoom-in-95 duration-200">
                           <div className="p-4 border-b border-border/40">
                              <p className="text-[14px] font-bold text-foreground">{profile?.full_name}</p>
                              <p className="text-[12px] font-medium text-muted-foreground/50 mt-0.5">{profile?.role}</p>
                           </div>
                           <div className="p-2 space-y-1">
                              <button onClick={() => router.push(`/profile/${profile?.id}`)} className="w-full text-left px-3 py-2 text-[13px] font-bold text-foreground/70 hover:bg-secondary flex items-center gap-3 transition-all rounded-sm">
                                 <User className="h-3.5 w-3.5 opacity-40" /> Public Profile
                              </button>
                              <button onClick={() => router.push('/identity')} className="w-full text-left px-3 py-2 text-[13px] font-bold text-foreground/70 hover:bg-secondary flex items-center gap-3 transition-all rounded-sm">
                                 <Settings className="h-3.5 w-3.5 opacity-40" /> Edit Identity
                              </button>
                              <div className="h-px bg-border/40 my-2" />
                              <button onClick={handleSignOut} className="w-full text-left px-3 py-2 text-[13px] font-bold text-red-600/80 hover:bg-red-50 flex items-center gap-3 transition-all rounded-sm">
                                 <LogOut className="h-3.5 w-3.5 opacity-40" /> Exit Terminal
                              </button>
                           </div>
                        </div>
                     )}
                  </div>
               </div>
            </div>
         </GlobalHeader>

         <main className="flex-1 flex justify-center w-full">
            <div className="w-full max-w-[1440px] px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
               
               {/* LEFT SIDEBAR: NAVIGATION */}
               <div className="lg:col-span-2 hidden lg:flex flex-col h-[calc(100vh-120px)] sticky top-24">
                  <div className="flex-1 space-y-8">
                     <div className="space-y-4">
                        <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground/30 px-4">Navigation</h3>
                        <nav className="flex flex-col gap-1">
                           <button 
                              onClick={() => setActiveTab("all")} 
                              className={cn(
                                 "flex items-center gap-3 px-4 py-3 text-[13px] font-bold transition-all rounded-sm",
                                 activeTab === "all" ? "text-primary bg-primary/5 border-r-2 border-primary" : "text-muted-foreground/60 hover:text-foreground hover:bg-secondary/40"
                              )}
                           >
                              <LayoutGrid className="h-4 w-4" /> Feed
                           </button>
                           <button 
                              onClick={() => setActiveTab("discover")} 
                              className={cn(
                                 "flex items-center gap-3 px-4 py-3 text-[13px] font-bold transition-all rounded-sm",
                                 activeTab === "discover" ? "text-primary bg-primary/5 border-r-2 border-primary" : "text-muted-foreground/60 hover:text-foreground hover:bg-secondary/40"
                              )}
                           >
                              <Search className="h-4 w-4" /> Discover Developers
                           </button>
                           <button 
                              onClick={() => setActiveTab("teams")} 
                              className={cn(
                                 "flex items-center gap-3 px-4 py-3 text-[13px] font-bold transition-all rounded-sm",
                                 activeTab === "teams" ? "text-primary bg-primary/5 border-r-2 border-primary" : "text-muted-foreground/60 hover:text-foreground hover:bg-secondary/40"
                              )}
                           >
                              <Users className="h-4 w-4" /> Teams
                           </button>
                           <button 
                              onClick={() => setActiveTab("leaderboard")} 
                              className={cn(
                                 "flex items-center gap-3 px-4 py-3 text-[13px] font-bold transition-all rounded-sm",
                                 activeTab === "leaderboard" ? "text-primary bg-primary/5 border-r-2 border-primary" : "text-muted-foreground/60 hover:text-foreground hover:bg-secondary/40"
                              )}
                           >
                              <Trophy className="h-4 w-4" /> Leaderboard
                           </button>
                           <button 
                              onClick={() => setActiveTab("messages")} 
                              className={cn(
                                 "flex items-center gap-3 px-4 py-3 text-[13px] font-bold transition-all rounded-sm",
                                 activeTab === "messages" ? "text-primary bg-primary/5 border-r-2 border-primary" : "text-muted-foreground/60 hover:text-foreground hover:bg-secondary/40"
                              )}
                           >
                              <MessageSquare className="h-4 w-4" /> Messages
                           </button>
                        </nav>
                     </div>
                  </div>

                  <div className="p-4 bg-background border border-border/40 rounded-sm space-y-4 shadow-sm">
                     <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                           <Fingerprint className="h-4 w-4 text-primary" />
                        </div>
                        <div className="space-y-0.5">
                           <p className="text-[12px] font-bold text-foreground">Complete Profile</p>
                           <p className="text-[11px] font-medium text-muted-foreground/50">85% Synchronized</p>
                        </div>
                     </div>
                     <button 
                        onClick={() => router.push('/identity')}
                        className="w-full py-2.5 border border-border/40 text-[12px] font-bold text-muted-foreground/60 hover:bg-primary hover:text-background hover:border-primary transition-all rounded-sm"
                     >
                        Update Identity
                     </button>
                  </div>
               </div>

               {/* MAIN CONTENT AREA */}
               <div className={cn(
                  "space-y-8 transition-all duration-500",
                  activeTab === "messages" ? "lg:col-span-10" : "lg:col-span-7"
               )}>
                  
                  {activeTab === "all" || activeTab === "teams" || activeTab === "projects" || activeTab === "help" ? (
                     <>
                        {/* WELCOME + ACTION STRIP */}
                        <div className="p-6 bg-background border border-border/40 rounded-sm shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                           <div className="space-y-1">
                              <h2 className="text-xl font-bold tracking-tighter text-foreground">Welcome back, {profile?.full_name?.split(' ')[0]}</h2>
                              <p className="text-[12px] font-medium text-muted-foreground/50">What do you want to do today?</p>
                           </div>
                           <div className="flex items-center gap-3">
                              <button className="px-5 h-10 text-primary border border-primary/20 text-[13px] font-bold rounded-sm hover:bg-primary hover:text-background transition-all flex items-center gap-2">
                                 <Plus className="h-4 w-4" /> Ask for Help
                              </button>
                              <button className="px-5 h-10 text-muted-foreground border border-border/40 text-[13px] font-bold rounded-sm hover:bg-secondary transition-all flex items-center gap-2">
                                 <Users className="h-4 w-4" /> Find Team
                              </button>
                              <button className="px-5 h-10 text-muted-foreground border border-border/40 text-[13px] font-bold rounded-sm hover:bg-secondary transition-all flex items-center gap-2">
                                 <LinkIcon className="h-3.5 w-3.5" /> Share Project
                              </button>
                           </div>
                        </div>

                        {/* POST INPUT BAR */}
                        <div className="p-6 bg-background border border-border/60 rounded-sm shadow-sm space-y-4">
                           <div className="flex items-start gap-4">
                              <div className="h-10 w-10 rounded-full bg-secondary border border-border/20 flex items-center justify-center text-[11px] font-black uppercase overflow-hidden shrink-0">
                                 {profile?.avatar_url ? <img src={profile.avatar_url} className="h-full w-full object-cover" /> : profile?.full_name?.[0]}
                              </div>
                              <div className="flex-1 space-y-4">
                                 <textarea 
                                    className="w-full min-h-[0px] h-10 py-2 bg-transparent text-[13px] font-medium placeholder:text-muted-foreground/30 focus:outline-none resize-none"
                                    placeholder="Ask for help, find teammates, or share your project..."
                                 />
                                 <div className="flex items-center justify-between pt-2 border-t border-border/20">
                                    <div className="flex items-center gap-2">
                                       <select className="bg-secondary/50 border-none text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-sm focus:ring-1 focus:ring-primary/20 appearance-none cursor-pointer hover:bg-secondary">
                                          <option>HELP</option>
                                          <option>TEAM</option>
                                          <option>PROJECT</option>
                                       </select>
                                    </div>
                                    <button className="px-8 h-9 text-primary border border-primary/20 text-[13px] font-bold rounded-sm hover:bg-primary hover:text-background transition-all">
                                       Post
                                    </button>
                                 </div>
                              </div>
                           </div>
                        </div>

                        {/* FEED SECTION TABS */}
                        <div className="flex items-center gap-10 border-b border-border/40 px-2 pb-px overflow-x-auto whitespace-nowrap scrollbar-hide">
                           <button onClick={() => setActiveTab("all")} className={cn("py-4 text-[14px] font-bold transition-all", activeTab === "all" ? "text-primary border-b-2 border-primary" : "text-muted-foreground/40 hover:text-foreground")}>All Activity</button>
                           <button onClick={() => setActiveTab("help")} className={cn("py-4 text-[14px] font-bold transition-all", activeTab === "help" ? "text-primary border-b-2 border-primary" : "text-muted-foreground/40 hover:text-foreground")}>Help Requests</button>
                           <button onClick={() => setActiveTab("teams")} className={cn("py-4 text-[14px] font-bold transition-all", activeTab === "teams" ? "text-primary border-b-2 border-primary" : "text-muted-foreground/40 hover:text-foreground")}>Team Opportunities</button>
                           <button onClick={() => setActiveTab("projects")} className={cn("py-4 text-[14px] font-bold transition-all", activeTab === "projects" ? "text-primary border-b-2 border-primary" : "text-muted-foreground/40 hover:text-foreground")}>Projects</button>
                        </div>

                        {/* FEED LIST */}
                        <div className="space-y-8">
                           {feedPosts.filter(p => activeTab === "all" || p.type === activeTab.toUpperCase()).map((post) => (
                              <article key={post.id} className="p-8 bg-background border border-border/40 rounded-sm hover:shadow-xl hover:shadow-black/[0.02] transition-all group">
                                 <div className="flex items-start justify-between mb-8">
                                    <div className="flex items-center gap-4 text-left">
                                       <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-[10px] font-black border border-border/20 uppercase overflow-hidden">
                                          {post.user[0]}
                                       </div>
                                       <div className="space-y-0.5">
                                          <h4 className="text-[15px] font-bold tracking-tight text-foreground">{post.user}</h4>
                                          <div className="flex items-center gap-2">
                                             <span className="text-[11px] font-medium text-muted-foreground/50">{post.role}</span>
                                             <span className="text-muted-foreground/20 text-[8px]">•</span>
                                             <span className="text-[11px] font-medium text-muted-foreground/30">{post.timestamp}</span>
                                          </div>
                                       </div>
                                    </div>
                                    <div className={cn(
                                       "px-3 py-1 rounded-sm text-[9px] font-black uppercase tracking-widest",
                                       post.type === 'HELP' ? "bg-red-500/10 text-red-600" : 
                                       post.type === 'TEAM' ? "bg-blue-500/10 text-blue-600" : "bg-emerald-500/10 text-emerald-600"
                                    )}>
                                       {post.type}
                                    </div>
                                 </div>
                                 <div className="space-y-6 text-left mb-8">
                                    <p className="text-[15px] leading-relaxed font-medium text-foreground/80 font-inter">
                                       {post.content}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                       {post.tags.map(tag => (
                                          <span key={tag} className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 px-2.5 py-1 bg-secondary/60 rounded-sm border border-border/20 transition-colors hover:border-primary/20">
                                             #{tag}
                                          </span>
                                       ))}
                                    </div>
                                 </div>
                                 <div className="pt-6 border-t border-border/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex items-center gap-8">
                                       <button className="flex items-center gap-2.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 hover:text-primary transition-all group/btn">
                                          <Heart className="h-4 w-4 transition-transform group-hover/btn:scale-110" /> {post.likes}
                                       </button>
                                       <button className="flex items-center gap-2.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 hover:text-primary transition-all group/btn">
                                          <MessageCircle className="h-4 w-4 transition-transform group-hover/btn:scale-110" /> {post.comments}
                                       </button>
                                    </div>
                                    <div className="flex items-center gap-3">
                                       <button className="px-5 py-2 text-[13px] font-bold border border-border/40 hover:bg-primary hover:text-background transition-all rounded-sm flex items-center gap-2">
                                          <UserPlus className="h-3.5 w-3.5" /> Connect
                                       </button>
                                    </div>
                                 </div>
                              </article>
                           ))}
                        </div>
                     </>
                  ) : activeTab === "discover" ? (
                     <div className="space-y-12">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                           <div className="space-y-1">
                              <h2 className="text-2xl font-bold tracking-tighter text-foreground">Discover Developers</h2>
                              <p className="text-[13px] font-medium text-muted-foreground/50">Connect with technical experts across Bhutan</p>
                           </div>
                           <div className="flex items-center gap-2 font-inter">
                              <input type="text" placeholder="Search by skill or name..." className="px-4 py-2 bg-background border border-border/40 rounded-sm text-[13px] focus:outline-none focus:border-primary/40 w-64" />
                           </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           {[
                              { name: "Pema Dorji", role: "Backend Architect", skills: ["Rust", "Node", "Postgres"] },
                              { name: "Yeshi Lhamo", role: "Product Designer", skills: ["Figma", "UI/UX", "Motion"] },
                              { name: "Karma Tashi", role: "Mobile Engineer", skills: ["React Native", "Swift"] },
                              { name: "Sonam Dema", role: "DevOps Specialist", skills: ["Docker", "K8s", "AWS"] },
                           ].map((dev, i) => (
                              <div key={i} className="p-8 bg-background border border-border/40 rounded-sm hover:border-primary/20 transition-all group">
                                 <div className="flex items-center gap-5 mb-6">
                                    <div className="h-14 w-14 rounded-full bg-secondary border border-border/20 flex items-center justify-center text-[14px] font-black uppercase">{dev.name[0]}</div>
                                    <div className="space-y-0.5 text-left">
                                       <h4 className="text-[16px] font-bold text-foreground">{dev.name}</h4>
                                       <p className="text-[12px] font-medium text-muted-foreground/50">{dev.role}</p>
                                    </div>
                                 </div>
                                 <div className="flex flex-wrap gap-2 mb-8">
                                    {dev.skills.map(s => (
                                       <span key={s} className="px-2.5 py-1 bg-secondary/40 border border-border/20 text-[9px] font-bold text-muted-foreground/60 rounded-sm">{s}</span>
                                    ))}
                                 </div>
                                 <button className="w-full py-3 text-[13px] font-bold border border-border/40 hover:bg-primary hover:text-background transition-all rounded-sm">
                                    Send Connection Request
                                 </button>
                              </div>
                           ))}
                        </div>
                     </div>
                  ) : activeTab === "leaderboard" ? (
                     <div className="space-y-12">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                           <div className="space-y-1">
                              <h2 className="text-2xl font-bold tracking-tighter text-foreground">Network Leaderboard</h2>
                              <p className="text-[13px] font-medium text-muted-foreground/50">Top contributors to the Bhutanese tech ecosystem</p>
                           </div>
                        </div>
                        <div className="bg-background border border-border/40 rounded-sm overflow-hidden">
                           <table className="w-full text-left">
                              <thead>
                                 <tr className="border-b border-border/40 bg-secondary/20">
                                    <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-muted-foreground/40">Rank</th>
                                    <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-muted-foreground/40">Developer</th>
                                    <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-muted-foreground/40">Reputation</th>
                                    <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-muted-foreground/40">Contributions</th>
                                 </tr>
                              </thead>
                              <tbody>
                                 {[
                                    { rank: "01", name: "Pema Dorji", score: 4500, count: 124 },
                                    { rank: "02", name: "Karma Tashi", score: 4100, count: 98 },
                                    { rank: "03", name: "Sonam Dema", score: 3850, count: 86 },
                                    { rank: "04", name: "Tandin Wangmo", score: 3600, count: 77 },
                                 ].map((row, i) => (
                                    <tr key={i} className="border-b border-border/20 last:border-none hover:bg-secondary/10 transition-colors">
                                       <td className="px-8 py-6 text-[14px] font-black text-primary/40">#{row.rank}</td>
                                       <td className="px-8 py-6">
                                          <div className="flex items-center gap-3">
                                             <div className="h-8 w-8 rounded-full bg-secondary border border-border/20 flex items-center justify-center text-[10px] font-bold">{row.name[0]}</div>
                                             <span className="text-[14px] font-bold">{row.name}</span>
                                          </div>
                                       </td>
                                       <td className="px-8 py-6 text-[14px] font-bold text-primary">{row.score} RP</td>
                                       <td className="px-8 py-6 text-[14px] font-medium text-muted-foreground/60">{row.count} posts</td>
                                    </tr>
                                 ))}
                              </tbody>
                           </table>
                        </div>
                     </div>
                  ) : activeTab === "messages" ? (
                     <div className="h-[calc(100vh-160px)] flex bg-background border border-border/40 rounded-sm overflow-hidden shadow-sm">
                        <div className="w-80 border-r border-border/40 flex flex-col">
                           <div className="p-6 border-b border-border/40">
                              <h3 className="text-[14px] font-bold">Conversations</h3>
                           </div>
                           <div className="flex-1 overflow-y-auto">
                              {[
                                 { name: "Pema Dorji", last: "The middleware looks good...", time: "2m", active: true },
                                 { name: "Karma Tashi", last: "See you at the hackathon!", time: "1h", active: false },
                                 { name: "Yeshi Lhamo", last: "Sent the Figma file.", time: "4h", active: false },
                              ].map((chat, i) => (
                                 <div key={i} className={cn("p-5 border-b border-border/10 flex items-center gap-4 cursor-pointer hover:bg-secondary/40 transition-all", chat.active && "bg-secondary")}>
                                    <div className="h-10 w-10 rounded-full bg-background border border-border/20 flex items-center justify-center text-[11px] font-bold">{chat.name[0]}</div>
                                    <div className="flex-1 min-w-0 text-left">
                                       <div className="flex items-center justify-between mb-0.5">
                                          <span className="text-[13px] font-bold truncate">{chat.name}</span>
                                          <span className="text-[10px] text-muted-foreground/40">{chat.time}</span>
                                       </div>
                                       <p className="text-[11px] text-muted-foreground/60 truncate">{chat.last}</p>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </div>
                        <div className="flex-1 flex flex-col items-center justify-center space-y-4 opacity-30">
                           <div className="p-6 bg-secondary rounded-full">
                              <MessageSquare className="h-8 w-8 text-primary" />
                           </div>
                           <p className="text-[13px] font-bold">Select a conversation to synchronize</p>
                        </div>
                     </div>
                  ) : null}
               </div>

               {/* RIGHT PANEL: ECOSYSTEM (Hidden on Messages) */}
               {activeTab !== "messages" && (
                  <div className="lg:col-span-3 hidden lg:flex flex-col gap-8">
                     
                     {/* Section 1: Suggested Developers */}
                     <div className="p-6 bg-background border border-border/40 rounded-sm shadow-sm space-y-6">
                        <div className="flex items-center justify-between">
                           <h3 className="text-[13px] font-bold text-foreground">Suggested Connects</h3>
                           <Sparkles className="h-3 w-3 text-primary/40" />
                        </div>
                        <div className="space-y-5">
                           {[
                              { name: "Tandin Wangchuck", role: "Rust Dev" },
                              { name: "Yeshi Lhamo", role: "UI/UX Designer" },
                              { name: "Karma Tashi", role: "DevOps" }
                           ].map(dev => (
                              <div key={dev.name} className="flex items-center justify-between group">
                                 <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-secondary border border-border/20 flex items-center justify-center text-[9px] font-black uppercase font-inter">{dev.name[0]}</div>
                                    <div className="space-y-0.5">
                                       <p className="text-[13px] font-bold text-foreground leading-none">{dev.name}</p>
                                       <p className="text-[11px] font-medium text-muted-foreground/50">{dev.role}</p>
                                    </div>
                                 </div>
                                 <button className="p-2 text-muted-foreground/40 hover:text-primary transition-all">
                                    <UserPlus className="h-3.5 w-3.5" />
                                 </button>
                              </div>
                           ))}
                        </div>
                     </div>

                     {/* Section 2: Open Team Requests */}
                     <div className="p-6 bg-background border border-border/40 rounded-sm shadow-sm space-y-6">
                        <div className="flex items-center justify-between">
                           <h3 className="text-[13px] font-bold text-foreground">Team Requests</h3>
                           <Users className="h-3 w-3 text-primary/40" />
                        </div>
                        <div className="space-y-4">
                           {[
                              "Looking for React Dev for AgriTech Dashboard",
                              "Need Python Expert for ML pipeline"
                           ].map((req, i) => (
                              <div key={i} className="p-4 bg-secondary/30 border border-border/20 rounded-sm space-y-3">
                                 <p className="text-[12px] font-bold leading-relaxed text-foreground/70">{req}</p>
                                 <button className="w-full py-2 bg-background border border-border/40 text-[11px] font-bold hover:bg-primary hover:text-background transition-all rounded-sm">
                                    Join Team
                                 </button>
                              </div>
                           ))}
                        </div>
                     </div>

                     {/* Section 3: Leaderboard Mini */}
                     <div className="p-6 bg-background border border-border/40 rounded-sm shadow-sm space-y-6">
                        <div className="flex items-center justify-between">
                           <h3 className="text-[13px] font-bold text-foreground">Leaderboard</h3>
                           <Trophy className="h-3 w-3 text-amber-500/40" />
                        </div>
                        <div className="space-y-4">
                           {[
                              { rank: 1, name: "Pema Dorji", points: 2450 },
                              { rank: 2, name: "Sonam Kuenza", points: 2100 },
                              { rank: 3, name: "Dorji Wangmo", points: 1950 }
                           ].map(user => (
                              <div key={user.name} className="flex items-center justify-between">
                                 <div className="flex items-center gap-3">
                                    <span className="text-[11px] font-bold text-muted-foreground/30">#0{user.rank}</span>
                                    <p className="text-[13px] font-bold text-foreground">{user.name}</p>
                                 </div>
                                 <span className="text-[12px] font-bold text-primary">{user.points} pts</span>
                              </div>
                           ))}
                        </div>
                     </div>

                     {/* Section 4: Monthly Project */}
                     <div className="p-6 bg-primary/[0.02] border border-primary/20 rounded-sm shadow-sm space-y-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-2">
                           <Sparkles className="h-4 w-4 text-primary/20" />
                        </div>
                        <div className="space-y-1">
                           <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">Monthly Project</h3>
                           <h4 className="text-[16px] font-bold tracking-tight text-foreground">DrukHealth Dashboard</h4>
                        </div>
                        <p className="text-[13px] font-medium leading-relaxed text-muted-foreground/60">
                           A community-driven platform for tracking health metrics across the kingdom.
                        </p>
                        <button className="w-full py-3 bg-primary text-background text-[11px] font-bold uppercase tracking-widest rounded-sm hover:opacity-90 transition-all shadow-lg shadow-primary/20">
                           View Projects
                        </button>
                     </div>

                  </div>
               )}

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
                  <p className="text-[10px] font-black uppercase tracking-widest">Searching Streams...</p>
               </div>
            </div>
         )}
      </div>
   )
}
