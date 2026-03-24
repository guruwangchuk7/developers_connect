"use client"

import * as React from "react"
import { createClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { GlobalHeader } from "@/components/common/global-header"
import { cn } from "@/lib/utils"
import { LinkIcon, BookOpen, Clock, Check, Plus, ArrowRight, ShieldCheck, UserCircle2, Settings, UserPlus, Fingerprint, X, Camera, ArrowLeft } from "lucide-react"

export default function IdentitySynthesisPage() {
  const supabase = createClient()
  const router = useRouter()
  const [user, setUser] = React.useState<any>(null)
  const [profile, setProfile] = React.useState<any>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)

  // Edit State
  const [editData, setEditData] = React.useState({
    bio: "",
    github_url: "",
    linkedin_url: "",
    instagram_url: "",
    facebook_url: "",
    availability: "Looking for team",
    avatar_url: ""
  })

  React.useEffect(() => {
    async function getSession() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/join')
        return
      }
      setUser(session.user)

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()
      
      if (data) {
        setProfile(data)
        setEditData({
          bio: data.bio || "",
          github_url: data.github_url || "",
          linkedin_url: data.linkedin_url || "",
          instagram_url: data.instagram_url || "",
          facebook_url: data.facebook_url || "",
          availability: data.availability || "Looking for team",
          avatar_url: data.avatar_url || ""
        })
      }
      setIsLoading(false)
    }
    getSession()
  }, [supabase, router])

  const handleFullUpdate = async () => {
    if (!user) return
    setSaving(true)
    const { error } = await supabase
      .from('profiles')
      .update({
        bio: editData.bio,
        github_url: editData.github_url,
        linkedin_url: editData.linkedin_url,
        instagram_url: editData.instagram_url,
        facebook_url: editData.facebook_url,
        availability: editData.availability,
        avatar_url: editData.avatar_url,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)
    
    if (!error) {
       router.push('/dashboard')
    }
    setSaving(false)
  }

  if (isLoading || !user) return null

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <GlobalHeader />
      
      <main className="flex-1 container mx-auto py-12 md:py-20 px-4 md:px-8 max-w-[1400px]">
        <div className="space-y-16">
           {/* Header Area */}
           <div className="flex flex-col md:flex-row items-end justify-between gap-10 border-b border-border/40 pb-12">
              <div className="space-y-4">
                 <button onClick={() => router.back()} className="text-[10px] font-bold text-muted-foreground hover:text-primary flex items-center gap-2 uppercase tracking-widest transition-all">
                    <ArrowLeft className="h-3 w-3" /> Back to Grid
                 </button>
                 <h1 className="text-5xl font-bold tracking-tighter">Identity Synthesis</h1>
                 <p className="text-sm text-muted-foreground font-medium uppercase tracking-[0.4em]">Initialize full presence synchronization</p>
              </div>
              
              <div className="flex gap-4">
                 <button 
                  onClick={handleFullUpdate}
                  className="h-16 px-10 bg-primary text-background font-bold text-[11px] uppercase tracking-[0.2em] rounded-sm shadow-2xl shadow-primary/10 transition-all hover:scale-[1.02] active:scale-95"
                 >
                    {saving ? "Synchronizing All Data..." : "Finalize Synthesis"}
                 </button>
              </div>
           </div>

           {/* Landscape Layout Grid */}
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              
              {/* Left Column: Bio & Imagery */}
              <div className="space-y-12">
                 {/* Bio Section */}
                 <div className="p-10 border border-border/80 rounded-sm bg-secondary/5 space-y-8">
                    <div className="flex items-center gap-3">
                       <BookOpen className="h-5 w-5 text-primary" />
                       <h3 className="text-xs font-bold uppercase tracking-widest">Technical Narrative</h3>
                    </div>
                    <textarea
                       placeholder="Describe your unique professional path in 200 words..."
                       className="w-full bg-background border border-border/60 p-6 focus:outline-none focus:border-primary text-base font-medium min-h-[250px] resize-none leading-relaxed transition-all"
                       value={editData.bio}
                       onChange={e => setEditData({...editData, bio: e.target.value})}
                    />
                 </div>

                 {/* Profile Image Section */}
                 <div className="p-10 border border-border/80 rounded-sm bg-secondary/5 space-y-8">
                    <div className="flex items-center gap-3">
                       <Camera className="h-5 w-5 text-primary" />
                       <h3 className="text-xs font-bold uppercase tracking-widest">Visual Identity</h3>
                    </div>
                    <div className="flex flex-col md:flex-row items-center gap-10">
                       <div className="h-32 w-32 rounded-full border-2 border-primary/20 bg-background flex items-center justify-center overflow-hidden">
                          {editData.avatar_url ? (
                             <img src={editData.avatar_url} className="h-full w-full object-cover" />
                          ) : <UserCircle2 className="h-12 w-12 text-muted-foreground/30" />}
                       </div>
                       <div className="flex-1 space-y-4">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Professional Photo URL</label>
                          <input
                             type="text"
                             placeholder="https://images.unsplash.com/your-photo"
                             className="w-full bg-background border-b border-border/80 p-4 focus:outline-none focus:border-primary text-sm font-medium transition-all"
                             value={editData.avatar_url}
                             onChange={e => setEditData({...editData, avatar_url: e.target.value})}
                          />
                          <p className="text-[10px] text-muted-foreground opacity-60">High-resolution, well-lit portraits are recommended for network verification.</p>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Right Column: Networks & Status */}
              <div className="space-y-12">
                 {/* Network Sync Section */}
                 <div className="p-10 border border-border/80 rounded-sm bg-secondary/5 space-y-10">
                    <div className="flex items-center gap-3">
                       <LinkIcon className="h-5 w-5 text-primary" />
                       <h3 className="text-xs font-bold uppercase tracking-widest">Network Synchronization</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-4">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">GitHub Handle</label>
                          <input
                             type="text"
                             placeholder="github.com/handle"
                             className="w-full bg-background border-b border-border/80 p-4 focus:outline-none focus:border-primary text-sm font-medium md:text-xs"
                             value={editData.github_url}
                             onChange={e => setEditData({...editData, github_url: e.target.value})}
                          />
                       </div>
                       <div className="space-y-4">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">LinkedIn Profile</label>
                          <input
                             type="text"
                             placeholder="linkedin.com/in/name"
                             className="w-full bg-background border-b border-border/80 p-4 focus:outline-none focus:border-primary text-sm font-medium md:text-xs"
                             value={editData.linkedin_url}
                             onChange={e => setEditData({...editData, linkedin_url: e.target.value})}
                          />
                       </div>
                       <div className="space-y-4">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Instagram</label>
                          <input
                             type="text"
                             placeholder="instagram.com/handle"
                             className="w-full bg-background border-b border-border/80 p-4 focus:outline-none focus:border-primary text-sm font-medium md:text-xs"
                             value={editData.instagram_url}
                             onChange={e => setEditData({...editData, instagram_url: e.target.value})}
                          />
                       </div>
                       <div className="space-y-4">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Facebook</label>
                          <input
                             type="text"
                             placeholder="facebook.com/name"
                             className="w-full bg-background border-b border-border/80 p-4 focus:outline-none focus:border-primary text-sm font-medium md:text-xs"
                             value={editData.facebook_url}
                             onChange={e => setEditData({...editData, facebook_url: e.target.value})}
                          />
                       </div>
                    </div>
                 </div>

                 {/* Visibility Status Section */}
                 <div className="p-10 border border-border/80 rounded-sm bg-secondary/5 space-y-8">
                    <div className="flex items-center gap-3">
                       <Clock className="h-5 w-5 text-primary" />
                       <h3 className="text-xs font-bold uppercase tracking-widest">Network Visibility & Availability</h3>
                    </div>
                    <div className="space-y-6">
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {["Looking for team", "Open to work", "Just exploring"].map((status) => (
                             <button
                                key={status}
                                type="button"
                                onClick={() => setEditData({...editData, availability: status})}
                                className={cn(
                                   "p-5 text-[10px] font-bold uppercase tracking-widest border rounded-sm transition-all text-center",
                                   editData.availability === status 
                                      ? "bg-primary text-background border-primary shadow-xl shadow-primary/10" 
                                      : "bg-background text-muted-foreground border-border/80 hover:border-primary/40"
                                )}
                             >
                                {status}
                             </button>
                          ))}
                       </div>
                       <p className="text-[10px] text-muted-foreground opacity-60 text-center uppercase tracking-widest">This status determines how collaborators interaction with your profile.</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </main>
    </div>
  )
}
