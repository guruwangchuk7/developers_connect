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
      <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans selection:bg-primary selection:text-background text-foreground/80">
         <GlobalHeader />

         <main className="flex-1 flex justify-center w-full">
            <div className="w-full max-w-[1200px] px-6 py-16 md:py-24 space-y-20">
               
               {/* PAGE HEADER */}
               <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 border-b border-border/40 pb-12">
                  <div className="space-y-6">
                     <button 
                        onClick={() => router.back()} 
                        className="group flex items-center gap-3 text-[11px] font-bold text-muted-foreground/40 hover:text-primary transition-all uppercase tracking-widest"
                     >
                        <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-1" /> Back to Grid
                     </button>
                     <div className="space-y-2">
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground uppercase">Identity Synthesis</h1>
                        <p className="text-[11px] font-black uppercase tracking-[0.4em] text-muted-foreground/60">Initialize full presence synchronization</p>
                     </div>
                  </div>

                  <button 
                     onClick={handleFullUpdate}
                     disabled={saving}
                     className="h-16 px-12 text-primary border border-primary/20 font-bold text-[14px] rounded-sm transition-all hover:bg-primary hover:text-background active:scale-95 disabled:opacity-50"
                  >
                     {saving ? "Synchronizing..." : "Finalize Synthesis"}
                  </button>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                  
                  {/* LEFT COLUMN */}
                  <div className="lg:col-span-7 space-y-12">
                     
                     {/* TECHNICAL NARRATIVE */}
                     <div className="p-10 bg-background border border-border/40 rounded-sm shadow-sm space-y-8">
                        <div className="flex items-center gap-3">
                           <Fingerprint className="h-5 w-5 text-primary opacity-40" />
                           <h3 className="text-[14px] font-bold text-foreground">Technical Narrative</h3>
                        </div>
                        <textarea
                           placeholder="Describe your unique professional path in 200 words..."
                           className="w-full bg-secondary/20 border border-border/20 p-8 focus:outline-none focus:border-primary/40 text-[14px] font-medium min-h-[300px] resize-none leading-relaxed transition-all rounded-sm placeholder:text-muted-foreground/30"
                           value={editData.bio}
                           onChange={e => setEditData({...editData, bio: e.target.value})}
                        />
                     </div>

                     {/* VISUAL IDENTITY */}
                     <div className="p-10 bg-background border border-border/40 rounded-sm shadow-sm space-y-10">
                        <div className="flex items-center gap-3">
                           <Camera className="h-5 w-5 text-primary opacity-40" />
                           <h3 className="text-[14px] font-bold text-foreground">Visual Identity</h3>
                        </div>
                        
                        <div className="flex flex-col md:flex-row items-center gap-12">
                           <button 
                              onClick={() => setIsUploadOpen(true)}
                              className="relative h-40 w-40 rounded-full border-2 border-dashed border-border/40 bg-secondary/10 flex items-center justify-center overflow-hidden transition-all hover:border-primary/40 group shrink-0"
                           >
                              {editData.avatar_url ? (
                                 <img src={editData.avatar_url} className="h-full w-full object-cover transition-all group-hover:scale-110" />
                              ) : <UploadCloud className="h-8 w-8 text-muted-foreground/20" />}
                              <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                                 <Plus className="h-6 w-6 text-primary" />
                              </div>
                           </button>

                           <div className="flex-1 space-y-6 w-full">
                              <div className="space-y-3">
                                 <label className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">Professional Photo URL</label>
                                 <input
                                    type="text"
                                    placeholder="https://images.unsplash.com/..."
                                    className="w-full bg-transparent border-b-2 border-border/20 pb-4 focus:outline-none focus:border-primary text-[11px] font-bold tracking-tight transition-all placeholder:text-muted-foreground/20"
                                    value={editData.avatar_url}
                                    onChange={e => setEditData({...editData, avatar_url: e.target.value})}
                                 />
                              </div>
                              <p className="text-[9px] text-muted-foreground/40 leading-relaxed uppercase tracking-[0.2em] italic">High-resolution portraits recommended for verification.</p>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* RIGHT COLUMN */}
                  <div className="lg:col-span-5 space-y-12">
                     
                     {/* NETWORK SYNCHRONIZATION */}
                     <div className="p-10 bg-background border border-border/40 rounded-sm shadow-sm space-y-10">
                        <div className="flex items-center gap-3">
                           <LinkIcon className="h-5 w-5 text-primary opacity-40" />
                           <h3 className="text-[14px] font-bold text-foreground">Network Synchronization</h3>
                        </div>
                        
                        <div className="space-y-8">
                           {(['github', 'linkedin', 'instagram', 'facebook'] as const).map(net => (
                              <div key={net} className="space-y-3">
                                 <label className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">{net}</label>
                                 <div className="relative group">
                                    <input
                                       type="text"
                                       placeholder={`${net}.com/user`}
                                       className="w-full bg-secondary/20 border border-border/20 p-4 pl-6 focus:outline-none focus:border-primary/40 text-[11px] font-bold transition-all rounded-sm placeholder:text-muted-foreground/20"
                                       value={(editData as any)[`${net}_url`]}
                                       onChange={e => setEditData({...editData, [`${net}_url`]: e.target.value})}
                                    />
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/20 group-focus-within:bg-primary transition-all rounded-l-sm" />
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>

                     {/* NETWORK VISIBILITY */}
                     <div className="p-10 bg-background border border-border/40 rounded-sm shadow-sm space-y-10">
                        <div className="flex items-center gap-3">
                           <Settings className="h-5 w-5 text-primary opacity-40" />
                           <h3 className="text-[14px] font-bold text-foreground">Network Visibility</h3>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                           {["Looking for team", "Open to work", "Just exploring"].map((status) => (
                              <button
                                 key={status}
                                 type="button"
                                 onClick={() => setEditData({...editData, availability: status})}
                                 className={cn(
                                    "px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] border-2 rounded-sm transition-all text-left flex items-center justify-between group",
                                    editData.availability === status 
                                       ? "bg-primary text-background border-primary shadow-lg shadow-primary/10" 
                                       : "bg-background text-muted-foreground/40 border-border/20 hover:border-primary/20 hover:text-foreground"
                                 )}
                              >
                                 {status}
                                 {editData.availability === status && <Check className="h-4 w-4" />}
                              </button>
                           ))}
                        </div>
                     </div>

                  </div>
               </div>
            </div>
         </main>

         {/* UPLOAD OVERLAY */}
         {isUploadOpen && (
            <div className="fixed inset-0 bg-background/95 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
               <div className="w-full max-w-2xl bg-background border border-border/40 p-12 rounded-sm shadow-2xl relative space-y-12">
                  <button 
                     onClick={() => setIsUploadOpen(false)}
                     className="absolute top-6 right-6 p-2 hover:bg-secondary rounded-full transition-all"
                  >
                     <X className="h-6 w-6 text-muted-foreground/40" />
                  </button>

                  <div className="text-center space-y-4">
                     <h2 className="text-[14px] font-black uppercase tracking-[0.4em] text-foreground">Visual Asset Upload</h2>
                     <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">Synchronize your portrait with the network core</p>
                  </div>

                  <div 
                     className="aspect-video border-2 border-dashed border-border/40 rounded-sm flex flex-col items-center justify-center gap-8 hover:border-primary/40 transition-all cursor-pointer bg-secondary/5 group"
                     onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                     onDrop={(e) => {
                        e.preventDefault(); e.stopPropagation();
                        const file = e.dataTransfer.files?.[0];
                        if (file) handleFileUpload(file);
                     }}
                     onClick={() => document.getElementById('modal-upload')?.click()}
                  >
                     <div className="p-6 bg-background border border-border/20 rounded-full group-hover:scale-110 transition-all">
                        <UploadCloud className="h-10 w-10 text-primary opacity-30 group-hover:opacity-100" />
                     </div>
                     <div className="text-center space-y-2">
                        <p className="text-[11px] font-black uppercase tracking-[0.2em]">Drag to Upload</p>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/30">Maximum fragment size: 5MB</p>
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

                  <button 
                     onClick={() => setIsUploadOpen(false)}
                     className="w-full py-4 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 hover:text-foreground transition-all"
                  >
                     Abort Synchronization
                  </button>
               </div>
            </div>
         )}
      </div>
   )
}
