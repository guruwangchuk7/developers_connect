"use client"

import * as React from "react"
import { createClient } from "@/lib/supabase"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { GlobalHeader } from "@/components/common/global-header"
import { cn } from "@/lib/utils"
import {
   MessageSquare, Users, UserPlus, Plus, Flame, Sparkles,
   ArrowRight, ShieldCheck, TrendingUp, Trophy, Bookmark,
   Send, MessageCircle, LinkIcon, Check, Fingerprint, X,
   ChevronRight, Heart, Bell, LayoutGrid, Search, User,
   Settings, LogOut, ChevronDown, ExternalLink
} from "lucide-react"
import { Suspense } from "react"

function DashboardContent() {
   const supabase = createClient()
   const router = useRouter()
   const pathname = usePathname()
   const searchParams = useSearchParams()
   const [user, setUser] = React.useState<any>(null)
   const [profile, setProfile] = React.useState<any>(null)
   const [isLoading, setIsLoading] = React.useState(true)
   const [activeTab, setActiveTabRaw] = React.useState<string>(searchParams?.get("tab") || "all")
   const [isMessagesOpen, setIsMessagesOpen] = React.useState(false)
   const [isProfileMenuOpen, setIsProfileMenuOpen] = React.useState(false)
   const [posts, setPosts] = React.useState<any[]>([])
   const [isPosting, setIsPosting] = React.useState(false)
   const [newPostType, setNewPostType] = React.useState("HELP")
   const [guidedFields, setGuidedFields] = React.useState<Record<string, string>>({
      blocker: "", stack: "", context: "",
      role: "", project: "", mission: "",
      projectName: "", description: "", link: ""
   })

   const setActiveTab = (tab: string) => {
      setActiveTabRaw(tab)
      if (["teams", "projects", "help"].includes(tab)) {
         setNewPostType(tab === "teams" ? "TEAM" : tab === "projects" ? "PROJECT" : "HELP")
      }
      const params = new URLSearchParams(searchParams?.toString())
      params.set("tab", tab)
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
   }

   React.useEffect(() => {
      const tab = searchParams?.get("tab")
      if (tab && tab !== activeTab) {
         setActiveTabRaw(tab)
         // Also set post type context
         if (["teams", "projects", "help"].includes(tab)) {
            setNewPostType(tab === "teams" ? "TEAM" : tab === "projects" ? "PROJECT" : "HELP")
         }
      }
   }, [searchParams, activeTab])

   const fetchPosts = async () => {
      if (!supabase) return;

      const { data, error } = await supabase
         .from('posts')
         .select(`
            *,
            profiles!user_id (
               full_name,
               role
            )
         `)
         .order('created_at', { ascending: false })

      if (error) {
         console.error('Error fetching posts:', error.message, error.details, error.hint)
         return
      }

      if (data) {
         console.log('Posts raw:', data)
         setPosts(data)
      }
   }

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
         if (!supabase) return;
         const { data: { session } } = await supabase.auth.getSession()
         if (!session) {
            router.push('/join')
            return
         }
         setUser(session.user)

         // Fetch profile and check if it exists
         const { data: profileRecord, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()

         if (profileError || !profileRecord) {
            console.warn('No profile found for authenticated user. Redirecting to onboarding...')
            router.push('/onboarding')
            return
         }

         setProfile(profileRecord)
         await fetchPosts()
         setIsLoading(false)
      }
      getSession()
   }, [supabase, router])

   const handlePost = async () => {
      // Derive type and build content based on active tab
      let content = ""
      let postType = "HELP"

      if (activeTab === "help") {
         content = `BLOCKER: ${guidedFields.blocker}\nSTACK: ${guidedFields.stack}\nCONTEXT: ${guidedFields.context}`
         postType = "HELP"
      } else if (activeTab === "teams") {
         content = `ROLE NEEDED: ${guidedFields.role}\nPROJECT: ${guidedFields.project}\nMISSION: ${guidedFields.mission}`
         postType = "TEAM"
      } else if (activeTab === "projects") {
         content = `PROJECT: ${guidedFields.projectName}\nDESCRIPTION: ${guidedFields.description}\nLINK: ${guidedFields.link}`
         postType = "PROJECT"
      }

      if (!content.trim() || isPosting) return

      // Ensure user and profile exist before posting
      if (!user?.id) {
         console.error('Cannot create post: User session not found')
         return
      }

      setIsPosting(true)

      const { data, error } = await supabase
         .from('posts')
         .insert([
            {
               user_id: user.id,
               type: postType,
               content: content,
               tags: content.match(/#\w+/g)?.map(t => t.slice(1)) || []
            }
         ])
         .select()

      if (error) {
         console.error('Error creating post:', error.message, '| Code:', error.code, '| Details:', error.details)
         // If it's a foreign key violation, it likely means the profile is missing
         if (error.code === '23503') {
            console.warn('Post creation failed due to missing profile record. Attempting to synchronize...')
            const { data: refreshedProfile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
            if (refreshedProfile) setProfile(refreshedProfile)
         }
      } else {
         console.log('Post created successfully:', data)
         setGuidedFields({
            blocker: "", stack: "", context: "",
            role: "", project: "", mission: "",
            projectName: "", description: "", link: ""
         })
         await fetchPosts()
      }
      setIsPosting(false)
   }

   const handleConnect = async (targetUserId: string) => {
      if (!user || user.id === targetUserId) return

      const { error } = await supabase
         .from('connections')
         .insert([
            {
               sender_id: user.id,
               receiver_id: targetUserId,
               status: 'PENDING'
            }
         ])

      if (error) {
         console.error('Error sending connection request:', error)
      } else {
         console.log('Connection request sent')
      }
   }
   const handleQuickAction = (type: string) => {
      setNewPostType(type)
      const textarea = document.querySelector('textarea')
      if (textarea) {
         textarea.focus()
      }
   }

   const handleDeletePost = async (postId: string) => {
      if (!window.confirm("Are you sure you want to delete this fragment? This action is permanent.")) return

      const { error } = await supabase
         .from('posts')
         .delete()
         .eq('id', postId)

      if (error) {
         console.error('Error deleting post:', error)
      } else {
         await fetchPosts()
      }
   }

   const handleSignOut = async () => {
      await supabase.auth.signOut()
      router.push('/')
   }

   if (isLoading || !user) return null

   // Feed Data (Supabase-driven)
   const feedPosts = posts.length > 0 ? posts.map(p => ({
      id: p.id,
      userId: p.user_id,
      type: p.type,
      user: p.profiles?.full_name || "Anonymous",
      role: p.profiles?.role || "Developer",
      content: p.content,
      tags: p.tags || [],
      timestamp: new Date(p.created_at).toLocaleDateString(),
      likes: p.likes_count || 0,
      comments: p.comments_count || 0,
      avatar: null
   })) : []

   return (
      <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans selection:bg-primary selection:text-background text-foreground/80">
         <GlobalHeader>
            <div className="flex items-center gap-6">
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
                        className="flex items-center justify-center h-8 w-8 rounded-full bg-secondary border border-border/20 overflow-hidden text-[11px] font-bold uppercase tracking-tighter transition-all hover:border-primary/40 active:scale-95 shadow-sm"
                     >
                        {profile?.full_name?.[0]}
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
            <div className="w-full max-w-[1440px] px-4 md:px-6 py-6 md:py-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">

               {/* LEFT SIDEBAR: NAVIGATION */}
               <div className="lg:col-span-2 hidden lg:flex flex-col h-[calc(100vh-120px)] sticky top-24">
                  <div className="flex-1 space-y-8">
                     <div className="space-y-4">
                        <div className="space-y-6">
                           <div className="space-y-4">
                              <h3 className="text-[12px] font-medium uppercase tracking-widest text-muted-foreground/40 px-4">Network</h3>
                              <nav className="flex flex-col gap-1">
                                 <button
                                    onClick={() => setActiveTab("all")}
                                    className={cn(
                                       "flex items-center gap-3.5 px-4 py-3 text-[14px] font-medium transition-all rounded-sm",
                                       activeTab === "all" ? "text-primary bg-primary/5 shadow-[inset_2px_0_0_0_currentColor]" : "text-muted-foreground/60 hover:text-foreground hover:bg-secondary/40"
                                    )}
                                 >
                                    <LayoutGrid className="h-4 w-4" /> Feed
                                 </button>
                                 <button
                                    onClick={() => setActiveTab("discover")}
                                    className={cn(
                                       "flex items-center gap-3.5 px-4 py-3 text-[14px] font-medium transition-all rounded-sm",
                                       activeTab === "discover" ? "text-primary bg-primary/5 shadow-[inset_2px_0_0_0_currentColor]" : "text-muted-foreground/60 hover:text-foreground hover:bg-secondary/40"
                                    )}
                                 >
                                    <Search className="h-4 w-4" /> Developers
                                 </button>
                                 <button
                                    onClick={() => setActiveTab("teams")}
                                    className={cn(
                                       "flex items-center gap-3.5 px-4 py-3 text-[14px] font-medium transition-all rounded-sm",
                                       activeTab === "teams" ? "text-primary bg-primary/5 shadow-[inset_2px_0_0_0_currentColor]" : "text-muted-foreground/60 hover:text-foreground hover:bg-secondary/40"
                                    )}
                                 >
                                    <Users className="h-4 w-4" /> Teams
                                 </button>
                                 <button
                                    onClick={() => setActiveTab("projects")}
                                    className={cn(
                                       "flex items-center gap-3.5 px-4 py-3 text-[14px] font-medium transition-all rounded-sm",
                                       activeTab === "projects" ? "text-primary bg-primary/5 shadow-[inset_2px_0_0_0_currentColor]" : "text-muted-foreground/60 hover:text-foreground hover:bg-secondary/40"
                                    )}
                                 >
                                    <LayoutGrid className="h-4 w-4 opacity-40" /> Projects
                                 </button>
                                 <button
                                    onClick={() => setActiveTab("help")}
                                    className={cn(
                                       "flex items-center gap-3.5 px-4 py-3 text-[14px] font-medium transition-all rounded-sm",
                                       activeTab === "help" ? "text-primary bg-primary/5 shadow-[inset_2px_0_0_0_currentColor]" : "text-muted-foreground/60 hover:text-foreground hover:bg-secondary/40"
                                    )}
                                 >
                                    <MessageCircle className="h-4 w-4 opacity-40" /> Help Requests
                                 </button>
                                 <button
                                    onClick={() => setActiveTab("leaderboard")}
                                    className={cn(
                                       "flex items-center gap-3.5 px-4 py-3 text-[14px] font-medium transition-all rounded-sm",
                                       activeTab === "leaderboard" ? "text-primary bg-primary/5 shadow-[inset_2px_0_0_0_currentColor]" : "text-muted-foreground/60 hover:text-foreground hover:bg-secondary/40"
                                    )}
                                 >
                                    <Trophy className="h-4 w-4" /> Leaderboard
                                 </button>
                              </nav>
                           </div>

                           <div className="space-y-4">
                              <h3 className="text-[12px] font-medium uppercase tracking-widest text-muted-foreground/40 px-4">Workspace</h3>
                              <nav className="flex flex-col gap-1">
                                 <button
                                    onClick={() => setActiveTab("messages")}
                                    className={cn(
                                       "flex items-center gap-3.5 px-4 py-3 text-[14px] font-medium transition-all rounded-sm",
                                       activeTab === "messages" ? "text-primary bg-primary/5 shadow-[inset_2px_0_0_0_currentColor]" : "text-muted-foreground/60 hover:text-foreground hover:bg-secondary/40"
                                    )}
                                 >
                                    <MessageSquare className="h-4 w-4" /> Messages
                                 </button>
                                 <button
                                    onClick={() => router.push('/identity')}
                                    className="flex items-center gap-3.5 px-4 py-3 text-[14px] font-medium text-muted-foreground/60 hover:text-foreground hover:bg-secondary/40 transition-all rounded-sm"
                                 >
                                    <Settings className="h-4 w-4" /> Settings
                                 </button>
                              </nav>
                           </div>
                        </div>
                     </div>


                  </div>
               </div>

               {/* MAIN CONTENT AREA */}
               <div className="lg:col-span-10 space-y-8 transition-all duration-500">

                  {/* WELCOME + ACTION STRIP */}
                  <div className="p-6 md:p-8 bg-background border border-border/40 rounded-sm shadow-sm flex flex-col md:flex-row md:items-end justify-between gap-8">
                     <div className="flex flex-col items-start text-left gap-1">
                        <span className="text-[12px] font-medium text-muted-foreground/50">Welcome back,</span>
                        <h2 className="text-[20px] md:text-[24px] font-medium tracking-tight text-foreground leading-tight">
                           {profile?.full_name?.split(' ')[0] || "Guru"}
                        </h2>
                        <p className="text-[12px] font-medium text-muted-foreground/40 mt-1">
                           What do you want to do today?
                        </p>
                     </div>
                     <div className="flex flex-wrap items-center gap-3">
                        <button
                           onClick={() => handleQuickAction('HELP')}
                           className="flex-1 md:flex-none px-6 h-11 text-primary border border-primary/20 text-[14px] font-medium rounded-sm hover:bg-primary hover:text-background transition-all flex items-center justify-center gap-2.5 shadow-sm active:scale-95"
                        >
                           <Plus className="h-4 w-4" /> Help
                        </button>
                        <button
                           onClick={() => handleQuickAction('TEAM')}
                           className="flex-1 md:flex-none px-6 h-11 text-muted-foreground border border-border/40 text-[14px] font-medium rounded-sm hover:bg-secondary transition-all flex items-center justify-center gap-2.5 shadow-sm active:scale-95"
                        >
                           <Users className="h-4 w-4" /> Team
                        </button>
                        <button className="flex-1 md:flex-none px-6 h-11 text-muted-foreground border border-border/40 text-[14px] font-medium rounded-sm hover:bg-secondary transition-all flex items-center justify-center gap-2.5 shadow-sm active:scale-95">
                           <LinkIcon className="h-3.5 w-3.5" /> Share
                        </button>
                     </div>
                  </div>

                  {/* SUB-NAVIGATION / FILTER BAR */}
                  {activeTab === "all" && (
                     <div className="flex items-center gap-8 overflow-x-auto pb-1 scrollbar-hide border-b border-border/20 mt-4">
                        {[
                           { id: "all", label: "All Feed", icon: LayoutGrid },
                           { id: "discover", label: "Developers", icon: Search },
                           { id: "teams", label: "Teams", icon: Users },
                           { id: "projects", label: "Projects", icon: LayoutGrid },
                           { id: "help", label: "Help Hub", icon: MessageCircle },
                        ].map((tab) => {
                           const Icon = tab.icon
                           const isActive = activeTab === tab.id
                           return (
                              <button
                                 key={tab.id}
                                 onClick={() => setActiveTab(tab.id)}
                                 className={cn(
                                    "flex items-center gap-2.5 px-0.5 py-4 text-[14px] font-medium transition-all whitespace-nowrap relative group",
                                    isActive ? "text-primary" : "text-muted-foreground/60 hover:text-foreground"
                                 )}
                              >
                                 <Icon className={cn("h-4 w-4", isActive ? "opacity-100" : "opacity-60")} />
                                 {tab.label}
                                 {isActive && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
                                 )}
                                 {!isActive && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-transparent group-hover:bg-primary/20 transition-all" />
                                 )}
                              </button>
                           )
                        })}
                     </div>
                  )}

                  {activeTab === "all" || activeTab === "teams" || activeTab === "projects" || activeTab === "help" ? (
                     <>

                        {/* POST INPUT BAR - Guided Version (Refined UI + Simple Button) */}
                        {["help", "teams", "projects"].includes(activeTab) && (
                           <div className="p-8 md:p-10 bg-background border border-border/40 rounded-sm shadow-xl shadow-black/[0.02] space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
                              <div className="flex items-center gap-4">
                                 <div className="h-0.5 w-8 bg-primary/30" />
                                 <h3 className="text-[13px] font-semibold uppercase tracking-widest text-primary/60">Guided Synthesis</h3>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                                 {activeTab === "help" && (
                                    <>
                                       <div className="space-y-3">
                                          <label className="text-[13px] font-medium text-muted-foreground/60 pl-1">Primary Blocker</label>
                                          <input type="text" placeholder="e.g. Supabase Auth Middleware" className="w-full bg-secondary/40 border border-transparent px-4 py-3 rounded-sm focus:outline-none focus:border-primary/20 focus:bg-background transition-all text-[14px] font-medium placeholder:text-muted-foreground/30" value={guidedFields.blocker} onChange={e => setGuidedFields({ ...guidedFields, blocker: e.target.value })} />
                                       </div>
                                       <div className="space-y-3">
                                          <label className="text-[13px] font-medium text-muted-foreground/60 pl-1">Tech Stack</label>
                                          <input type="text" placeholder="e.g. Next.js 14, Tailwind" className="w-full bg-secondary/40 border border-transparent px-4 py-3 rounded-sm focus:outline-none focus:border-primary/20 focus:bg-background transition-all text-[14px] font-medium placeholder:text-muted-foreground/30" value={guidedFields.stack} onChange={e => setGuidedFields({ ...guidedFields, stack: e.target.value })} />
                                       </div>
                                       <div className="space-y-3 md:col-span-2">
                                          <label className="text-[13px] font-medium text-muted-foreground/60 pl-1">Full Context</label>
                                          <textarea placeholder="Provide details to help others synchronize with your issue..." className="w-full bg-secondary/40 border border-transparent px-4 py-4 rounded-sm focus:outline-none focus:border-primary/20 focus:bg-background transition-all text-[14px] font-medium placeholder:text-muted-foreground/30 min-h-[120px] resize-none" value={guidedFields.context} onChange={e => setGuidedFields({ ...guidedFields, context: e.target.value })} />
                                       </div>
                                    </>
                                 )}

                                 {activeTab === "teams" && (
                                    <>
                                       <div className="space-y-3">
                                          <label className="text-[13px] font-medium text-muted-foreground/60 pl-1">Role Needed</label>
                                          <input type="text" placeholder="e.g. Rust Developer" className="w-full bg-secondary/40 border border-transparent px-4 py-3 rounded-sm focus:outline-none focus:border-primary/20 focus:bg-background transition-all text-[14px] font-medium placeholder:text-muted-foreground/30" value={guidedFields.role} onChange={e => setGuidedFields({ ...guidedFields, role: e.target.value })} />
                                       </div>
                                       <div className="space-y-3">
                                          <label className="text-[13px] font-medium text-muted-foreground/60 pl-1">Project Name</label>
                                          <input type="text" placeholder="e.g. DrukRide MVP" className="w-full bg-secondary/40 border border-transparent px-4 py-3 rounded-sm focus:outline-none focus:border-primary/20 focus:bg-background transition-all text-[14px] font-medium placeholder:text-muted-foreground/30" value={guidedFields.project} onChange={e => setGuidedFields({ ...guidedFields, project: e.target.value })} />
                                       </div>
                                       <div className="space-y-3 md:col-span-2">
                                          <label className="text-[13px] font-medium text-muted-foreground/60 pl-1">Mission Goal</label>
                                          <textarea placeholder="Describe the mission and what success looks like..." className="w-full bg-secondary/40 border border-transparent px-4 py-4 rounded-sm focus:outline-none focus:border-primary/20 focus:bg-background transition-all text-[14px] font-medium placeholder:text-muted-foreground/30 min-h-[120px] resize-none" value={guidedFields.mission} onChange={e => setGuidedFields({ ...guidedFields, mission: e.target.value })} />
                                       </div>
                                    </>
                                 )}

                                 {activeTab === "projects" && (
                                    <>
                                       <div className="space-y-3">
                                          <label className="text-[13px] font-medium text-muted-foreground/60 pl-1">Project Title</label>
                                          <input type="text" placeholder="e.g. Bhutan Analytics Core" className="w-full bg-secondary/40 border border-transparent px-4 py-3 rounded-sm focus:outline-none focus:border-primary/20 focus:bg-background transition-all text-[14px] font-medium placeholder:text-muted-foreground/30" value={guidedFields.projectName} onChange={e => setGuidedFields({ ...guidedFields, projectName: e.target.value })} />
                                       </div>
                                       <div className="space-y-3">
                                          <label className="text-[13px] font-medium text-muted-foreground/60 pl-1">Live Link / Repository</label>
                                          <input type="text" placeholder="https://github.com/..." className="w-full bg-secondary/40 border border-transparent px-4 py-3 rounded-sm focus:outline-none focus:border-primary/20 focus:bg-background transition-all text-[14px] font-medium placeholder:text-muted-foreground/30" value={guidedFields.link} onChange={e => setGuidedFields({ ...guidedFields, link: e.target.value })} />
                                       </div>
                                       <div className="space-y-3 md:col-span-2">
                                          <label className="text-[13px] font-medium text-muted-foreground/60 pl-1">Functional Description</label>
                                          <textarea placeholder="What does this fragment solve? Showcase your work..." className="w-full bg-secondary/40 border border-transparent px-4 py-4 rounded-sm focus:outline-none focus:border-primary/20 focus:bg-background transition-all text-[14px] font-medium placeholder:text-muted-foreground/30 min-h-[120px] resize-none" value={guidedFields.description} onChange={e => setGuidedFields({ ...guidedFields, description: e.target.value })} />
                                       </div>
                                    </>
                                 )}
                              </div>

                              <div className="flex items-center justify-end pt-8 border-t border-border/20">
                                 <button
                                    onClick={handlePost}
                                    disabled={isPosting}
                                    className="px-10 h-10 text-primary border border-primary/20 text-[14px] font-medium rounded-sm hover:bg-primary hover:text-background transition-all disabled:opacity-50 active:scale-95"
                                 >
                                    {isPosting ? "Posting..." : "Post Fragment"}
                                 </button>
                              </div>
                           </div>
                        )}

                        {/* FEED LIST */}
                        <div className="space-y-4 md:space-y-8">
                           {feedPosts.filter(p => {
                              const normalizedTab = activeTab === "teams" ? "TEAM" : activeTab === "projects" ? "PROJECT" : activeTab.toUpperCase()
                              return activeTab === "all" || p.type === normalizedTab
                           }).map((post) => (
                              <article key={post.id} className="p-5 md:p-8 bg-background border border-border/40 rounded-sm hover:shadow-xl hover:shadow-black/[0.02] transition-all group">
                                 <div className="flex items-start justify-between mb-6 md:mb-8">
                                    <div className="flex items-center gap-3 md:gap-4 text-left">
                                       <div className="h-9 w-9 md:h-10 md:w-10 rounded-full bg-secondary flex items-center justify-center text-[10px] font-bold border border-border/20 uppercase overflow-hidden">
                                          {post.user[0]}
                                       </div>
                                       <div className="space-y-0.5">
                                          <h4 className="text-[14px] md:text-[15px] font-bold tracking-tight text-foreground">{post.user}</h4>
                                          <div className="flex items-center gap-2">
                                             <span className="text-[10px] md:text-[11px] font-medium text-muted-foreground/50">{post.role}</span>
                                             <span className="text-muted-foreground/20 text-[8px]">•</span>
                                             <span className="text-[10px] md:text-[11px] font-medium text-muted-foreground/30">{post.timestamp}</span>
                                          </div>
                                       </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                       <div className={cn(
                                          "px-2.5 py-1 rounded-sm text-[10px] md:text-[11px] font-bold uppercase",
                                          post.type === 'HELP' ? "bg-red-500/10 text-red-600" :
                                             post.type === 'TEAM' ? "bg-blue-500/10 text-blue-600" : "bg-emerald-500/10 text-emerald-600"
                                       )}>
                                          {post.type}
                                       </div>
                                       {post.userId === user?.id && (
                                          <button
                                             onClick={() => handleDeletePost(post.id)}
                                             className="p-1.5 text-muted-foreground/30 hover:text-red-500 transition-colors"
                                             title="Delete Post"
                                          >
                                             <X className="h-3.5 w-3.5 md:h-4 md:w-4" />
                                          </button>
                                       )}
                                    </div>
                                 </div>
                                 <div className="space-y-6 text-left mb-8">
                                    <p className="text-[15px] leading-relaxed font-medium text-foreground/80 font-inter">
                                       {post.content}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                       {post.tags.map((tag: string) => (
                                          <span key={tag} className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 px-2.5 py-1 bg-secondary/60 rounded-sm border border-border/20 transition-colors hover:border-primary/20">
                                             #{tag}
                                          </span>
                                       ))}
                                    </div>
                                 </div>
                                 <div className="pt-5 md:pt-6 border-t border-border/20 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
                                    <div className="flex items-center gap-6 md:gap-8">
                                       <button className="flex items-center gap-2 text-[10px] md:text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 hover:text-primary transition-all group/btn">
                                          <Heart className="h-4 w-4 transition-transform group-hover/btn:scale-110" /> {post.likes}
                                       </button>
                                       <button className="flex items-center gap-2 text-[10px] md:text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 hover:text-primary transition-all group/btn">
                                          <MessageCircle className="h-4 w-4 transition-transform group-hover/btn:scale-110" /> {post.comments}
                                       </button>
                                    </div>
                                    <div className="flex items-center gap-3">
                                       <button
                                          onClick={() => handleConnect(post.userId)}
                                          disabled={post.userId === user?.id}
                                          className="flex-1 md:flex-none justify-center px-4 md:px-5 py-2 text-[12px] md:text-[13px] font-bold border border-border/40 hover:bg-primary hover:text-background transition-all rounded-sm flex items-center gap-2 disabled:opacity-30"
                                       >
                                          <UserPlus className="h-3.5 w-3.5" /> {post.userId === user?.id ? "Your Post" : "Connect"}
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
                              <h2 className="text-[20px] md:text-[24px] font-medium tracking-tight text-foreground">Discover Developers</h2>
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
                                       <h4 className="text-[15px] font-medium text-foreground">{dev.name}</h4>
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
                              <h2 className="text-[20px] md:text-[24px] font-medium tracking-tight text-foreground">Network Leaderboard</h2>
                              <p className="text-[13px] font-medium text-muted-foreground/50">Top contributors to the Bhutanese tech ecosystem</p>
                           </div>
                        </div>
                        <div className="bg-background border border-border/40 rounded-sm overflow-x-auto scrollbar-hide">
                           <table className="w-full text-left min-w-[600px] md:min-w-0">
                              <thead>
                                 <tr className="border-b border-border/40 bg-secondary/20">
                                    <th className="px-8 py-5 text-[12px] font-semibold uppercase tracking-widest text-muted-foreground/40">Rank</th>
                                    <th className="px-8 py-5 text-[12px] font-semibold uppercase tracking-widest text-muted-foreground/40">Developer</th>
                                    <th className="px-8 py-5 text-[12px] font-semibold uppercase tracking-widest text-muted-foreground/40">Reputation</th>
                                    <th className="px-8 py-5 text-[12px] font-semibold uppercase tracking-widest text-muted-foreground/40">Contributions</th>
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
                                       <td className="px-8 py-6 text-[15px] font-medium text-primary/40">#{row.rank}</td>
                                       <td className="px-8 py-6">
                                          <div className="flex items-center gap-3">
                                             <div className="h-8 w-8 rounded-full bg-secondary border border-border/20 flex items-center justify-center text-[10px] font-bold">{row.name[0]}</div>
                                             <span className="text-[14px] font-bold">{row.name}</span>
                                          </div>
                                       </td>
                                       <td className="px-8 py-6 text-[15px] font-medium text-primary">{row.score} RP</td>
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



            </div>
         </main>
      </div>
   )
}

export default function DashboardPage() {
   return (
      <Suspense fallback={
         <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
         </div>
      }>
         <DashboardContent />
      </Suspense>
   )
}
