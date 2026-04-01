"use client"

import * as React from "react"
import { createClient } from "@/lib/supabase"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { GlobalHeader } from "@/components/common/global-header"
import { 
  Plus, 
  Users, 
  Check, 
  Clock, 
  UserPlus, 
  Search, 
  LayoutGrid, 
  MessageCircle, 
  Heart, 
  X, 
  MessageSquare, 
  Settings, 
  LogOut, 
  Trophy, 
  Flame, 
  Sparkles, 
  Send, 
  Link as LinkIcon 
} from "lucide-react"
import { Suspense } from "react"
import { toast } from "sonner"

import { DashboardNavigation } from "@/features/dashboard/components/dashboard-navigation"
import { MobileNavPill } from "@/features/dashboard/components/mobile-nav-pill"
import { PostCreator } from "@/features/dashboard/components/post-creator"
import { ContentFeed } from "@/features/dashboard/components/content-feed"
import { DiscoverDevelopers } from "@/features/dashboard/components/discover-developers"
import { MessagesOverlay } from "@/features/dashboard/components/messages-overlay"

function DashboardContent() {
   const [user, setUser] = React.useState<any>(null)
   const [profile, setProfile] = React.useState<any>(null)
   const [isLoading, setIsLoading] = React.useState(true)
   const [activeTab, setActiveTabRaw] = React.useState<string>("all")
   const [isMessagesOpen, setIsMessagesOpen] = React.useState(false)
   const [posts, setPosts] = React.useState<any[]>([])
   const [allProfiles, setAllProfiles] = React.useState<any[]>([])
   const [discoverSearch, setDiscoverSearch] = React.useState("")
   const [myConnections, setMyConnections] = React.useState<any[]>([])
   const [userLikes, setUserLikes] = React.useState<string[]>([])
   const [isPosting, setIsPosting] = React.useState(false)
   const [guidedFields, setGuidedFields] = React.useState<Record<string, string>>({
      blocker: "", stack: "", context: "",
      role: "", project: "", mission: "",
      projectName: "", description: "", link: ""
   })

   const supabase = createClient()
   const router = useRouter()
   const pathname = usePathname()
   const searchParams = useSearchParams()

   const setActiveTab = (tab: string) => {
      setActiveTabRaw(tab)
      const params = new URLSearchParams(searchParams?.toString())
      params.set("tab", tab)
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
   }

   React.useEffect(() => {
      const tab = searchParams?.get("tab")
      if (tab && tab !== activeTab) {
         setActiveTabRaw(tab)
      }
   }, [searchParams])

   const fetchPosts = async () => {
      const { data, error } = await supabase
         .from('posts')
         .select(`*, profiles!user_id (full_name, role)`)
         .order('created_at', { ascending: false })
         .limit(20)

      if (!error && data) {
         setPosts(data.map((p: any) => ({
            id: p.id,
            userId: p.user_id,
            user: p.profiles?.full_name || 'Anonymous',
            role: p.profiles?.role || 'Developer',
            timestamp: new Date(p.created_at).toLocaleDateString(),
            content: p.content,
            type: p.type,
            likes: p.likes_count || 0,
            comments: p.comments_count || 0,
            tags: p.tags || []
         })))
      }
   }

   const fetchUserLikes = async (userId: string) => {
      const { data } = await supabase
         .from('post_likes')
         .select('post_id')
         .eq('user_id', userId)
      if (data) setUserLikes(data.map((l: any) => l.post_id))
   }

   const fetchMyConnections = async (userId: string) => {
      const { data } = await supabase
         .from('connections')
         .select('*')
         .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      if (data) setMyConnections(data)
   }

   React.useEffect(() => {
      async function getSession() {
         const { data: { session } } = await supabase.auth.getSession()
         if (!session) {
            router.push('/join')
            return
         }
         setUser(session.user)

         const { data: profileRecord, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()

         if (profileError || !profileRecord) {
            router.push('/onboarding')
            return
         }

         setProfile(profileRecord)
         await fetchPosts()
         await fetchUserLikes(session.user.id)
         await fetchMyConnections(session.user.id)
         setIsLoading(false)
      }
      getSession()
   }, [])

   const handlePost = async () => {
      let content = ""
      let postType = "HELP"

      if (activeTab === "help" || activeTab === "all") {
         content = `BLOCKER: ${guidedFields.blocker}\nSTACK: ${guidedFields.stack}\nCONTEXT: ${guidedFields.context}`
         postType = "HELP"
      } else if (activeTab === "teams") {
         content = `ROLE NEEDED: ${guidedFields.role}\nPROJECT: ${guidedFields.project}\nMISSION: ${guidedFields.mission}`
         postType = "TEAM"
      } else if (activeTab === "projects") {
         content = `PROJECT: ${guidedFields.projectName}\nDESCRIPTION: ${guidedFields.description}\nLINK: ${guidedFields.link}`
         postType = "PROJECT"
      }

      if (!content.trim() || !user?.id) {
         toast.error("Fragment sync failed")
         return
      }

      if (isPosting) return
      setIsPosting(true)

      const { error } = await supabase
         .from('posts')
         .insert([{
            user_id: user.id,
            type: postType,
            content: content,
            tags: content.match(/#\w+/g)?.map(t => t.slice(1)) || []
         }])

      if (!error) {
         setGuidedFields({
            blocker: "", stack: "", context: "",
            role: "", project: "", mission: "",
            projectName: "", description: "", link: ""
         })
         await fetchPosts()
         toast.success("Fragment synchronized successfully")
      }
      setIsPosting(false)
   }

   const handleLike = async (postId: string) => {
      if (!user) return
      
      const isLiked = userLikes.includes(postId)
      
      if (isLiked) {
         // Optimistic UI update
         setUserLikes(prev => prev.filter(id => id !== postId))
         setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: Math.max(0, p.likes - 1) } : p))
         
         const { error } = await supabase
            .from('post_likes')
            .delete()
            .eq('post_id', postId)
            .eq('user_id', user.id)
            
         if (error) {
            // Revert on error
            await fetchUserLikes(user.id)
            await fetchPosts()
         }
      } else {
         // Optimistic UI update
         setUserLikes(prev => [...prev, postId])
         setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p))
         
         const { error } = await supabase
            .from('post_likes')
            .insert([{ post_id: postId, user_id: user.id }])
            
         if (error) {
            // Revert on error
            await fetchUserLikes(user.id)
            await fetchPosts()
         }
      }
   }

   const handleConnect = async (targetUserId: string) => {
      if (!user || user.id === targetUserId) return
      const { error } = await supabase
         .from('connections')
         .insert([{ sender_id: user.id, receiver_id: targetUserId, status: 'PENDING' }])

      if (!error) {
         await fetchMyConnections(user.id)
      }
   }

   const getConnectionStatus = (profileId: string) => {
      if (!user) return null
      if (user.id === profileId) return 'SELF'
      const conn = myConnections.find(c =>
         (c.sender_id === user.id && c.receiver_id === profileId) ||
         (c.sender_id === profileId && c.receiver_id === user.id)
      )
      return conn ? conn.status : null
   }

   const fetchAllProfiles = async () => {
      const { data, error } = await supabase
         .from('profiles')
         .select('*')
         .order('updated_at', { ascending: false })
      if (!error && data) setAllProfiles(data)
   }

   React.useEffect(() => {
      if (activeTab === "discover" && allProfiles.length === 0) {
         fetchAllProfiles()
      }
   }, [activeTab])

   const handleDeletePost = async (postId: string) => {
      const { error } = await supabase.from('posts').delete().eq('id', postId)
      if (!error) await fetchPosts()
   }

   if (isLoading) {
      return (
         <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-6">
            <div className="h-16 w-16 md:h-20 md:w-20 rounded-full border-t-2 border-primary animate-spin" />
            <div className="space-y-1">
               <p className="text-[12px] md:text-[13px] font-black uppercase tracking-[0.3em] text-primary animate-pulse">Initializing Data</p>
               <div className="h-0.5 w-64 bg-secondary overflow-hidden">
                  <div className="h-full bg-primary animate-progress" />
               </div>
            </div>
         </div>
      )
   }

   return (
      <div className="min-h-[100dvh] bg-background text-foreground flex flex-col font-outfit selection:bg-primary/20">
         <GlobalHeader>
            <div className="hidden lg:flex items-center gap-10">
               <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-sm bg-primary flex items-center justify-center text-background font-black text-xs">
                     {profile?.full_name?.[0] || 'U'}
                  </div>
                  <div className="flex flex-col items-start leading-none">
                     <p className="text-[14px] font-bold tracking-tight text-foreground">{profile?.full_name}</p>
                     <p className="text-[10px] font-medium text-muted-foreground/40 uppercase tracking-widest mt-0.5">{profile?.role || 'Technical Peer'}</p>
                  </div>
               </div>
               <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)] animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/30">Node Active</span>
               </div>
            </div>
         </GlobalHeader>

         <main className="flex-1 flex justify-center w-full">
            <div className="w-full max-w-[1440px] px-4 md:px-6 py-6 md:py-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 pb-24 lg:pb-0">
               <div className="hidden lg:block lg:col-span-3 space-y-8">
                  <div className="p-8 bg-secondary/20 border border-border/10 rounded-sm space-y-6">
                     <div className="space-y-1">
                        <h3 className="text-[12px] font-black uppercase tracking-widest text-primary/60">Professional Node</h3>
                        <p className="text-[20px] font-medium text-foreground tracking-tight">{profile?.full_name}</p>
                     </div>
                     <div className="flex flex-wrap gap-2">
                        {profile?.skills?.map((skill: string) => (
                           <span key={skill} className="px-2 py-1 bg-background/50 border border-border/20 text-[9px] font-bold text-muted-foreground/60 rounded-sm">{skill}</span>
                        ))}
                     </div>
                  </div>
               </div>

               <div className="lg:col-span-9 space-y-8">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/10 pb-6">
                     <div className="space-y-2">
                        <div className="flex items-center gap-4">
                           <div className="h-1 w-12 bg-primary/20" />
                           <p className="text-[11px] font-black uppercase tracking-[0.4em] text-primary/40">Technical Ecosystem</p>
                        </div>
                        <h1 className="text-[32px] md:text-[44px] font-medium tracking-tighter leading-none">
                           Developer <span className="text-primary italic">Dashboard</span>
                        </h1>
                     </div>
                  </div>

                  <DashboardNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

                  {activeTab === "discover" ? (
                     <DiscoverDevelopers
                        allProfiles={allProfiles}
                        user={user}
                        discoverSearch={discoverSearch}
                        setDiscoverSearch={setDiscoverSearch}
                        handleConnect={handleConnect}
                        getConnectionStatus={getConnectionStatus}
                     />
                  ) : activeTab === "leaderboard" ? (
                      <div className="p-12 text-center text-muted-foreground">Networking Leaderboard coming soon.</div>
                  ) : (
                     <div className="space-y-10">
                        <PostCreator
                           activeTab={activeTab}
                           guidedFields={guidedFields}
                           setGuidedFields={setGuidedFields}
                           isPosting={isPosting}
                           handlePost={handlePost}
                        />
                        <ContentFeed
                           posts={posts.filter((p: any) => activeTab === 'all' || p.type === (activeTab === 'teams' ? 'TEAM' : activeTab === 'projects' ? 'PROJECT' : 'HELP'))}
                           user={user}
                           userLikes={userLikes}
                           handleDeletePost={handleDeletePost}
                           handleConnect={handleConnect}
                           handleLike={handleLike}
                        />
                     </div>
                  )}
               </div>
            </div>
         </main>

         <MobileNavPill activeTab={activeTab} setActiveTab={setActiveTab} router={router} />
         <MessagesOverlay isOpen={isMessagesOpen} setIsOpen={setIsMessagesOpen} />
      </div>
   )
}

export default function DashboardPage() {
   return (
      <Suspense fallback={
         <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-6">
            <div className="h-16 w-16 md:h-20 md:w-20 rounded-full border-t-2 border-primary animate-spin" />
            <div className="space-y-1 text-center">
               <p className="text-[12px] md:text-[13px] font-black uppercase tracking-[0.3em] text-primary animate-pulse">Synchronizing Node</p>
               <div className="h-0.5 w-64 bg-secondary overflow-hidden">
                  <div className="h-full bg-primary animate-progress" />
               </div>
            </div>
         </div>
      }>
         <DashboardContent />
      </Suspense>
   )
}
