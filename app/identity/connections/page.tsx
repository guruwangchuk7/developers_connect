"use client"

import * as React from "react"
import { createClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { GlobalHeader } from "@/components/common/global-header"
import { cn } from "@/lib/utils"
import { 
  ArrowLeft, 
  Unlink, 
  UserMinus, 
  Activity, 
  ShieldCheck, 
  ShieldAlert,
  Search,
  MessageSquare,
  Users
} from "lucide-react"
import { toast } from "sonner"

export default function ConnectionsPage() {
  const supabase = createClient()
  const router = useRouter()
  const [user, setUser] = React.useState<any>(null)
  const [isInitializing, setIsInitializing] = React.useState(true)
  const [isDataLoading, setIsDataLoading] = React.useState(true)
  const [connections, setConnections] = React.useState<any[]>([])
  const [removingConnId, setRemovingConnId] = React.useState<string | null>(null)
  const [searchQuery, setSearchQuery] = React.useState("")

  const fetchConnections = async (userId: string) => {
    setIsDataLoading(true)
    const { data, error } = await supabase
      .from('connections')
      .select(`
        *, 
        sender:profiles!sender_id(id, full_name, avatar_url, role), 
        receiver:profiles!receiver_id(id, full_name, avatar_url, role)
      `)
      .eq('status', 'ACCEPTED')
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)

    if (!error && data) {
      setConnections(data)
    }
    setIsDataLoading(false)
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
      await fetchConnections(session.user.id)
    }
    init()
  }, [])

  const handleRemoveConnection = async (connId: string) => {
    if (removingConnId !== connId) {
      setRemovingConnId(connId)
      setTimeout(() => setRemovingConnId(null), 3000)
      return
    }

    const { error } = await supabase
      .from('connections')
      .delete()
      .eq('id', connId)

    if (!error) {
      setConnections(prev => prev.filter(c => c.id !== connId))
      setRemovingConnId(null)
      toast.success("Connection removed.")
    } else {
      toast.error("Failed to disconnect.")
    }
  }

  const filteredConnections = connections.filter(conn => {
    const peer = conn.sender_id === user?.id ? conn.receiver : conn.sender;
    return peer?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
           peer?.role?.toLowerCase().includes(searchQuery.toLowerCase());
  })

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans selection:bg-primary/10">
      <GlobalHeader />

      <main className="flex-1 flex flex-col items-center w-full">
        <div className="w-full px-[1cm] pt-8 md:pt-12 pb-20 space-y-8">
          
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
                  <div className="h-10 w-64 bg-secondary rounded animate-pulse" />
                  <div className="h-4 w-48 bg-secondary rounded animate-pulse" />
                </div>
              ) : (
                <>
                  <h1 className="text-3xl font-semibold tracking-tight text-[#101828] flex items-center gap-3">
                    Connections
                    {!isDataLoading && (
                      <span className="px-2 py-0.5 bg-secondary rounded-full text-[10px] font-bold text-muted-foreground">
                        {connections.length} Total
                      </span>
                    )}
                  </h1>
                  <p className="text-sm text-muted-foreground">Manage your developer connections and messaging history.</p>
                </>
              )}
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
            <input 
              type="text"
              placeholder="Search connections..."
              className="w-full bg-white border border-border/60 rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Connections List */}
          <div className="space-y-6">
            {isDataLoading ? (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-24 bg-white border border-border/60 rounded-xl animate-pulse" />
                  ))}
               </div>
            ) : filteredConnections.length > 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredConnections.map((conn) => {
                    const peer = conn.sender_id === user?.id ? conn.receiver : conn.sender;
                    return (
                      <div key={conn.id} className="p-5 bg-white border border-border/60 rounded-xl flex items-center justify-between group hover:border-primary/40 transition-all shadow-sm">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-full overflow-hidden border border-border/40 shadow-inner bg-secondary/20">
                            {peer?.avatar_url ? (
                              <img src={peer.avatar_url} className="h-full w-full object-cover" />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center font-bold text-sm">
                                {peer?.full_name?.[0]}
                              </div>
                            )}
                          </div>
                          <div className="space-y-0.5">
                            <h4 className="text-[14px] font-bold text-foreground">{peer?.full_name}</h4>
                            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest">{peer?.role || 'Developer'}</p>
                            <div className="flex items-center gap-2 mt-1">
                               <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                               <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-tighter">Secure Messaging Active</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                           <button
                             onClick={() => router.push(`/dashboard?tab=messages&peer=${peer?.id}`)}
                             className="p-2.5 bg-secondary/50 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                             title="Open Chat"
                           >
                             <MessageSquare className="h-4 w-4" />
                           </button>
                           <button 
                             onClick={() => handleRemoveConnection(conn.id)}
                             className={cn(
                               "p-2.5 rounded-lg transition-all",
                               removingConnId === conn.id 
                                 ? "bg-red-500 text-white shadow-lg shadow-red-500/20 px-3" 
                                 : "bg-white border border-border/60 text-muted-foreground hover:text-red-500 hover:border-red-500/40"
                             )}
                           >
                             {removingConnId === conn.id ? (
                               <div className="flex items-center gap-2">
                                  <Unlink className="h-3.5 w-3.5" />
                                  <span className="text-[9px] font-black uppercase tracking-widest">Confirm</span>
                               </div>
                             ) : (
                               <UserMinus className="h-4 w-4" />
                             )}
                           </button>
                        </div>
                      </div>
                    )
                  })}
               </div>
            ) : (
              <div className="py-20 flex flex-col items-center justify-center bg-white border border-border/60 border-dashed rounded-2xl space-y-4">
                 <div className="bg-secondary/20 p-4 rounded-full">
                    <Users className="h-10 w-10 text-muted-foreground/30" />
                 </div>
                 <div className="text-center space-y-1">
                    <p className="text-sm font-bold text-foreground uppercase tracking-widest">No connections yet</p>
                    <p className="text-xs text-muted-foreground">Start connecting with developers in the directory.</p>
                 </div>
              </div>
            )}
          </div>

          {/* Security Protocols */}
          <div className="p-6 bg-[#FEF3F2] border border-[#FEE4E2] rounded-xl flex items-start gap-5">
             <div className="bg-[#D92D20] p-3 rounded-lg shadow-lg">
                <ShieldAlert className="h-5 w-5 text-white" />
             </div>
             <div className="space-y-1.5">
                <h4 className="text-[13px] font-bold text-[#912018] uppercase tracking-widest">Warning</h4>
                <p className="text-[12px] text-[#B42318]/70 leading-relaxed font-medium">
                  Removing a connection will immediately hide your message history and remove them from your messages workspace.
                </p>
             </div>
          </div>

        </div>
      </main>
    </div>
  )
}
