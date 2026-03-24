"use client"

import * as React from "react"
import { createClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { GlobalHeader } from "@/components/common/global-header"
import { cn } from "@/lib/utils"
import { LinkIcon, BookOpen, Clock, Check, Plus, ArrowRight, ShieldCheck, UserCircle2, Settings, UserPlus, Fingerprint, X, Camera, ArrowLeft, UploadCloud } from "lucide-react"

export default function IdentitySynthesisPage() {
  const supabase = createClient()
  const router = useRouter()
  const [user, setUser] = React.useState<any>(null)
  const [profile, setProfile] = React.useState<any>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)
  const [isUploadOpen, setIsUploadOpen] = React.useState(false)

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

  const handleFileUpload = async (file: File) => {
     if (!file || !user) return
     try {
        setSaving(true)
        const fileExt = file.name.split('.').pop()
        const filePath = `avatars/${user.id}/${Date.now()}.${fileExt}`
        
        const { error: uploadError } = await supabase.storage
           .from('profiles')
           .upload(filePath, file)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
           .from('profiles')
           .getPublicUrl(filePath)

        setEditData({...editData, avatar_url: publicUrl})
        setIsUploadOpen(false)
     } catch (err) {
        console.error("Upload failed", err)
     } finally {
        setSaving(false)
     }
  }

  if (isLoading || !user) return null

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <GlobalHeader />
      
      <main className="flex-1 container mx-auto py-12 md:py-20 px-4 md:px-8 max-w-[1400px]">
        <div className="space-y-16">
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
               
               <div className="space-y-12">
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

                  {/* MINIMALIST VISUAL IDENTITY */}
                  <div className="p-10 border border-border/80 rounded-sm bg-secondary/5 space-y-10 relative">
                     <div className="flex items-center gap-3">
                        <Camera className="h-5 w-5 text-primary opacity-40" />
                        <h3 className="text-xs font-bold uppercase tracking-widest">Visual Identity</h3>
                     </div>
                     <div className="flex flex-col md:flex-row items-center gap-12 text-left">
                        <button 
                           onClick={() => setIsUploadOpen(true)}
                           className="relative h-32 w-32 rounded-full border border-border/80 bg-background flex items-center justify-center overflow-hidden transition-all hover:border-primary/40 group shrink-0"
                        >
                           {editData.avatar_url ? (
                              <img src={editData.avatar_url} className="h-full w-full object-cover transition-all group-hover:scale-105" />
                           ) : <UserCircle2 className="h-10 w-10 text-muted-foreground/10" />}
                           <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                              <Plus className="h-6 w-6 text-primary" />
                           </div>
                        </button>
                        <div className="flex-1 space-y-4 w-full">
                           <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">Professional Photo URL</label>
                           <input
                              type="text"
                              placeholder="https://images.unsplash.com/..."
                              className="w-full bg-transparent border-b border-border/40 pb-4 focus:outline-none focus:border-primary text-[11px] font-medium tracking-tight transition-all"
                              value={editData.avatar_url}
                              onChange={e => setEditData({...editData, avatar_url: e.target.value})}
                           />
                           <p className="text-[10px] text-muted-foreground/40 leading-relaxed uppercase tracking-widest italic">High-resolution portraits recommended for verification.</p>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="space-y-12">
                  <div className="p-10 border border-border/80 rounded-sm bg-secondary/5 space-y-10">
                     <div className="flex items-center gap-3">
                        <LinkIcon className="h-5 w-5 text-primary" />
                        <h3 className="text-xs font-bold uppercase tracking-widest">Network Synchronization</h3>
                     </div>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Network Inputs */}
                        {(['github', 'linkedin', 'instagram', 'facebook'] as const).map(net => (
                           <div key={net} className="space-y-4">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{net.charAt(0).toUpperCase() + net.slice(1)}</label>
                              <input
                                 type="text"
                                 placeholder={`${net}.com/user`}
                                 className="w-full bg-background border-b border-border/80 p-4 focus:outline-none focus:border-primary text-[11px] font-medium transition-all"
                                 value={(editData as any)[`${net}_url`]}
                                 onChange={e => setEditData({...editData, [`${net}_url`]: e.target.value})}
                              />
                           </div>
                        ))}
                     </div>
                  </div>

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
                     </div>
                  </div>
               </div>
            </div>
        </div>
      </main>

      {/* UPLOAD OVERLAY MODAL */}
      {isUploadOpen && (
         <div className="fixed inset-0 bg-background/98 backdrop-blur-xl z-[100] flex flex-col items-center justify-center p-6 animate-in fade-in duration-300">
            <button 
               onClick={() => setIsUploadOpen(false)}
               className="absolute top-10 right-10 p-4 hover:bg-secondary rounded-full transition-all group"
            >
               <X className="h-8 w-8 text-muted-foreground/40 group-hover:text-foreground" />
            </button>

            <div 
               className="w-full max-w-2xl aspect-video border-2 border-dashed border-border/60 rounded-sm flex flex-col items-center justify-center gap-6 hover:border-primary/40 transition-all cursor-pointer group"
               onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
               onDrop={(e) => {
                  e.preventDefault(); e.stopPropagation();
                  const file = e.dataTransfer.files?.[0];
                  if (file) handleFileUpload(file);
               }}
               onClick={() => document.getElementById('modal-upload')?.click()}
            >
               <div className="p-8 bg-secondary/5 rounded-full group-hover:scale-110 transition-all">
                  <UploadCloud className="h-12 w-12 text-primary opacity-30 group-hover:opacity-100" />
               </div>
               <div className="text-center space-y-2">
                  <h2 className="text-sm font-bold uppercase tracking-[0.3em]">Drag to Synchronize</h2>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">Or click to select from system</p>
               </div>
               <input 
                  id="modal-upload" 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={(e) => {
                     const file = e.target.files?.[0];
                     if (file) handleFileUpload(file);
                  }}
               />
            </div>
         </div>
      )}
    </div>
  )
}
