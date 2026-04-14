"use client"

import * as React from "react"
import { createClient } from "@/lib/supabase"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { toast } from "sonner"
import { FeedPost, Profile, Event as DashboardEvent, Connection, Notification } from "@/types"

import { PostsService } from "@/lib/services/posts.service"
import { ProfilesService } from "@/lib/services/profiles.service"

export function useDashboardData() {
   const [user, setUser] = React.useState<any>(null)
   const [profile, setProfile] = React.useState<Profile | null>(null)
   const [isInitializing, setIsInitializing] = React.useState(true)
   const [isDataLoading, setIsDataLoading] = React.useState(true)
   const [activeTab, setActiveTabRaw] = React.useState<string>("all")

   const [posts, setPosts] = React.useState<FeedPost[]>([])
   const [allProfiles, setAllProfiles] = React.useState<Profile[]>([])
   const [myConnections, setMyConnections] = React.useState<any[]>([])
   const [notifications, setNotifications] = React.useState<Notification[]>([])
   const [pendingRequests, setPendingRequests] = React.useState<any[]>([])
   const [userLikes, setUserLikes] = React.useState<string[]>([])
   const [events, setEvents] = React.useState<DashboardEvent[]>([])
   const [isPosting, setIsPosting] = React.useState(false)
   const [discoverSearch, setDiscoverSearch] = React.useState("")

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

   const fetchPosts = async () => {
      try {
         const data = await PostsService.getAll(30)
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
      } catch (e) {
         console.error("Posts sync failed", e)
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
      try {
         const likedPostIds = await PostsService.getUserLikes(userId)
         setUserLikes(likedPostIds)
      } catch (e) {
         console.error("Likes sync failed", e)
      }
   }

   const fetchMyConnections = async (userId: string) => {
      const { data } = await supabase
         .from('connections')
         .select(`*, 
            sender:profiles!sender_id(id, full_name, avatar_url, role),
            receiver:profiles!receiver_id(id, full_name, avatar_url, role)
         `)
         .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      
      if (data) {
         setMyConnections(data)
         setPendingRequests(data.filter((c: any) => c.receiver_id === userId && c.status === 'PENDING'))
      }
   }

   const fetchNotifications = async (userId: string) => {
      const { data } = await supabase
         .from('notifications')
         .select('*')
         .eq('user_id', userId)
         .order('created_at', { ascending: false })
      if (data) setNotifications(data)
   }

   const fetchAllProfiles = async () => {
      try {
         const data = await ProfilesService.getAll(100)
         setAllProfiles(data)
      } catch (e) {
         console.error("Profiles sync failed", e)
      }
   }

   const handleLike = async (postId: string) => {
      if (!user) return
      const isLiked = userLikes.includes(postId)
      try {
         if (isLiked) {
            setUserLikes(prev => prev.filter(id => id !== postId))
            await PostsService.unlike(postId, user.id)
         } else {
            setUserLikes(prev => [...prev, postId])
            await PostsService.like(postId, user.id)
         }
      } catch (e) {
         fetchUserLikes(user.id)
         fetchPosts()
      }
   }

   const handleConnect = async (targetUserId: string) => {
      if (!user || user.id === targetUserId) return
      const { error } = await supabase.from('connections').insert([{ sender_id: user.id, receiver_id: targetUserId, status: 'PENDING' }])
      if (!error) {
         await supabase.from('notifications').insert([{
            user_id: targetUserId, type: 'CONNECTION', actor_id: user.id,
            content: `${user.user_metadata?.full_name || 'A developer'} wants to connect with you.`,
            link: '/dashboard?tab=discover'
         }])
         fetchMyConnections(user.id)
         toast.success("Connection request sent!")
      } else {
         toast.error("Failed to send request")
      }
   }

   const handleCancelConnection = async (targetId: string) => {
      if (!user) return
      const { error } = await supabase.from('connections').delete().eq('status', 'PENDING').or(`and(sender_id.eq.${user.id},receiver_id.eq.${targetId}),and(sender_id.eq.${targetId},receiver_id.eq.${user.id})`)
      if (!error) {
         await supabase.from('notifications').delete().eq('user_id', targetId).eq('actor_id', user.id).eq('type', 'CONNECTION')
         fetchMyConnections(user.id)
         toast.success("Request rescinded")
      }
   }

   const getConnectionStatus = (profileId: string) => {
      const conn = myConnections.find(c => c.sender_id === profileId || c.receiver_id === profileId)
      if (!conn) return 'NONE'
      if (conn.status === 'ACCEPTED') return 'CONNECTED'
      return conn.sender_id === user?.id ? 'PENDING_SENT' : 'PENDING_RECEIVED'
   }

   const handleDeletePost = async (postId: string) => {
      if (!window.confirm("Are you sure you want to delete this fragment?")) return
      try {
         await PostsService.delete(postId)
         setPosts(prev => prev.filter(p => p.id !== postId))
         toast.success("Fragment discarded")
      } catch (e) {
         toast.error("Failed to delete")
      }
   }

   const handleAcceptConnection = async (connectionId: string) => {
      const { error } = await supabase.from('connections').update({ status: 'ACCEPTED' }).eq('id', connectionId)
      if (!error && user) {
         toast.success("Connection accepted!")
         fetchMyConnections(user.id)
      }
   }

   const handleDeclineConnection = async (connectionId: string) => {
      const { error } = await supabase.from('connections').delete().eq('id', connectionId)
      if (!error && user) {
         toast.success("Request declined")
         fetchMyConnections(user.id)
      }
   }

   const handlePost = async (guidedFields: any, setGuidedFields: (fields: any) => void) => {
      if (!user) return
      const configs: Record<string, { content: string, type: string }> = {
         "post-update": { content: `MILESTONE: ${guidedFields.blocker}\nSTACK: ${guidedFields.stack}\nCONTEXT: ${guidedFields.context}`, type: "UPDATE" },
         "ask-help": { content: `BLOCKER: ${guidedFields.blocker}\nSTACK: ${guidedFields.stack}\nCONTEXT: ${guidedFields.context}`, type: "HELP" },
         "dev-needed": { content: `ROLE NEEDED: ${guidedFields.role}\nPROJECT: ${guidedFields.project}\nMISSION: ${guidedFields.mission}`, type: "TEAM" },
         "share-project": { content: `PROJECT: ${guidedFields.projectName}\nDESCRIPTION: ${guidedFields.description}\nLINK: ${guidedFields.link}`, type: "PROJECT" }
      }

      const emptyFields = { blocker: "", stack: "", context: "", role: "", project: "", mission: "", projectName: "", description: "", link: "", eventTitle: "", eventVenue: "", eventDate: "", eventEndDate: "", eventDescription: "", eventPoster: "" }

      if (activeTab === "organize-event") {
         if (!guidedFields.eventTitle.trim()) return toast.error("Event synthesis failed")
         setIsPosting(true)
         const { error } = await supabase.from('events').insert([{ organizer_id: user.id, title: guidedFields.eventTitle, venue: guidedFields.eventVenue, event_date: guidedFields.eventDate || new Date().toISOString(), description: guidedFields.eventDescription + (guidedFields.eventEndDate ? `\nEND_DATE: ${guidedFields.eventEndDate}` : ""), image_url: guidedFields.eventPoster || null }])
         if (!error) { setGuidedFields(emptyFields); fetchEvents(); setActiveTab("events"); toast.success("Event broadcasted successfully") }
         setIsPosting(false)
         return
      }

      const config = configs[activeTab]
      if (!config?.content.trim()) return toast.error("Fragment sync failed")
      setIsPosting(true)
      const { error } = await supabase.from('posts').insert([{ user_id: user.id, type: config.type, content: config.content, tags: config.content.match(/#\w+/g)?.map(t => t.slice(1)) || [] }])
      if (!error) { setGuidedFields(emptyFields); fetchPosts(); setActiveTab("all"); toast.success("Fragment synchronized successfully") }
      setIsPosting(false)
   }

   React.useEffect(() => {
      const tab = searchParams?.get("tab")
      if (tab && tab !== activeTab) {
         setActiveTabRaw(tab)
      }
   }, [searchParams])

   React.useEffect(() => {
      async function init() {
         const { data: { session } } = await supabase.auth.getSession()
         if (!session) {
            router.push('/join')
            return
         }
         setUser(session.user)
         setIsInitializing(false)

         await Promise.all([
            ProfilesService.getById(session.user.id).then(async (data) => {
               if (data) {
                  setProfile(data);
                  const metaAvatar = session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture;
                  const metaEmail = session.user.email;
                  const needsUpdate = (!data.avatar_url && metaAvatar) || (!data.email && metaEmail);
                  
                  if (needsUpdate) {
                     const updated = await ProfilesService.update(session.user.id, {
                        avatar_url: data.avatar_url || metaAvatar,
                        email: data.email || metaEmail 
                     })
                     if (updated) {
                        setProfile(updated);
                        fetchPosts();
                     }
                  }
               }
            }),
            fetchPosts(),
            fetchEvents(),
            fetchUserLikes(session.user.id),
            fetchMyConnections(session.user.id),
            fetchNotifications(session.user.id),
            fetchAllProfiles()
         ])

         setIsDataLoading(false)

         const interval = setInterval(() => {
            fetchPosts()
            fetchEvents()
         }, 30000)

         return () => clearInterval(interval)
      }
      init()
   }, [])

   return {
      user,
      profile,
      isInitializing,
      isDataLoading,
      activeTab,
      setActiveTab,
      posts,
      setPosts,
      allProfiles,
      myConnections,
      notifications,
      pendingRequests,
      userLikes,
      setUserLikes,
      events,
      isPosting,
      setIsPosting,
      discoverSearch,
      setDiscoverSearch,
      handleLike,
      handleConnect,
      handleCancelConnection,
      getConnectionStatus,
      handleDeletePost,
      handleAcceptConnection,
      handleDeclineConnection,
      handlePost,
      supabase,
      router,
      fetchPosts,
      fetchEvents,
      fetchMyConnections,
      fetchUserLikes
   }
}
