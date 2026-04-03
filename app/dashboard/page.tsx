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
import { PostCreator } from "@/features/dashboard/components/post-creator"
import { ContentFeed } from "@/features/dashboard/components/content-feed"
import { DiscoverDevelopers } from "@/features/dashboard/components/discover-developers"
import { MessagesOverlay } from "@/features/dashboard/components/messages-overlay"
import { Sidebar } from "@/features/dashboard/components/sidebar"

function DashboardContent() {
   const [user, setUser] = React.useState<any>(null)
   const [profile, setProfile] = React.useState<any>(null)
   const [isLoading, setIsLoading] = React.useState(true)
   const [activeTab, setActiveTabRaw] = React.useState<string>("all")

   const [posts, setPosts] = React.useState<any[]>([])
   const [isMessagesOpen, setIsMessagesOpen] = React.useState(false)
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

   const headerInfo = React.useMemo(() => {
      switch (activeTab) {
         case "discover":
            return { title: "Discover Developers", subtitle: "Connect with technical experts across Bhutan" }
         case "teams":
         case "team-needed":
            return { title: "Project Teams", subtitle: "Find the right partners for your next build" }
         case "leaderboard":
            return { title: "Networking Leaderboard", subtitle: "Recognizing high-impact technical contributors" }
         case "post-update":
            return { title: "Guided Update", subtitle: "Share your latest technical breakthrough" }
         case "dev-needed":
            return { title: "Find Developers", subtitle: "Recruit technical talent for your blockers" }
         case "share-project":
            return { title: "Launch Project", subtitle: "Showcase your work to the network" }
         default:
            return { title: <>Developer <span className="text-primary">Dashboard</span></>, subtitle: null }
      }
   }, [activeTab])

   const feedItems = React.useMemo(() => {
      const basePosts = posts.map((p: any) => {
         // Remap HELP posts containing "MILESTONE:" to "UPDATE" type for UI distinction
         if (p.type === 'HELP' && p.content?.includes('MILESTONE:')) {
            return { ...p, type: 'UPDATE' };
         }
         return p;
      }).filter((p: any) => {
         if (activeTab === 'all') return true;
         const isHelpType = ["help", "dev-needed"].includes(activeTab);
         const isTeamType = ["teams", "team-needed"].includes(activeTab);
         const isProjectType = ["projects", "share-project"].includes(activeTab);

         if (activeTab === 'post-update') return p.type === 'UPDATE';
         if (isHelpType) return p.type === 'HELP';
         if (isTeamType) return p.type === 'TEAM';
         if (isProjectType) return p.type === 'PROJECT';
         return false;
      });

      if (activeTab !== 'all') return basePosts;

      // Aggregated Feed (Network View)
      const memberUpdates = allProfiles.slice(0, 3).map(p => ({
         id: `dev-${p.id}`,
         userId: p.id,
         user: p.full_name || 'Anonymous',
         role: p.role || 'Developer',
         timestamp: new Date(p.updated_at).toLocaleTimeString(),
         created_at: p.updated_at,
         content: p.bio || "Building the tech future of Bhutan.",
         type: 'DEVELOPER' as const,
         likes: 0,
         comments: 0,
         tags: [],
         skills: p.skills || []
      }));

      return [...basePosts, ...memberUpdates].sort((a, b) => {
         const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
         const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
         return dateB - dateA;
      });
   }, [posts, allProfiles, activeTab])

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

      if (!error && data && data.length > 0) {
         setPosts(data.map((p: any) => ({
            id: p.id,
            userId: p.user_id,
            user: p.profiles?.full_name || 'Anonymous',
            role: p.profiles?.role || 'Developer',
            timestamp: new Date(p.created_at).toLocaleDateString(),
            created_at: p.created_at,
            content: p.content,
            type: p.type,
            likes: p.likes_count || 0,
            comments: p.comments_count || 0,
            tags: p.tags || []
         })))
      } else {
         // High-quality mock posts for Bhutanese Developer Network
         setPosts([
            {
               id: 'mock-1',
               userId: 'm-1',
               user: 'Karma Wangchuk',
               role: 'Lead Architect',
               timestamp: 'Just now',
               content: 'Just deployed the BhutanDevs-Auth v2.0 update. We finally have biometric passkeys integrated! 🚀 #Passkeys #Auth',
               type: 'PROJECT',
               likes: 12,
               comments: 4,
               tags: ['Passkeys', 'Auth']
            },
            {
               id: 'mock-2',
               userId: 'm-2',
               user: 'Pema Lhaden',
               role: 'Full-stack Dev',
               timestamp: '2h ago',
               content: 'Blocking on a Deep Linking issue with React Native and Supabase Auth. Has anyone in the network solved the domain verification for our locally hosted instances? #Supabase #ReactNative #HelpNeeded',
               type: 'HELP',
               likes: 5,
               comments: 8,
               tags: ['Supabase', 'ReactNative', 'HelpNeeded']
            },
            {
               id: 'mock-3',
               userId: 'm-3',
               user: 'Sonam Namgay',
               role: 'DevOps Engineer',
               timestamp: '5h ago',
               content: 'ROLE NEEDED: Senior Frontend Developer\\nPROJECT: AgriTech Bhutan Dashboard\\nMISSION: Build a real-time data visualization platform for local farmers using Next.js and Tremor. DM if interested! #Hiring #AgriTech',
               type: 'TEAM',
               likes: 21,
               comments: 6,
               tags: ['Hiring', 'AgriTech']
            },
            {
               id: 'mock-4',
               userId: 'm-4',
               user: 'Dechen Dorji',
               role: 'Product Manager',
               timestamp: '1d ago',
               content: 'Check out our new Dzongkha Natural Language Processing API! We spent 6 months fine-tuning this model at the Thimphu AI Lab. Looking for beta testers! #AI #Dzongkha #NLP',
               type: 'PROJECT',
               likes: 45,
               comments: 12,
               tags: ['AI', 'Dzongkha', 'NLP']
            },
            {
               id: 'mock-5',
               userId: 'm-5',
               user: 'Tashi Tshering',
               role: 'UI Designer',
               timestamp: '2d ago',
               content: 'Just published the "Bhutanese Modern" design kit for Figma. Includes cultural icons and high-contrast accessibility themes! #DesignSystem #UI #Bhutan',
               type: 'PROJECT',
               likes: 33,
               comments: 7,
               tags: ['DesignSystem', 'UI', 'Bhutan']
            }
         ])
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

      const isHelpType = ["help", "post-update", "dev-needed", "all"].includes(activeTab)
      const isTeamType = ["teams", "team-needed"].includes(activeTab)
      const isProjectType = ["projects", "share-project"].includes(activeTab)

      if (activeTab === "post-update") {
         content = `MILESTONE: ${guidedFields.blocker}\nSTACK: ${guidedFields.stack}\nCONTEXT: ${guidedFields.context}`
         postType = "HELP" // Stored as HELP for DB check, remapped in UI
      } else if (isHelpType) {
         content = `BLOCKER: ${guidedFields.blocker}\nSTACK: ${guidedFields.stack}\nCONTEXT: ${guidedFields.context}`
         postType = "HELP"
      } else if (isTeamType) {
         content = `ROLE NEEDED: ${guidedFields.role}\nPROJECT: ${guidedFields.project}\nMISSION: ${guidedFields.mission}`
         postType = "TEAM"
      } else if (isProjectType) {
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
      fetchAllProfiles()
   }, [])

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
      <div className="min-h-[100dvh] bg-background text-foreground flex flex-col font-outfit selection:bg-primary/20 overflow-y-auto scrollbar-hide">
         <GlobalHeader />

         <main className="flex-1 flex justify-center w-full">
            <div className="w-full max-w-[1440px] px-4 md:px-8 lg:px-12 py-2 md:py-4 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pb-24 lg:pb-0 relative">
               <div className="hidden lg:block lg:col-span-3">
                  <Sidebar
                     activeTab={activeTab}
                     setActiveTab={setActiveTab}
                     setIsMessagesOpen={setIsMessagesOpen}
                     className="sticky top-20"
                  />
               </div>

               <div className="lg:col-span-9 space-y-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border/10 pt-2 pb-4">
                     <div className="flex flex-col justify-center space-y-1 text-left">
                        <h1 className="text-[26px] md:text-[34px] font-medium tracking-tighter leading-none">
                           {headerInfo.title}
                        </h1>
                        <div className="h-[20px]">
                           {headerInfo.subtitle && (
                              <p className="text-[14px] font-medium text-muted-foreground/50 animate-in fade-in duration-300">{headerInfo.subtitle}</p>
                           )}
                        </div>
                     </div>
                     <div className="flex items-center gap-2 min-w-0 md:min-w-[256px] justify-end">
                        {["discover", "teams"].includes(activeTab) && (
                           <div className="relative w-full md:w-auto animate-in fade-in slide-in-from-right-2 duration-300">
                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/30" />
                              <input
                                 type="text"
                                 placeholder={activeTab === "teams" ? "Search teams or projects..." : "Search by skill or name..."}
                                 className="pl-10 pr-4 py-2 bg-secondary/20 border border-border/10 rounded-sm text-[13px] focus:outline-none focus:border-primary/40 w-full md:w-64"
                                 value={discoverSearch}
                                 onChange={(e) => setDiscoverSearch(e.target.value)}
                              />
                           </div>
                        )}
                     </div>
                  </div>

                  {activeTab === "discover" ? (
                     <DiscoverDevelopers
                        allProfiles={allProfiles}
                        user={user}
                        discoverSearch={discoverSearch}
                        setDiscoverSearch={setDiscoverSearch}
                        handleConnect={handleConnect}
                        getConnectionStatus={getConnectionStatus}
                     />
                  ) : activeTab === "teams" ? (
                     <div className="space-y-10">
                        <ContentFeed
                           isGrid={true}
                           posts={posts.filter((p: any) => p.type === 'TEAM' && (discoverSearch === "" || p.content.toLowerCase().includes(discoverSearch.toLowerCase())))}
                           user={user}
                           userLikes={userLikes}
                           handleDeletePost={handleDeletePost}
                           handleConnect={handleConnect}
                           handleLike={handleLike}
                        />
                     </div>
                  ) : activeTab === "leaderboard" ? (
                     <div className="p-12 text-center text-muted-foreground animate-in fade-in duration-500">Networking Leaderboard coming soon.</div>
                  ) : (
                     <div className="space-y-10">
                        <PostCreator
                           activeTab={activeTab}
                           guidedFields={guidedFields}
                           setGuidedFields={setGuidedFields}
                           isPosting={isPosting}
                           handlePost={handlePost}
                        />
                        {activeTab === "all" && (
                           <ContentFeed
                              posts={feedItems}
                              user={user}
                              userLikes={userLikes}
                              handleDeletePost={handleDeletePost}
                              handleConnect={handleConnect}
                              handleLike={handleLike}
                           />
                        )}
                     </div>
                  )}
               </div>
            </div>
         </main>


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
