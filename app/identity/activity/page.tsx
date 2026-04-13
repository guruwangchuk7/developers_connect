"use client"

import * as React from "react"
import { createClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { GlobalHeader } from "@/components/common/global-header"
import { ContentFeed } from "@/features/dashboard/components/content-feed"
import { cn } from "@/lib/utils"
import { 
  History as HistoryIcon, 
  Trash2, 
  Calendar, 
  ArrowLeft, 
  LayoutGrid, 
  List, 
  Sparkles,
  Search,
  MessageSquare,
  Rocket,
  ShieldAlert
} from "lucide-react"
import { toast } from "sonner"
import { FeedSkeleton, HeaderSkeleton, EventSkeleton, Skeleton } from "@/features/dashboard/components/skeletons"

export default function UserActivityPage() {
  const supabase = createClient()
  const router = useRouter()
  const [user, setUser] = React.useState<any>(null)
  const [profile, setProfile] = React.useState<any>(null)
  const [isInitializing, setIsInitializing] = React.useState(true)
  const [isDataLoading, setIsDataLoading] = React.useState(true)
  const [posts, setPosts] = React.useState<any[]>([])
  const [events, setEvents] = React.useState<any[]>([])
  const [activeView, setActiveView] = React.useState<'POSTS' | 'EVENTS'>('POSTS')
  const [userLikes, setUserLikes] = React.useState<string[]>([])
  const [searchQuery, setSearchQuery] = React.useState("")

  const fetchUserContent = async (userId: string) => {
    // Parallelize fetches
    const [postsRes, eventsRes, likesRes] = await Promise.all([
      supabase
        .from('posts')
        .select(`*, profiles!user_id (full_name, role, avatar_url)`)
        .eq('user_id', userId)
        .order('created_at', { ascending: false }),
      supabase
        .from('events')
        .select(`*, profiles!organizer_id (full_name)`)
        .eq('organizer_id', userId)
        .order('event_date', { ascending: false }),
      supabase
        .from('post_likes')
        .select('post_id')
        .eq('user_id', userId)
    ])

    if (!postsRes.error && postsRes.data) {
      setPosts(postsRes.data.map((p: any) => ({
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
    }

    if (!eventsRes.error && eventsRes.data) {
      setEvents(eventsRes.data)
    }

    if (likesRes.data) setUserLikes(likesRes.data.map((l: any) => l.post_id))
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

      await Promise.all([
        supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(async ({ data }: { data: any }) => {
            if (data) {
              setProfile(data);
              // Identity Matrix: Sync avatar if missing in DB but present in metadata
              const metaAvatar = session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture;
              if (!data.avatar_url && metaAvatar) {
                const { error } = await supabase
                  .from('profiles')
                  .update({ avatar_url: metaAvatar })
                  .eq('id', session.user.id);
                
                if (!error) {
                  setProfile({ ...data, avatar_url: metaAvatar });
                  // Refresh content to show the new avatar immediately
                  fetchUserContent(session.user.id);
                }
              }
            }
          }),
        fetchUserContent(session.user.id)
      ])
      
      setIsDataLoading(false)
    }
    init()
  }, [])

  const handleDeletePost = async (postId: string) => {
    const { error } = await supabase.from('posts').delete().eq('id', postId)
    if (!error) {
      setPosts(prev => prev.filter(p => p.id !== postId))
      toast.success("Post removed from network")
    } else {
      toast.error("Failed to delete post")
    }
  }

  const handleDeleteEvent = async (eventId: string) => {
    const { error } = await supabase.from('events').delete().eq('id', eventId)
    if (!error) {
      setEvents(prev => prev.filter(e => e.id !== eventId))
      toast.success("Event cancelled and removed")
    } else {
      toast.error("Failed to delete event")
    }
  }

  const handleLike = async (postId: string) => {
    if (!user) return
    const isLiked = userLikes.includes(postId)
    
    if (isLiked) {
      setUserLikes(prev => prev.filter(id => id !== postId))
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: Math.max(0, p.likes - 1) } : p))
      await supabase.from('post_likes').delete().eq('post_id', postId).eq('user_id', user.id)
    } else {
      setUserLikes(prev => [...prev, postId])
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p))
      await supabase.from('post_likes').insert([{ post_id: postId, user_id: user.id }])
    }
  }

  const filteredPosts = posts.filter(p => 
    p.content.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.type.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredEvents = events.filter(e => 
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    e.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans selection:bg-primary/10">
      <GlobalHeader />

      <main className="flex-1 flex flex-col items-center w-full">
        <div className="w-full max-w-5xl px-4 md:px-8 pt-8 md:pt-12 pb-20 space-y-8">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <button 
                onClick={() => router.back()}
                className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mb-4"
              >
                <ArrowLeft className="h-3 w-3" /> Back
              </button>
              {isInitializing ? (
                <div className="space-y-2">
                  <Skeleton className="h-10 w-64" />
                  <Skeleton className="h-4 w-48" />
                </div>
              ) : (
                <>
                  <h1 className="text-3xl font-semibold tracking-tight text-[#101828] flex items-center gap-3">
                    Posts & Activity
                    {!isDataLoading && (
                      <span className="px-2 py-0.5 bg-secondary rounded-full text-[10px] font-bold text-muted-foreground">
                        {posts.length + events.length} Total
                      </span>
                    )}
                  </h1>
                  <p className="text-sm text-muted-foreground">Manage your contributions, help requests, and community events.</p>
                </>
              )}
            </div>

            <div className="flex items-center gap-2 bg-white border border-border/60 p-1 rounded-lg shadow-sm">
              <button 
                onClick={() => setActiveView('POSTS')}
                className={cn(
                  "px-4 py-2 text-[11px] font-bold uppercase tracking-widest rounded-md transition-all flex items-center gap-2",
                  activeView === 'POSTS' ? "bg-primary text-background shadow-lg shadow-primary/20" : "text-muted-foreground hover:bg-secondary/50"
                )}
              >
                <List className="h-3.5 w-3.5" /> Posts
              </button>
              <button 
                onClick={() => setActiveView('EVENTS')}
                className={cn(
                  "px-4 py-2 text-[11px] font-bold uppercase tracking-widest rounded-md transition-all flex items-center gap-2",
                  activeView === 'EVENTS' ? "bg-primary text-background shadow-lg shadow-primary/20" : "text-muted-foreground hover:bg-secondary/50"
                )}
              >
                <Calendar className="h-3.5 w-3.5" /> Events
              </button>
            </div>
          </div>

          {/* Search & Stats Bar */}
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
            <input 
              type="text"
              placeholder={`Search within your ${activeView.toLowerCase()}...`}
              className="w-full bg-white border border-border/60 rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Content Area */}
          <div className="space-y-6">
            {isDataLoading ? (
              activeView === 'POSTS' ? <FeedSkeleton /> : <EventSkeleton />
            ) : (
              activeView === 'POSTS' ? (
                filteredPosts.length > 0 ? (
                  <div className="bg-white border border-border/60 rounded-xl overflow-hidden shadow-sm p-6 md:p-8">
                    <ContentFeed 
                      posts={filteredPosts}
                      user={user}
                      userLikes={userLikes}
                      handleDeletePost={handleDeletePost}
                      handleConnect={() => {}} // Not needed here as it's own post
                      handleLike={handleLike}
                    />
                  </div>
                ) : (
                  <div className="py-32 text-center bg-white border border-dashed border-border/60 rounded-2xl flex flex-col items-center">
                    <div className="h-16 w-16 bg-secondary/50 rounded-full flex items-center justify-center mb-6">
                      <HistoryIcon className="h-8 w-8 text-muted-foreground/40" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground/80">No posts found</h3>
                    <p className="text-sm text-muted-foreground max-w-xs mx-auto mt-1">
                      {searchQuery ? "No matches for your search query." : "You haven't shared any technical updates or help requests yet."}
                    </p>
                    <button 
                      onClick={() => router.push('/dashboard?tab=post-update')}
                      className="mt-8 px-6 py-2.5 bg-primary text-background text-[11px] font-bold uppercase tracking-widest rounded-full hover:scale-105 transition-all shadow-lg shadow-primary/20"
                    >
                      Create first post
                    </button>
                  </div>
                )
              ) : (
                filteredEvents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredEvents.map((event) => (
                      <div key={event.id} className="bg-white border border-border/60 rounded-xl overflow-hidden flex flex-col hover:border-primary/20 transition-all group shadow-sm">
                        {event.image_url && (
                          <div className="aspect-video w-full overflow-hidden border-b border-border/10">
                            <img src={event.image_url} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          </div>
                        )}
                        <div className="p-6 space-y-4 flex-1 flex flex-col">
                          <div className="flex justify-between items-start">
                            <div className="flex flex-col gap-1">
                              <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 bg-primary/5 text-primary border border-primary/10 rounded-full w-fit">
                                {new Date(event.event_date).toLocaleDateString()}
                              </span>
                            </div>
                            <button 
                              onClick={() => handleDeleteEvent(event.id)}
                              className="p-2 text-muted-foreground/30 hover:text-red-500 hover:bg-red-50/50 rounded-full transition-all"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <div className="space-y-2 flex-1">
                            <h4 className="text-lg font-bold tracking-tight text-[#101828] group-hover:text-primary transition-colors">{event.title}</h4>
                            <p className="text-[13px] text-muted-foreground leading-relaxed line-clamp-3">{event.description}</p>
                          </div>
                          <div className="pt-4 border-t border-border/10 flex items-center justify-between mt-auto">
                            <div className="flex items-center gap-2">
                               <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center text-[8px] font-black italic">
                                  {profile?.full_name?.[0] || 'U'}
                               </div>
                               <span className="text-[10px] font-bold text-muted-foreground">{profile?.full_name || 'You'}</span>
                            </div>
                            <span className="text-[10px] font-bold text-muted-foreground/40">{event.venue}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-32 text-center bg-white border border-dashed border-border/60 rounded-2xl flex flex-col items-center">
                    <div className="h-16 w-16 bg-secondary/50 rounded-full flex items-center justify-center mb-6">
                      <Calendar className="h-8 w-8 text-muted-foreground/40" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground/80">No events found</h3>
                    <p className="text-sm text-muted-foreground max-w-xs mx-auto mt-1">
                      {searchQuery ? "No matches for your search query." : "You haven't organized any technical events yet."}
                    </p>
                    <button 
                      onClick={() => router.push('/dashboard?tab=organize-event')}
                      className="mt-8 px-6 py-2.5 bg-primary text-background text-[11px] font-bold uppercase tracking-widest rounded-full hover:scale-105 transition-all shadow-lg shadow-primary/20"
                    >
                      Organize an event
                    </button>
                  </div>
                )
              )
            )}
          </div>

          {/* Activity Safeguard */}
          <div className="p-6 bg-amber-500/5 border border-amber-500/10 rounded-xl flex items-start gap-4">
            <div className="p-2 bg-amber-500/10 rounded-lg">
              <ShieldAlert className="h-5 w-5 text-amber-600" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-amber-900">Privacy Notice</h4>
              <p className="text-xs text-amber-800/60 leading-relaxed">
                Posts and events shown here are currently public to all members in the network. 
                Deleting a post or event is permanent and will remove all associated technical metadata from the national grid.
              </p>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
