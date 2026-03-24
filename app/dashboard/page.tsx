"use client"

import * as React from "react"
import { createClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { GlobalHeader } from "@/components/common/global-header"
import { cn } from "@/lib/utils"
import { LinkIcon, BookOpen, Clock, Check, Plus, ArrowRight, ShieldCheck, UserCircle2, Settings, UserPlus, Fingerprint, X, Camera } from "lucide-react"

export default function DashboardPage() {
  const supabase = createClient()
  const router = useRouter()
  const [user, setUser] = React.useState<any>(null)
  const [profile, setProfile] = React.useState<any>(null)
  const [isLoading, setIsLoading] = React.useState(true)

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

  if (isLoading || !user) return null

  // Progressive Completion Points Logic (for UI stats)
  const completionTasks = [
    { completed: !!profile?.bio, points: 15 },
    { completed: !!profile?.github_url || !!profile?.linkedin_url, points: 15 },
    { completed: !!profile?.availability, points: 10 },
    { completed: !!profile?.avatar_url, points: 10 },
  ]
  
  const totalCompletion = 20 + (profile?.skills?.length > 0 ? 30 : 0) + completionTasks.reduce((acc, task) => acc + (task.completed ? task.points : 0), 0)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <GlobalHeader />
      
      <main className="flex-1 container mx-auto py-12 md:py-16 px-4 md:px-8 max-w-6xl">
        <div className="flex flex-col gap-12">
           {/* Section 1: Identity Header */}
           <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-10">
              <div className="flex flex-col md:flex-row items-center gap-8">
                 <div className="relative group">
                    <div className="h-28 w-28 md:h-32 md:w-32 rounded-full border border-border/80 bg-secondary/50 flex items-center justify-center text-4xl font-black text-muted-foreground/30 shadow-inner group-hover:border-primary/40 transition-all overflow-hidden cursor-default">
                       {profile?.avatar_url ? (
                          <img src={profile.avatar_url} alt="Profile" className="h-full w-full object-cover" />
                       ) : profile?.full_name?.split(' ').map((n: string) => n[0]).join('')}
                    </div>
                    {/* Ring Progress Overlay */}
                    <svg className="absolute -inset-2 h-[calc(100%+16px)] w-[calc(100%+16px)] -rotate-90 pointer-events-none">
                       <circle cx="50%" cy="50%" r="68" stroke="currentColor" strokeWidth="2" fill="transparent" strokeDasharray={427} strokeDashoffset={427 - (427 * totalCompletion) / 100} className="text-primary opacity-20" />
                       <circle cx="50%" cy="50%" r="68" stroke="currentColor" strokeWidth="2.5" fill="transparent" strokeDasharray={427} strokeDashoffset={427 - (427 * totalCompletion) / 100} className="text-primary transition-all duration-1000" />
                    </svg>
                    <div className="absolute -bottom-1 -right-1 bg-primary text-background text-[10px] font-bold px-2 py-0.5 rounded-sm shadow-xl">
                       {totalCompletion}%
                    </div>
                 </div>
                 
                 <div className="text-center md:text-left flex flex-col justify-center">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-2">{profile?.full_name}</h1>
                    <div className="flex items-center justify-center md:justify-start gap-4">
                       <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">{profile?.role}</span>
                       <div className="h-3 w-px bg-border/60" />
                       <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground/50">Verified Member</span>
                    </div>
                 </div>
              </div>

              <div className="flex items-center gap-3">
                 <button className="h-11 px-6 bg-secondary hover:bg-secondary/80 text-[10px] font-bold uppercase tracking-widest rounded-sm border border-border/40 flex items-center gap-2 transition-all">
                    <Settings className="h-3.5 w-3.5" /> Site Controls
                 </button>
                 <button className="h-11 px-6 bg-primary text-background text-[10px] font-bold uppercase tracking-widest rounded-sm shadow-xl shadow-primary/10 flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all">
                    <Plus className="h-3.5 w-3.5" /> New Contribution
                 </button>
              </div>
           </div>

           {/* Section 2: Command Dashboard Context */}
           <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
              
              {/* Left Column: Essential Tasks & Context */}
              <div className="md:col-span-4 space-y-10">
                 {/* Initialization Summary Card */}
                 {totalCompletion < 100 && (
                   <div className="p-8 border border-border/80 rounded-sm bg-secondary/10 space-y-10">
                      <div className="space-y-4">
                         <div className="flex items-center gap-3 border-b border-border/40 pb-4">
                            <Fingerprint className="h-5 w-5 text-primary" />
                            <h3 className="text-xs font-bold uppercase tracking-widest">Initialization Pending</h3>
                         </div>
                         <p className="text-[10px] text-muted-foreground leading-relaxed font-medium uppercase tracking-widest opacity-60">
                            Your technical identity is currently synchronized at {totalCompletion}%. Complete the synthesis to unlock the full network ingress.
                         </p>
                      </div>

                      <div className="pt-2">
                          <button 
                           onClick={() => router.push('/identity')}
                           className="w-full h-14 bg-primary text-background font-bold text-[11px] uppercase tracking-[0.2em] rounded-sm hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-xl shadow-primary/10 active:scale-95"
                          >
                             <ArrowRight className="h-3.5 w-3.5" /> Full Identity Synthesis
                          </button>
                      </div>
                   </div>
                 )}

                 {/* Technical Stack Summary */}
                 <div className="p-8 border border-border/40 rounded-sm space-y-6 bg-background">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-40">Technical Stack</h3>
                    <div className="flex flex-wrap gap-2">
                       {profile?.skills?.map((s: string) => (
                          <span key={s} className="px-3 py-1.5 border border-border/80 rounded-sm text-[11px] font-bold transition-colors hover:border-primary/40 cursor-default">{s}</span>
                       ))}
                    </div>
                 </div>

                 {/* Social Context Feed */}
                 <div className="p-8 border border-border/40 rounded-sm space-y-4 bg-secondary/5">
                    <div className="flex items-center justify-between text-xs pb-2 border-b border-border/40">
                       <span className="text-muted-foreground font-bold uppercase tracking-widest text-[9px]">Presence Sync</span>
                       <Check className="h-3 w-3 text-emerald-500" />
                    </div>
                    <div className="flex gap-4 pt-2">
                       {profile?.github_url && <a href={profile.github_url} target="_blank" className="text-muted-foreground hover:text-primary transition-colors"><LinkIcon className="h-4 w-4" /></a>}
                       {profile?.linkedin_url && <a href={profile.linkedin_url} target="_blank" className="text-muted-foreground hover:text-primary transition-colors"><LinkIcon className="h-4 w-4" /></a>}
                       {profile?.instagram_url && <a href={profile.instagram_url} target="_blank" className="text-muted-foreground hover:text-primary transition-colors"><LinkIcon className="h-4 w-4" /></a>}
                       {profile?.facebook_url && <a href={profile.facebook_url} target="_blank" className="text-muted-foreground hover:text-primary transition-colors"><LinkIcon className="h-4 w-4" /></a>}
                    </div>
                 </div>
              </div>

              {/* Right Column: Grid Activity Streams */}
              <div className="md:col-span-8 flex flex-col gap-8">
                 {/* Feed Header */}
                 <div className="flex items-center justify-between border-b border-border/40 pb-4">
                    <h2 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Grid Activity Hub</h2>
                    <div className="flex items-center gap-2">
                       <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                       <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Live Sync</span>
                    </div>
                 </div>

                 {/* Activity Area Placeholder */}
                 <div className="flex-1 flex flex-col items-center justify-center py-32 rounded-sm border border-border/60 bg-secondary/5 text-center space-y-6">
                    <div className="h-20 w-20 rounded-full border border-border/40 flex items-center justify-center">
                       <ShieldCheck className="h-8 w-8 text-muted-foreground/30" />
                    </div>
                    <div className="space-y-4 px-8">
                       <h4 className="text-xl font-bold tracking-tight uppercase">Network Access Authorized</h4>
                       <p className="text-sm text-muted-foreground max-w-sm mx-auto font-medium leading-relaxed">
                          Your account is authenticated via the Bhutan Developer Grid. Collaboration streams, team request protocols, and local ecosystem events are currently being indexed.
                       </p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </main>
    </div>
  )
}
