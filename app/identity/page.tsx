"use client"

import * as React from "react"
import { createClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { GlobalHeader } from "@/components/common/global-header"
import { cn } from "@/lib/utils"
import { LinkIcon, BookOpen, Clock, Check, Plus, ArrowRight, ShieldCheck, UserCircle2, Settings, UserPlus, Fingerprint, X, Camera, ArrowLeft, UploadCloud, ChevronDown } from "lucide-react"

export default function IdentitySynthesisPage() {
   const supabase = createClient()
   const router = useRouter()
   const [user, setUser] = React.useState<any>(null)
   const [profile, setProfile] = React.useState<any>(null)
   const [isLoading, setIsLoading] = React.useState(true)
   const [saving, setSaving] = React.useState(false)
   const [isMessagesOpen, setIsMessagesOpen] = React.useState(false)
   const [isProfileMenuOpen, setIsProfileMenuOpen] = React.useState(false)
   const [team, setTeam] = React.useState<any[]>([])
   const [inviteData, setInviteData] = React.useState({ name: "", email: "", role: "Contributor" })
   const [confirmRemoveId, setConfirmRemoveId] = React.useState<string | null>(null)
   const [isInviting, setIsInviting] = React.useState(false)

   // Edit State
   const [activeTab, setActiveTab] = React.useState("Profile")
   const [editData, setEditData] = React.useState({
      bio: "",
      github_url: "",
      portfolio_url: "",
      availability: "Looking for team"
   })

   const [avatarFile, setAvatarFile] = React.useState<File | null>(null)
   const [previewUrl, setPreviewUrl] = React.useState<string | null>(null)
   const fileInputRef = React.useRef<HTMLInputElement>(null)
   const [isDragging, setIsDragging] = React.useState(false)
   const [isFilterOpen, setIsFilterOpen] = React.useState(false)

   const fetchTeam = async (userId: string) => {
      const { data } = await supabase
         .from('team_members')
         .select('*')
         .eq('owner_id', userId)
         .order('created_at', { ascending: true })
      if (data) setTeam(data)
   }

   React.useEffect(() => {
      async function getSession() {
         try {
            if (!supabase) return;
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
               router.push('/join')
               return
            }
            setUser(session.user)
            fetchTeam(session.user.id)

            const { data } = await supabase
               .from('profiles')
               .select('*')
               .eq('id', session.user.id)
               .single()

            if (data) {
               setProfile(data)
               setPreviewUrl(data.avatar_url || session.user.user_metadata?.avatar_url || null)
               setEditData({
                  bio: data.bio || "",
                  github_url: data.github_url || "",
                  portfolio_url: data.portfolio_url || "",
                  availability: data.availability || "Looking for team"
               })
            }
         } catch (e) {
            console.error(e)
         } finally {
            setIsLoading(false)
         }
      }
      getSession()
   }, [supabase, router])

   const handleFileSelect = (file: File) => {
      if (file && file.type.startsWith('image/')) {
         setAvatarFile(file)
         setPreviewUrl(URL.createObjectURL(file))
      }
   }

   const onDragOver = (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(true)
   }

   const onDragLeave = () => {
      setIsDragging(false)
   }

   const onDrop = (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files?.[0]
      if (file) handleFileSelect(file)
   }

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
   const handleAddMember = async () => {
      if (!user || !inviteData.email || !inviteData.name) return
      setIsInviting(true)
      const { error } = await supabase
         .from('team_members')
         .insert([{
            owner_id: user.id,
            full_name: inviteData.name,
            email: inviteData.email,
            role: inviteData.role
         }])

      if (!error) {
         setInviteData({ name: "", email: "", role: "Contributor" })
         await fetchTeam(user.id)
      }
      setIsInviting(false)
   }

   const handleRemoveMember = async (id: string) => {
      if (!user) return
      if (confirmRemoveId !== id) {
         setConfirmRemoveId(id)
         // Reset after 3 seconds if not confirmed
         setTimeout(() => setConfirmRemoveId(null), 3000)
         return
      }

      const { error } = await supabase
         .from('team_members')
         .delete()
         .eq('id', id)

      if (!error) {
         setTeam(team.filter(m => m.id !== id))
         setConfirmRemoveId(null)
      }
   }


   if (isLoading || !user) return null

   return (
      <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans selection:bg-primary selection:text-background text-foreground/80">
         <GlobalHeader />

         <main className="flex-1 flex flex-col items-center w-full">
            <div className="w-full px-[1cm] pt-10 md:pt-16 pb-20 space-y-10">

               {/* PAGE TITLE & TABS */}
               <div className="space-y-8">
                  <div className="space-y-2">
                     <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mb-4"
                     >
                        <ArrowLeft className="h-3 w-3" /> Back
                     </button>
                     <h1 className="text-3xl font-semibold tracking-tight text-[#101828]">Settings</h1>
                  </div>

                  {/* Mobile Tab Selector */}
                  <div className="md:hidden w-full relative">
                     <button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className="w-full bg-background border border-border rounded-lg p-3 text-sm font-semibold text-foreground flex items-center justify-between transition-all"
                     >
                        {activeTab}
                        <ChevronDown className="h-4 w-4" />
                     </button>

                     {isFilterOpen && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-xl shadow-xl z-50 overflow-hidden divide-y divide-border/40">
                           {["My details", "Profile", "Password", "Team", "Email"].map(tab => (
                              <button
                                 key={tab}
                                 onClick={() => {
                                    setActiveTab(tab)
                                    setIsFilterOpen(false)
                                 }}
                                 className={cn(
                                    "w-full text-left p-4 text-sm font-semibold transition-colors",
                                    activeTab === tab ? "bg-primary text-background" : "hover:bg-secondary"
                                 )}
                              >
                                 {tab}
                              </button>
                           ))}
                        </div>
                     )}
                  </div>

                  <nav className="hidden md:flex items-center gap-8 border-b border-border/60 overflow-x-auto pb-px">
                     {["My details", "Profile", "Password", "Team", "Email"].map((tab, i) => (
                        <button
                           key={tab}
                           onClick={() => setActiveTab(tab)}
                           className={cn(
                              "pb-4 text-[14px] font-semibold whitespace-nowrap transition-all border-b-2",
                              activeTab === tab ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                           )}
                        >
                           {tab}
                        </button>
                     ))}
                  </nav>
               </div>

               {/* SECTION CONTENT */}
               <div className="bg-background border border-border/60 rounded-xl shadow-sm overflow-hidden">

                  {/* SECTION HEADER */}
                  <div className="p-6 md:p-8 border-b border-border/40 flex flex-col md:flex-row md:items-center justify-between gap-6">
                     <div className="space-y-1">
                        <h2 className="text-lg font-semibold text-[#101828]">Identity Synthesis</h2>
                        <p className="text-sm text-muted-foreground">Update your photo and personal technical details here.</p>
                     </div>
                     <div className="flex items-center gap-3">
                        <button
                           onClick={() => router.back()}
                           className="px-4 py-2 text-sm font-semibold border border-border rounded-lg hover:bg-secondary transition-colors"
                        >
                           Cancel
                        </button>
                        <button
                           onClick={handleFullUpdate}
                           disabled={saving}
                           className="px-4 py-2 text-sm font-semibold bg-primary text-background rounded-lg hover:opacity-90 transition-all disabled:opacity-50"
                        >
                           {saving ? "Saving..." : "Save changes"}
                        </button>
                     </div>
                  </div>

                  <div className="divide-y divide-border/40">

                     {/* MY DETAILS & PROFILE CONTENT */}
                     {(activeTab === "My details" || activeTab === "Profile") && (
                        <>
                           {/* NAME / IDENTITY */}
                           <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-start">
                              <div className="md:col-span-3 pt-2">
                                 <label className="text-sm font-semibold text-[#344054]">Professional Name</label>
                              </div>
                              <div className="md:col-span-9 grid grid-cols-2 gap-4">
                                 <input
                                    type="text"
                                    placeholder="First name"
                                    className="w-full bg-background border border-border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all"
                                    value={user.user_metadata?.full_name?.split(' ')[0] || ""}
                                    disabled
                                 />
                                 <input
                                    type="text"
                                    placeholder="Last name"
                                    className="w-full bg-background border border-border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all"
                                    value={user.user_metadata?.full_name?.split(' ').slice(1).join(' ') || ""}
                                    disabled
                                 />
                              </div>
                           </div>

                           {/* PHOTO SECTION */}
                           <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-start">
                              <div className="md:col-span-3 pt-2">
                                 <label className="text-sm font-semibold text-[#344054]">Your photo</label>
                                 <p className="text-xs text-muted-foreground mt-1">This will be displayed on your profile.</p>
                              </div>
                              <div className="md:col-span-9 flex items-center gap-6">
                                 <div className="h-16 w-16 md:h-20 md:w-20 rounded-full overflow-hidden border border-border bg-secondary flex-shrink-0">
                                    {previewUrl ? (
                                       <img src={previewUrl} alt="Profile" className="h-full w-full object-cover" />
                                    ) : (
                                       <UserCircle2 className="h-full w-full text-muted-foreground/20 p-2" />
                                    )}
                                 </div>
                                 <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={e => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                                 />
                                 <div
                                    onClick={() => fileInputRef.current?.click()}
                                    onDragOver={onDragOver}
                                    onDragLeave={onDragLeave}
                                    onDrop={onDrop}
                                    className={cn(
                                       "flex-1 max-w-md border-2 border-dashed rounded-xl p-6 md:p-8 text-center space-y-2 transition-all cursor-pointer",
                                       isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/20"
                                    )}
                                 >
                                    <div className="h-10 w-10 bg-secondary rounded-full flex items-center justify-center mx-auto mb-2 text-muted-foreground">
                                       <UploadCloud className="h-5 w-5" />
                                    </div>
                                    <p className="text-xs font-semibold text-primary">Click to upload <span className="text-muted-foreground font-normal">or drag and drop</span></p>
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest leading-none">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                                 </div>
                              </div>
                           </div>

                           {/* NETWORK SYNCHRONIZATION */}
                           <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-start">
                              <div className="md:col-span-3 pt-2">
                                 <label className="text-sm font-semibold text-[#344054]">GitHub Narrative</label>
                                 <p className="text-xs text-muted-foreground mt-1">Primary link to your ecosystem code.</p>
                              </div>
                              <div className="md:col-span-9 relative max-w-2xl">
                                 <input
                                    type="text"
                                    placeholder="github.com/username"
                                    className="w-full bg-background border border-border rounded-lg p-2.5 pl-10 text-sm focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all"
                                    value={editData.github_url}
                                    onChange={e => setEditData({ ...editData, github_url: e.target.value })}
                                 />
                                 <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                              </div>
                           </div>

                           {/* AVAILABILITY */}
                           <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-start">
                              <div className="md:col-span-3 pt-2">
                                 <label className="text-sm font-semibold text-[#344054]">Operational Status</label>
                                 <p className="text-xs text-muted-foreground mt-1">Your current visibility in the network.</p>
                              </div>
                              <div className="md:col-span-9 max-w-2xl">
                                 <select
                                    className="w-full bg-background border border-border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all appearance-none"
                                    value={editData.availability}
                                    onChange={e => setEditData({ ...editData, availability: e.target.value })}
                                 >
                                    {["Looking for team", "Open to work", "Just exploring"].map(opt => (
                                       <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                 </select>
                              </div>
                           </div>

                           {/* TECHNICAL NARRATIVE */}
                           <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-start border-b-0">
                              <div className="md:col-span-3 pt-2">
                                 <label className="text-sm font-semibold text-[#344054]">Technical Narrative</label>
                                 <p className="text-xs text-muted-foreground mt-1">Describe your unique professional path.</p>
                              </div>
                              <div className="md:col-span-9 space-y-4 max-w-3xl">
                                 <div className="border border-border rounded-t-lg bg-secondary/30 px-4 py-2 flex items-center justify-between">
                                    <div className="flex items-center gap-6">
                                       <span className="text-xs font-semibold text-muted-foreground flex items-center gap-2">Normal text <Clock className="h-3 w-3" /></span>
                                       <div className="flex items-center gap-4 text-muted-foreground/60">
                                          <span className="font-bold">B</span>
                                          <span className="italic">I</span>
                                          <LinkIcon className="h-3.5 w-3.5" />
                                       </div>
                                    </div>
                                 </div>
                                 <textarea
                                    placeholder="Describe your unique professional path..."
                                    className="w-full bg-background border border-border border-t-0 rounded-b-lg p-6 md:p-8 focus:outline-none focus:ring-0 text-[14px] font-medium min-h-[200px] resize-none leading-relaxed transition-all placeholder:text-muted-foreground/30 shadow-inner"
                                    value={editData.bio}
                                    onChange={e => setEditData({ ...editData, bio: e.target.value })}
                                 />
                                 <div className="flex justify-start text-[11px] font-medium text-muted-foreground">
                                    {editData.bio.length} characters left (approx)
                                 </div>
                              </div>
                           </div>
                        </>
                     )}

                     {/* PASSWORD CONTENT */}
                     {activeTab === "Password" && (
                        <div className="p-6 md:p-8 space-y-10">
                           <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-start">
                              <div className="md:col-span-3 pt-2">
                                 <label className="text-sm font-semibold text-[#344054]">Current password</label>
                              </div>
                              <div className="md:col-span-9 max-w-md w-full">
                                 <input
                                    type="password"
                                    className="w-full bg-background border border-border rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                                    placeholder="••••••••"
                                 />
                              </div>
                           </div>
                           <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-start pt-6 border-t border-border/40">
                              <div className="md:col-span-3 pt-2">
                                 <label className="text-sm font-semibold text-[#344054]">New password</label>
                                 <p className="text-xs text-muted-foreground mt-1">Must be at least 8 characters.</p>
                              </div>
                              <div className="md:col-span-9 space-y-4 max-w-md w-full">
                                 <input
                                    type="password"
                                    className="w-full bg-background border border-border rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                                    placeholder="••••••••"
                                 />
                                 <input
                                    type="password"
                                    className="w-full bg-background border border-border rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                                    placeholder="Confirm new password"
                                 />
                              </div>
                           </div>
                        </div>
                     )}

                     {/* TEAM CONTENT */}
                     {activeTab === "Team" && (
                        <div className="p-6 md:p-8 space-y-10 animate-in fade-in duration-500">
                           <div className="flex items-center justify-between">
                              <div className="space-y-1">
                                 <h3 className="text-sm font-semibold text-[#101828]">Team synchronization</h3>
                                 <p className="text-xs text-muted-foreground">Manage your technical collaborators and their ecosystem roles.</p>
                              </div>
                           </div>

                           {/* INVITE FORM */}
                           <div className="p-6 bg-secondary/20 rounded-xl border border-border/40 space-y-6">
                              <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Sync New Collaborator</h4>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                 <input
                                    type="text"
                                    placeholder="Full name"
                                    className="bg-background border border-border rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                                    value={inviteData.name}
                                    onChange={e => setInviteData({ ...inviteData, name: e.target.value })}
                                 />
                                 <input
                                    type="email"
                                    placeholder="Gmail address"
                                    className="bg-background border border-border rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                                    value={inviteData.email}
                                    onChange={e => setInviteData({ ...inviteData, email: e.target.value })}
                                 />
                                 <div className="flex gap-2">
                                    <select
                                       className="flex-1 bg-background border border-border rounded-lg p-2 text-sm outline-none"
                                       value={inviteData.role}
                                       onChange={e => setInviteData({ ...inviteData, role: e.target.value })}
                                    >
                                       <option>Contributor</option>
                                       <option>Editor</option>
                                       <option>Viewer</option>
                                    </select>
                                    <button
                                       onClick={handleAddMember}
                                       disabled={isInviting || !inviteData.email}
                                       className="px-4 bg-primary text-background rounded-lg text-sm font-bold hover:opacity-90 transition-all disabled:opacity-30"
                                    >
                                       {isInviting ? "..." : "Add"}
                                    </button>
                                 </div>
                              </div>
                           </div>

                           <div className="border border-border/60 rounded-xl divide-y divide-border/40 overflow-hidden shadow-sm">
                              {/* Own Entry */}
                              <div className="flex items-center justify-between p-5 bg-secondary/10">
                                 <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center text-[10px] font-bold text-primary overflow-hidden shrink-0">
                                       {user.user_metadata?.avatar_url ? (
                                          <img src={user.user_metadata.avatar_url} className="h-full w-full object-cover" />
                                       ) : (
                                          user.user_metadata?.full_name?.[0] || user.email?.[0].toUpperCase()
                                       )}
                                    </div>
                                    <div>
                                       <p className="text-[13px] font-bold text-[#101828]">{user.user_metadata?.full_name || "You"}</p>
                                       <p className="text-[11px] text-muted-foreground">{user.email}</p>
                                    </div>
                                 </div>
                                 <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 bg-primary/10 text-primary rounded-full">Owner</span>
                              </div>

                              {team.map((m) => (
                                 <div key={m.id} className="flex items-center justify-between p-5 bg-background hover:bg-secondary/20 transition-all relative group">
                                    <div className="flex items-center gap-4">
                                       <div className="h-10 w-10 rounded-full bg-secondary italic flex items-center justify-center text-[12px] font-black text-muted-foreground/30 border border-border/60">
                                          {m.full_name[0]}
                                       </div>
                                       <div>
                                          <p className="text-[13px] font-bold text-[#101828]">{m.full_name}</p>
                                          <p className="text-[11px] text-muted-foreground">{m.email}</p>
                                       </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                       <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 px-2 py-0.5 bg-secondary/50 rounded-md border border-border/40">{m.role}</span>

                                       <button
                                          onClick={() => handleRemoveMember(m.id)}
                                          className={cn(
                                             "text-[10px] font-bold uppercase tracking-widest transition-all px-3 py-1.5 rounded-md border",
                                             confirmRemoveId === m.id
                                                ? "bg-red-500 text-white border-red-600 scale-105"
                                                : "text-muted-foreground/40 hover:text-red-500 hover:border-red-200"
                                          )}
                                       >
                                          {confirmRemoveId === m.id ? "Confirm Delete" : "Remove"}
                                       </button>
                                    </div>
                                 </div>
                              ))}
                           </div>

                           {team.length === 0 && (
                              <div className="py-12 text-center border border-dashed border-border rounded-xl">
                                 <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Isolated Node: No collaborators synchronized yet.</p>
                              </div>
                           )}
                        </div>
                     )}


                     {/* EMAIL CONTENT */}
                     {activeTab === "Email" && (
                        <div className="p-6 md:p-8 space-y-10">
                           <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-start">
                              <div className="md:col-span-3 pt-2">
                                 <label className="text-sm font-semibold text-[#344054]">Email address</label>
                                 <p className="text-xs text-muted-foreground mt-1">Your primary contact for the grid.</p>
                              </div>
                              <div className="md:col-span-9 max-w-xl w-full">
                                 <div className="relative group">
                                    <input
                                       type="email"
                                       className="w-full bg-secondary/20 border border-border rounded-lg p-2.5 pl-10 text-sm outline-none"
                                       value={user.email}
                                       disabled
                                    />
                                    <Check className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-success" />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 bg-brand-success/10 text-brand-success rounded text-[9px] font-black uppercase tracking-widest">Verified</div>
                                 </div>
                                 <p className="mt-2 text-[11px] text-muted-foreground italic">Auth method: {user.app_metadata?.provider || 'Google'} Secure Relay</p>
                              </div>
                           </div>
                           <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-start pt-8 border-t border-border/40">
                              <div className="md:col-span-3 pt-2">
                                 <label className="text-sm font-semibold text-[#344054]">Update relay email</label>
                              </div>
                              <div className="md:col-span-9 max-w-xl w-full space-y-4">
                                 <input
                                    type="email"
                                    className="w-full bg-background border border-border rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/10 transition-all font-medium"
                                    placeholder="newemail@domain.com"
                                 />
                                 <button className="px-5 py-2.5 bg-primary text-background text-xs font-black uppercase tracking-widest rounded-lg hover:opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-primary/10">
                                    Update Relay
                                    <ArrowRight className="h-3.5 w-3.5" />
                                 </button>
                              </div>
                           </div>
                        </div>
                     )}

                  </div>
               </div>
            </div>
         </main>
      </div>
   )
}
