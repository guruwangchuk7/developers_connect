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
   const [isMessagesOpen, setIsMessagesOpen] = React.useState(false)
   const [isProfileMenuOpen, setIsProfileMenuOpen] = React.useState(false)

   // Edit State
   const [editData, setEditData] = React.useState({
      bio: "",
      github_url: "",
      portfolio_url: "",
      availability: "Looking for team"
   })

   React.useEffect(() => {
      async function getSession() {
         if (!supabase) return; // Exit early if credentials missing during build
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
               portfolio_url: data.portfolio_url || "",
               availability: data.availability || "Looking for team"
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
            portfolio_url: editData.portfolio_url,
            availability: editData.availability,
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
      <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans selection:bg-primary selection:text-background text-foreground/80">
         <GlobalHeader />

         <main className="flex-1 flex justify-center w-full">
            <div className="w-full max-w-[1200px] px-4 md:px-6 py-10 md:py-24 space-y-12 md:space-y-20">

               {/* PAGE HEADER */}
               <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 md:gap-12 border-b border-border/40 pb-8 md:pb-12">
                  <div className="space-y-4 md:space-y-6">
                     <button
                        onClick={() => router.back()}
                        className="group flex items-center gap-3 text-[10px] md:text-[11px] font-bold text-muted-foreground/40 hover:text-primary transition-all uppercase tracking-widest"
                     >
                        <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-1" /> Back to Grid
                     </button>
                     <div className="space-y-2">
                        <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-foreground uppercase">Identity Synthesis</h1>
                        <p className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em] text-muted-foreground/60">Initialize full presence synchronization</p>
                     </div>
                  </div>
 
                  <button
                     onClick={handleFullUpdate}
                     disabled={saving}
                     className="w-full md:w-auto h-14 md:h-16 px-8 md:px-12 text-primary border border-primary/20 font-bold text-[13px] md:text-[14px] rounded-sm transition-all hover:bg-primary hover:text-background active:scale-95 disabled:opacity-50"
                  >
                     {saving ? "Synchronizing..." : "Finalize Synthesis"}
                  </button>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">

                  {/* LEFT COLUMN */}
                  <div className="lg:col-span-7 space-y-12">

                     {/* TECHNICAL NARRATIVE */}
                     <div className="p-5 md:p-10 bg-background border border-border/40 rounded-sm shadow-sm space-y-8">
                        <div className="flex items-center gap-3">
                           <Fingerprint className="h-5 w-5 text-primary opacity-40" />
                           <h3 className="text-[14px] font-bold text-foreground">Technical Narrative</h3>
                        </div>
                        <textarea
                           placeholder="Describe your unique professional path..."
                           className="w-full bg-secondary/20 border border-border/20 p-5 md:p-8 focus:outline-none focus:border-primary/40 text-[14px] font-medium min-h-[250px] md:min-h-[300px] resize-none leading-relaxed transition-all rounded-sm placeholder:text-muted-foreground/30"
                           value={editData.bio}
                           onChange={e => setEditData({ ...editData, bio: e.target.value })}
                        />
                     </div>
                  </div>

                  {/* RIGHT COLUMN */}
                  <div className="lg:col-span-5 space-y-8 lg:space-y-12">

                     {/* NETWORK SYNCHRONIZATION */}
                     <div className="p-5 md:p-10 bg-background border border-border/40 rounded-sm shadow-sm space-y-10">
                        <div className="flex items-center gap-3">
                           <LinkIcon className="h-5 w-5 text-primary opacity-40" />
                           <h3 className="text-[14px] font-bold text-foreground">Network Synchronization</h3>
                        </div>

                        <div className="space-y-6 md:space-y-8">
                           {['github', 'portfolio'].map(net => (
                              <div key={net} className="space-y-3">
                                 <label className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">{net}</label>
                                 <div className="relative group">
                                    <input
                                       type="text"
                                       placeholder={`${net}.com/user`}
                                       className="w-full bg-secondary/20 border border-border/20 p-3 md:p-4 pl-6 focus:outline-none focus:border-primary/40 text-[11px] font-bold transition-all rounded-sm placeholder:text-muted-foreground/20"
                                       value={(editData as any)[`${net}_url`]}
                                       onChange={e => setEditData({ ...editData, [`${net}_url`]: e.target.value })}
                                    />
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/20 group-focus-within:bg-primary transition-all rounded-l-sm" />
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>

                     {/* NETWORK VISIBILITY */}
                     <div className="p-5 md:p-10 bg-background border border-border/40 rounded-sm shadow-sm space-y-10">
                        <div className="flex items-center gap-3">
                           <Settings className="h-5 w-5 text-primary opacity-40" />
                           <h3 className="text-[14px] font-bold text-foreground">Network Visibility</h3>
                        </div>
                        <div className="grid grid-cols-1 gap-2 md:gap-3">
                           {["Looking for team", "Open to work", "Just exploring"].map((status) => (
                              <button
                                 key={status}
                                 type="button"
                                 onClick={() => setEditData({ ...editData, availability: status })}
                                 className={cn(
                                    "px-5 md:px-6 py-4 md:py-5 text-[10px] font-black uppercase tracking-[0.2em] border-2 rounded-sm transition-all text-left flex items-center justify-between group",
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


      </div>
   )
}
