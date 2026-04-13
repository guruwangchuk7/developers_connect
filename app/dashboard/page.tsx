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
   HelpCircle,
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
import { Help } from "@/features/dashboard/components/help"
import { FeedSkeleton, SidebarSkeleton, HeaderSkeleton, EventSkeleton } from "@/features/dashboard/components/skeletons"

function DashboardContent() {
   const [user, setUser] = React.useState<any>(null)
   const [profile, setProfile] = React.useState<any>(null)
   const [isInitializing, setIsInitializing] = React.useState(true)
   const [isDataLoading, setIsDataLoading] = React.useState(true)
   const [activeTab, setActiveTabRaw] = React.useState<string>("all")

   const [posts, setPosts] = React.useState<any[]>([])
   const [isMessagesOpen, setIsMessagesOpen] = React.useState(false)
   const [allProfiles, setAllProfiles] = React.useState<any[]>([])
   const [discoverSearch, setDiscoverSearch] = React.useState("")
   const [myConnections, setMyConnections] = React.useState<any[]>([])
   const [userLikes, setUserLikes] = React.useState<string[]>([])
   const [events, setEvents] = React.useState<any[]>([])
   const [isPosting, setIsPosting] = React.useState(false)
   const [guidedFields, setGuidedFields] = React.useState<Record<string, string>>({
      blocker: "", stack: "", context: "",
      role: "", project: "", mission: "",
      projectName: "", description: "", link: "",
      eventTitle: "", eventVenue: "", eventDate: "", eventEndDate: "", eventDescription: "", eventPoster: ""
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
         case "dev-needed":
            return { title: "Project Teams", subtitle: "Find the right partners for your next build" }
         case "post-update":
            return { title: "Guided Update", subtitle: "Share your latest technical breakthrough" }
         case "ask-help":
            return { title: "Request Assistance", subtitle: "Get technical help from the community for your project" }
         case "share-project":
            return { title: "Launch Project", subtitle: "Showcase your work to the network" }
         case "organize-event":
            return { title: "Initiate Event", subtitle: "Organize workshops, meetups, or hackathons" }
         case "projects":
            return { title: "Technical Projects", subtitle: "Browse through the national development repository" }
         case "events":
            return { title: "Community Events", subtitle: "Workshops, hackathons, and local gatherings" }
         case "help":
            return { title: "Resource Exchange", subtitle: "Peer-to-peer technical support and documentation" }
         case "help-guide":
            return { title: "Synchronization Guide", subtitle: "Maximizing your professional impact in the network" }
         default:
            return { title: <>Developer <span className="text-primary">Dashboard</span></>, subtitle: null }
      }
   }, [activeTab])

   const feedItems = React.useMemo(() => {
      const basePosts = posts.filter((p: any) => {
         if (activeTab === 'all') return true;

         if (activeTab === 'post-update') return p.type === 'UPDATE';
         if (activeTab === 'help' || activeTab === 'ask-help') return p.type === 'HELP';
         if (activeTab === 'teams' || activeTab === 'dev-needed') return p.type === 'TEAM';
         if (activeTab === 'projects' || activeTab === 'share-project') return p.type === 'PROJECT';

         return false;
      });

      if (activeTab !== 'all') return basePosts;

      return basePosts.sort((a, b) => {
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
         .select(`*, profiles!user_id (full_name, role, avatar_url)`)
         .order('created_at', { ascending: false })
         .limit(20)

      if (!error && data && data.length > 0) {
         setPosts(data.map((p: any) => ({
            id: p.id,
            userId: p.user_id,
            user: p.profiles?.full_name || 'Anonymous',
            role: p.profiles?.role || 'Developer',
            avatar_url: p.profiles?.avatar_url,
            timestamp: new Date(p.created_at).toLocaleDateString(),
            created_at: p.created_at,
            content: p.content,
            type: p.type,
            likes: p.likes_count || 0,
            comments: p.comments_count || 0,
            tags: p.tags || []
         })))
      } else {
         setPosts([])
      }
   }

   const fetchEvents = async () => {
      const { data } = await supabase
         .from('events')
         .select(`*, profiles!organizer_id (full_name)`)
         .order('event_date', { ascending: true })
      if (data) setEvents(data)
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

   const fetchAllProfiles = async () => {
      const { data, error } = await supabase
         .from('profiles')
         .select('*')
         .order('updated_at', { ascending: false })
      if (!error && data) setAllProfiles(data)
   }

   React.useEffect(() => {
      async function init() {
         const { data: { session } } = await supabase.auth.getSession()
         if (!session) {
            router.push('/join')
            return
         }
         setUser(session.user)
         setIsInitializing(false)

         // Parallelize all data fetching
         await Promise.all([
            // 1. Fetch Profile
            supabase
               .from('profiles')
               .select('*')
               .eq('id', session.user.id)
               .single()
               .then(async ({ data }: { data: any }) => {
                  if (data) {
                     setProfile(data);
                     // Identity Matrix: Sync avatar and email if missing in DB but present in metadata
                     const metaAvatar = session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture;
                     const metaEmail = session.user.email;
                     const needsUpdate = (!data.avatar_url && metaAvatar) || (!data.email && metaEmail);
                     
                     if (needsUpdate) {
                        const { error } = await supabase
                           .from('profiles')
                           .update({ 
                              avatar_url: data.avatar_url || metaAvatar,
                              email: data.email || metaEmail 
                           })
                           .eq('id', session.user.id);
                        
                        if (!error) {
                           setProfile({ ...data, avatar_url: data.avatar_url || metaAvatar, email: data.email || metaEmail });
                           // Refresh posts to show the new identity details immediately
                           fetchPosts();
                        }
                     }
                  }
               }),
            
            // 2. Fetch Content
            fetchPosts(),
            fetchEvents(),
            fetchUserLikes(session.user.id),
            fetchMyConnections(session.user.id),
            fetchAllProfiles()
         ])

         setIsDataLoading(false)

         const interval = setInterval(() => {
            fetchPosts()
            fetchEvents()
         }, 20000) // Increased interval slightly for better performance

         return () => clearInterval(interval)
      }
      init()
   }, [])

   const handlePost = async () => {
      let content = ""
      let postType = "HELP"

      const isHelpType = ["help", "ask-help"].includes(activeTab)
      const isTeamType = ["teams", "dev-needed"].includes(activeTab)
      const isProjectType = ["projects", "share-project"].includes(activeTab)

      if (activeTab === "post-update") {
         content = `MILESTONE: ${guidedFields.blocker}\nSTACK: ${guidedFields.stack}\nCONTEXT: ${guidedFields.context}`
         postType = "UPDATE"
      } else if (activeTab === "ask-help") {
         content = `BLOCKER: ${guidedFields.blocker}\nSTACK: ${guidedFields.stack}\nCONTEXT: ${guidedFields.context}`
         postType = "HELP"
      } else if (activeTab === "dev-needed") {
         content = `ROLE NEEDED: ${guidedFields.role}\nPROJECT: ${guidedFields.project}\nMISSION: ${guidedFields.mission}`
         postType = "TEAM"
      } else if (activeTab === "share-project") {
         content = `PROJECT: ${guidedFields.projectName}\nDESCRIPTION: ${guidedFields.description}\nLINK: ${guidedFields.link}`
         postType = "PROJECT"
      }

      if (activeTab === "organize-event") {
         if (!guidedFields.eventTitle.trim() || !user?.id) {
            toast.error("Event synthesis failed")
            return
         }

         if (isPosting) return
         setIsPosting(true)

         const { error } = await supabase
            .from('events')
            .insert([{
               organizer_id: user.id,
               title: guidedFields.eventTitle,
               venue: guidedFields.eventVenue,
               event_date: guidedFields.eventDate || new Date().toISOString(),
               description: guidedFields.eventDescription + (guidedFields.eventEndDate ? `\nEND_DATE: ${guidedFields.eventEndDate}` : ""),
               image_url: guidedFields.eventPoster || null
            }])

         if (!error) {
            setGuidedFields({
               blocker: "", stack: "", context: "",
               role: "", project: "", mission: "",
               projectName: "", description: "", link: "",
               eventTitle: "", eventVenue: "", eventDate: "", eventEndDate: "", eventDescription: "", eventPoster: ""
            })
            await fetchEvents()
            setActiveTab("events")
            toast.success("Event broadcasted successfully")
         } else {
            toast.error("Broadcast interruption: " + error.message)
         }
         setIsPosting(false)
         return
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
            projectName: "", description: "", link: "",
            eventTitle: "", eventVenue: "", eventDate: "", eventEndDate: "", eventDescription: "", eventPoster: ""
         })
         await fetchPosts()
         setActiveTab("all") // Redirect to feed to see the post
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

   const handleDeletePost = async (postId: string) => {
      const { error } = await supabase.from('posts').delete().eq('id', postId)
      if (!error) await fetchPosts()
   }

   return (
      <div className="min-h-[100dvh] bg-background text-foreground flex flex-col font-sans selection:bg-primary/20 overflow-y-auto scrollbar-hide">
         <GlobalHeader />

         <main className="flex-1 flex justify-center w-full">
            <div className="w-full max-w-[1440px] px-4 md:px-8 lg:px-12 py-2 md:py-4 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pb-24 lg:pb-0 relative">
               <div className="hidden lg:block lg:col-span-3">
                  {isInitializing ? (
                     <SidebarSkeleton />
                  ) : (
                     <Sidebar
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        setIsMessagesOpen={setIsMessagesOpen}
                        className="sticky top-20"
                     />
                  )}
               </div>

               <div className="lg:col-span-9 space-y-8">
                  {isInitializing ? (
                     <HeaderSkeleton />
                  ) : (
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
                  )}

                  {isDataLoading ? (
                     activeTab === "discover" ? <FeedSkeleton isGrid /> :
                     activeTab === "teams" || activeTab === "projects" ? <FeedSkeleton isGrid /> :
                     activeTab === "events" ? <EventSkeleton /> :
                     <FeedSkeleton />
                  ) : (
                     activeTab === "discover" ? (
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
                     ) : activeTab === "projects" ? (
                        <div className="space-y-10">
                           <ContentFeed
                              isGrid={true}
                              posts={posts.filter((p: any) => p.type === 'PROJECT' && (discoverSearch === "" || p.content.toLowerCase().includes(discoverSearch.toLowerCase())))}
                              user={user}
                              userLikes={userLikes}
                              handleDeletePost={handleDeletePost}
                              handleConnect={handleConnect}
                              handleLike={handleLike}
                           />
                        </div>
                     ) : activeTab === "help" ? (
                        <div className="space-y-10">
                           <ContentFeed
                              posts={posts.filter((p: any) => p.type === 'HELP')}
                              user={user}
                              userLikes={userLikes}
                              handleDeletePost={handleDeletePost}
                              handleConnect={handleConnect}
                              handleLike={handleLike}
                           />
                        </div>
                     ) : activeTab === "events" ? (
                        <div className="space-y-8">
                           <div className="flex items-center justify-between">
                              <h3 className="text-xl font-bold tracking-tight">Active synchronization nodes</h3>
                              <button
                                 onClick={() => setActiveTab("organize-event")}
                                 className="px-6 py-2 bg-primary text-background text-[11px] font-bold rounded-sm hover:opacity-90 transition-all uppercase tracking-widest flex items-center gap-2"
                              >
                                 <Plus className="h-3.5 w-3.5" /> Organize Event
                              </button>
                           </div>
                           {events.length > 0 ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                 {events.map((event) => {
                                    const hasPoster = !!event.image_url
                                    const endDateMatch = event.description?.match(/END_DATE: (.*)/)
                                    const endDate = endDateMatch ? endDateMatch[1] : null
                                    const cleanDescription = event.description?.replace(/END_DATE: (.*)/, '').trim()

                                    return (
                                       <div key={event.id} className="bg-background border border-border/40 rounded-sm overflow-hidden flex flex-col hover:border-primary/20 transition-all group">
                                          {hasPoster && (
                                             <div className="aspect-video w-full overflow-hidden border-b border-border/10">
                                                <img src={event.image_url} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                             </div>
                                          )}
                                          <div className="p-6 space-y-4 flex-1 flex flex-col">
                                             <div className="flex justify-between items-start">
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-primary/60">Community Event</span>
                                                <div className="flex flex-col items-end gap-1">
                                                   <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 bg-secondary rounded-full">
                                                      {new Date(event.event_date).toLocaleDateString()}
                                                   </span>
                                                   {endDate && (
                                                      <span className="text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 border border-border/40 rounded-full text-muted-foreground">
                                                         Ends: {new Date(endDate).toLocaleDateString()}
                                                      </span>
                                                   )}
                                                </div>
                                             </div>
                                             <div className="space-y-2 flex-1">
                                                <h4 className="text-lg font-bold tracking-tight group-hover:text-primary transition-colors line-clamp-1">{event.title}</h4>
                                                <p className="text-[13px] text-muted-foreground line-clamp-3 leading-relaxed">{cleanDescription}</p>
                                             </div>
                                             <div className="pt-4 border-t border-border/20 flex items-center justify-between mt-auto">
                                                <div className="flex items-center gap-2">
                                                   <div className="h-5 w-5 rounded-full bg-secondary flex items-center justify-center text-[8px] font-black italic">
                                                      {event.profiles?.full_name?.[0] || 'A'}
                                                   </div>
                                                   <span className="text-[10px] font-bold text-muted-foreground/60">{event.profiles?.full_name || 'Anonymous'}</span>
                                                </div>
                                                <span className="text-[10px] font-bold text-muted-foreground/40">{event.venue}</span>
                                             </div>
                                          </div>
                                       </div>
                                    )
                                 })}
                              </div>
                           ) : (
                              <div className="py-24 text-center border border-dashed border-border/30 rounded-xl bg-secondary/5">
                                 <div className="h-12 w-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Trophy className="h-6 w-6 text-primary" />
                                 </div>
                                 <h3 className="text-xl font-bold tracking-tight mb-2">Upcoming Community Events</h3>
                                 <p className="text-muted-foreground max-w-sm mx-auto">No events scheduled. Be the first to organize a workshop or hackathon!</p>
                              </div>
                           )}
                        </div>
                     ) : activeTab === "help-guide" ? (
                        <Help />
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
                     )
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
      <Suspense fallback={null}>
         <DashboardContent />
      </Suspense>
   )
}
