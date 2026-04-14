"use client"

import * as React from "react"
import { GlobalHeader } from "@/components/common/global-header"
import { cn } from "@/lib/utils"
import {
   LinkIcon,
   Clock,
   Check,
   ArrowLeft,
   UploadCloud,
   UserCircle2
} from "lucide-react"

import { useIdentityData } from "@/features/identity/hooks/use-identity-data"
import { IdentityTabs } from "@/features/identity/components/identity-tabs"
import { TeamManagement } from "@/features/identity/components/team-management"

export default function SettingsPage() {
   const {
      user,
      isLoading,
      saving,
      team,
      setTeam,
      activeTab,
      setActiveTab,
      editData,
      setEditData,
      previewUrl,
      setPreviewUrl,
      setAvatarFile,
      isDragging,
      setIsDragging,
      isFilterOpen,
      setIsFilterOpen,
      handleFullUpdate,
      fetchTeam,
      supabase,
      router
   } = useIdentityData()

   const [inviteData, setInviteData] = React.useState({ name: "", email: "", role: "Contributor" })
   const [confirmRemoveId, setConfirmRemoveId] = React.useState<string | null>(null)
   const [isInviting, setIsInviting] = React.useState(false)
   const fileInputRef = React.useRef<HTMLInputElement>(null)

   const handleFileSelect = (file: File) => {
      if (file && file.type.startsWith('image/')) {
         setAvatarFile(file)
         setPreviewUrl(URL.createObjectURL(file))
      }
   }

   const handleAddMember = async () => {
      if (!user || !inviteData.email || !inviteData.name) return
      setIsInviting(true)
      const { error } = await supabase.from('team_members').insert([{
         owner_id: user.id, full_name: inviteData.name, email: inviteData.email, role: inviteData.role
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
         setTimeout(() => setConfirmRemoveId(null), 3000)
         return
      }
      const { error } = await supabase.from('team_members').delete().eq('id', id)
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
            <div className="w-full px-4 md:px-10 pt-10 md:pt-16 pb-20 space-y-10">
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

                  <IdentityTabs
                     activeTab={activeTab}
                     setActiveTab={setActiveTab}
                     isFilterOpen={isFilterOpen}
                     setIsFilterOpen={setIsFilterOpen}
                  />
               </div>

               <div className="bg-background border border-border/60 rounded-xl shadow-sm overflow-hidden">
                  <div className="p-6 md:p-8 border-b border-border/40 flex flex-col md:flex-row md:items-center justify-between gap-6">
                     <div className="space-y-1">
                        <h2 className="text-lg font-semibold text-[#101828]">Profile Settings</h2>
                        <p className="text-sm text-muted-foreground">Update your photo and profile details here.</p>
                     </div>
                     <div className="flex items-center gap-3">
                        <button onClick={() => router.back()} className="px-4 py-2 text-sm font-semibold border border-border rounded-lg hover:bg-secondary transition-colors">
                           Cancel
                        </button>
                        <button onClick={handleFullUpdate} disabled={saving} className="px-4 py-2 text-sm font-semibold bg-primary text-background rounded-lg hover:opacity-90 transition-all disabled:opacity-50">
                           {saving ? "Saving..." : "Save changes"}
                        </button>
                     </div>
                  </div>

                  <div className="divide-y divide-border/40">
                     {(activeTab === "My details" || activeTab === "Profile") && (
                        <>
                           <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-start">
                              <div className="md:col-span-3 pt-2">
                                 <label className="text-sm font-semibold text-[#344054]">Full Name</label>
                              </div>
                              <div className="md:col-span-9 grid grid-cols-2 gap-4">
                                 <input type="text" placeholder="First name" className="w-full bg-background border border-border rounded-lg p-2.5 text-sm outline-none" value={user.user_metadata?.full_name?.split(' ')[0] || ""} disabled />
                                 <input type="text" placeholder="Last name" className="w-full bg-background border border-border rounded-lg p-2.5 text-sm outline-none" value={user.user_metadata?.full_name?.split(' ').slice(1).join(' ') || ""} disabled />
                              </div>
                           </div>

                           <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-start">
                              <div className="md:col-span-3 pt-2">
                                 <label className="text-sm font-semibold text-[#344054]">Your photo</label>
                                 <p className="text-xs text-muted-foreground mt-1">This will be displayed on your profile.</p>
                              </div>
                              <div className="md:col-span-9 flex items-center gap-6">
                                 <div className="h-16 w-16 md:h-20 md:w-20 rounded-full overflow-hidden border border-border bg-secondary flex-shrink-0">
                                    {previewUrl ? <img src={previewUrl} className="h-full w-full object-cover" /> : <UserCircle2 className="h-full w-full text-muted-foreground/20 p-2" />}
                                 </div>
                                 <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={e => e.target.files?.[0] && handleFileSelect(e.target.files[0])} />
                                 <div
                                    onClick={() => fileInputRef.current?.click()}
                                    onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                                    onDragLeave={() => setIsDragging(false)}
                                    onDrop={e => { e.preventDefault(); setIsDragging(false); const file = e.dataTransfer.files?.[0]; if (file) handleFileSelect(file); }}
                                    className={cn("flex-1 max-w-md border-2 border-dashed rounded-xl p-6 md:p-8 text-center space-y-2 transition-all cursor-pointer", isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/20")}
                                 >
                                    <div className="h-10 w-10 bg-secondary rounded-full flex items-center justify-center mx-auto mb-2 text-muted-foreground"><UploadCloud className="h-5 w-5" /></div>
                                    <p className="text-xs font-semibold text-primary">Click to upload <span className="text-muted-foreground font-normal">or drag and drop</span></p>
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest leading-none">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                                 </div>
                              </div>
                           </div>

                           <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-start">
                              <div className="md:col-span-3 pt-2">
                                 <label className="text-sm font-semibold text-[#344054]">GitHub Link</label>
                                 <p className="text-xs text-muted-foreground mt-1">Your public code profile.</p>
                              </div>
                              <div className="md:col-span-9 relative max-w-2xl">
                                 <input type="text" placeholder="github.com/username" className="w-full bg-background border border-border rounded-lg p-2.5 pl-10 text-sm outline-none" value={editData.github_url} onChange={e => setEditData({ ...editData, github_url: e.target.value })} />
                                 <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                              </div>
                           </div>

                           <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-start">
                              <div className="md:col-span-3 pt-2">
                                 <label className="text-sm font-semibold text-[#344054]">Work Status</label>
                                 <p className="text-xs text-muted-foreground mt-1">Let others know if you're available.</p>
                              </div>
                              <div className="md:col-span-9 max-w-2xl">
                                 <select className="w-full bg-background border border-border rounded-lg p-2.5 text-sm appearance-none" value={editData.availability} onChange={e => setEditData({ ...editData, availability: e.target.value })}>
                                    {["Looking for team", "Open to work", "Just exploring"].map(opt => <option key={opt}>{opt}</option>)}
                                 </select>
                              </div>
                           </div>

                           <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-start border-b-0">
                              <div className="md:col-span-3 pt-2">
                                 <label className="text-sm font-semibold text-[#344054]">Bio</label>
                                 <p className="text-xs text-muted-foreground mt-1">Tell us about yourself and your work.</p>
                              </div>
                              <div className="md:col-span-9 space-y-4 max-w-3xl">
                                 <div className="border border-border rounded-t-lg bg-secondary/30 px-4 py-2 flex items-center justify-between">
                                    <div className="flex items-center gap-6"><span className="text-xs font-semibold text-muted-foreground flex items-center gap-2">Normal text <Clock className="h-3 w-3" /></span><div className="flex items-center gap-4 text-muted-foreground/60"><span className="font-bold">B</span><span className="italic">I</span><LinkIcon className="h-3.5 w-3.5" /></div></div>
                                 </div>
                                 <textarea placeholder="Tell us about yourself and your work..." className="w-full bg-background border border-border border-t-0 rounded-b-lg p-6 md:p-8 text-[14px] font-medium min-h-[200px] resize-none leading-relaxed transition-all placeholder:text-muted-foreground/30 shadow-inner" value={editData.bio} onChange={e => setEditData({ ...editData, bio: e.target.value })} />
                                 <div className="flex justify-start text-[11px] font-medium text-muted-foreground">{editData.bio.length} characters left (approx)</div>
                              </div>
                           </div>
                        </>
                     )}

                     {/* TODO: Implement Supabase Auth Password Update Flow */}
                     {activeTab === "Password" && (
                        <div className="p-6 md:p-8 space-y-10">
                           <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-start">
                              <div className="md:col-span-3 pt-2"><label className="text-sm font-semibold text-[#344054]">Current password</label></div>
                              <div className="md:col-span-9 max-w-md w-full"><input type="password" disabled className="w-full bg-secondary/20 border border-border rounded-lg p-2.5 text-sm outline-none cursor-not-allowed" placeholder="••••••••" /></div>
                           </div>
                           <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-start pt-6 border-t border-border/40 opacity-50">
                              <div className="md:col-span-3 pt-2"><label className="text-sm font-semibold text-[#344054]">New password</label><p className="text-xs text-muted-foreground mt-1">Must be at least 8 characters.</p></div>
                              <div className="md:col-span-9 space-y-4 max-w-md w-full"><input type="password" disabled className="w-full bg-secondary/20 border border-border rounded-lg p-2.5 text-sm outline-none cursor-not-allowed" placeholder="••••••••" /><input type="password" disabled className="w-full bg-secondary/20 border border-border rounded-lg p-2.5 text-sm outline-none cursor-not-allowed" placeholder="Confirm new password" /></div>
                           </div>
                           <p className="text-[10px] text-muted-foreground italic text-center pt-4">Password updates are currently disabled.</p>
                        </div>
                     )}

                     {activeTab === "Team" && (
                        <TeamManagement
                           team={team}
                           user={user}
                           inviteData={inviteData}
                           setInviteData={setInviteData}
                           isInviting={isInviting}
                           handleAddMember={handleAddMember}
                           handleRemoveMember={handleRemoveMember}
                           confirmRemoveId={confirmRemoveId}
                        />
                     )}

                     {/* TODO: Implement Email Relay Update Logic */}
                     {activeTab === "Email" && (
                        <div className="p-6 md:p-8 space-y-10">
                           <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-start">
                              <div className="md:col-span-3 pt-2"><label className="text-sm font-semibold text-[#344054]">Email address</label></div>
                              <div className="md:col-span-9 max-w-xl w-full">
                                 <div className="relative group"><input type="email" className="w-full bg-secondary/20 border border-border rounded-lg p-2.5 pl-10 text-sm outline-none" value={user.email} disabled /><Check className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-success" /><div className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 bg-brand-success/10 text-brand-success rounded text-[9px] font-black uppercase tracking-widest">Verified</div></div>
                                 <p className="mt-2 text-[11px] text-muted-foreground italic">Logged in with: {user.app_metadata?.provider || 'Google'}</p>
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
