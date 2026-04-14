"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { GlobalHeader } from "@/components/common/global-header"
import {
   Trophy
} from "lucide-react"
import { Suspense } from "react"
import { toast } from "sonner"

import { useDashboardData } from "@/features/dashboard/hooks/use-dashboard-data"
import { DashboardNavigation } from "@/features/dashboard/components/dashboard-navigation"
import { PostCreator } from "@/features/dashboard/components/post-creator"
import { ContentFeed } from "@/features/dashboard/components/content-feed"
import { DiscoverDevelopers } from "@/features/dashboard/components/discover-developers"
import { MessagesOverlay } from "@/features/dashboard/components/messages-overlay"
import { Sidebar } from "@/features/dashboard/components/sidebar"
import { Help } from "@/features/dashboard/components/help"
import { DashboardHeader } from "@/features/dashboard/components/dashboard-header"
import { EventGrid } from "@/features/dashboard/components/event-grid"
import { FeedSkeleton, SidebarSkeleton, HeaderSkeleton } from "@/features/dashboard/components/skeletons"

function DashboardContent() {
   const {
      user,
      profile,
      isInitializing,
      isDataLoading,
      activeTab,
      setActiveTab,
      posts,
      allProfiles,
      userLikes,
      events,
      isPosting,
      myConnections,
      pendingRequests,
      notifications,
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
      router
   } = useDashboardData()

   const [isMessagesOpen, setIsMessagesOpen] = React.useState(false)
   const [guidedFields, setGuidedFields] = React.useState<Record<string, string>>({
      blocker: "", stack: "", context: "",
      role: "", project: "", mission: "",
      projectName: "", description: "", link: "",
      eventTitle: "", eventVenue: "", eventDate: "", eventEndDate: "", eventDescription: "", eventPoster: ""
   })

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
         return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
      })
   }, [posts, activeTab])

   if (isInitializing) return <HeaderSkeleton />

   return (
      <div className="min-h-[100dvh] bg-background text-foreground flex flex-col font-sans selection:bg-primary/20 overflow-y-auto scrollbar-hide">
         <GlobalHeader />

         <main className="flex-1 flex justify-center w-full">
            <div className="w-full px-4 md:px-10 py-2 md:py-4 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pb-24 lg:pb-0 relative">
               <div className="hidden lg:block lg:col-span-3">
                  <Sidebar
                     activeTab={activeTab}
                     setActiveTab={setActiveTab}
                     setIsMessagesOpen={setIsMessagesOpen}
                     className="sticky top-20"
                  />
               </div>

               <div className="lg:col-span-9 space-y-8">
                  <DashboardHeader
                     title={headerInfo.title}
                     subtitle={headerInfo.subtitle}
                     activeTab={activeTab}
                     discoverSearch={discoverSearch}
                     setDiscoverSearch={setDiscoverSearch}
                  />

                  {isDataLoading ? (
                     <FeedSkeleton isGrid={["discover", "teams", "projects"].includes(activeTab)} />
                  ) : (
                     activeTab === "discover" ? (
                        <DiscoverDevelopers
                           allProfiles={allProfiles}
                           user={user}
                           discoverSearch={discoverSearch}
                           setDiscoverSearch={setDiscoverSearch}
                           handleConnect={handleConnect}
                           handleCancelConnection={handleCancelConnection}
                           getConnectionStatus={getConnectionStatus}
                        />
                     ) : activeTab === "teams" || activeTab === "projects" ? (
                        <ContentFeed
                           isGrid={true}
                           posts={posts.filter((p: any) => p.type === (activeTab === "teams" ? 'TEAM' : 'PROJECT') && (discoverSearch === "" || p.content.toLowerCase().includes(discoverSearch.toLowerCase())))}
                           user={profile}
                           userLikes={userLikes}
                           handleDeletePost={handleDeletePost}
                           handleConnect={handleConnect}
                           handleLike={handleLike}
                        />
                     ) : activeTab === "help" ? (
                        <ContentFeed
                           posts={posts.filter((p: any) => p.type === 'HELP')}
                           user={profile}
                           userLikes={userLikes}
                           handleDeletePost={handleDeletePost}
                           handleConnect={handleConnect}
                           handleLike={handleLike}
                        />
                     ) : activeTab === "events" ? (
                        <EventGrid
                           events={events}
                           onOrganizeEvent={() => setActiveTab("organize-event")}
                        />
                     ) : activeTab === "help-guide" ? (
                        <Help />
                     ) : (
                        <div className="space-y-10">
                           <PostCreator
                              activeTab={activeTab}
                              guidedFields={guidedFields}
                              setGuidedFields={setGuidedFields}
                              isPosting={isPosting}
                              handlePost={() => handlePost(guidedFields, setGuidedFields)}
                           />
                           {activeTab === "all" && (
                              <ContentFeed
                                 posts={feedItems}
                                 user={profile}
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

         <MessagesOverlay 
            isOpen={isMessagesOpen} 
            setIsOpen={setIsMessagesOpen} 
            pendingRequests={pendingRequests}
            connections={myConnections.filter(c => c.status === 'ACCEPTED')}
            onAccept={handleAcceptConnection}
            onDecline={handleDeclineConnection}
            user={user}
         />
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
