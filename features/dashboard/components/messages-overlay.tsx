"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { MessageSquare, X, Send, UserPlus, Clock, ArrowLeft, MoreVertical } from "lucide-react"
import { createClient } from "@/lib/supabase"
import { toast } from "sonner"

interface MessagesOverlayProps {
  isOpen: boolean
  setIsOpen: (val: boolean) => void
  pendingRequests: any[]
  connections: any[]
  onAccept: (id: string) => void
  onDecline: (id: string) => void
  user: any
}

export function MessagesOverlay({
  isOpen,
  setIsOpen,
  pendingRequests,
  connections,
  onAccept,
  onDecline,
  user
}: MessagesOverlayProps) {
  const [selectedPeer, setSelectedPeer] = React.useState<any>(null)
  const [message, setMessage] = React.useState("")
  const [messages, setMessages] = React.useState<any[]>([])
  const [isSending, setIsSending] = React.useState(false)
  const supabase = createClient()

  // Fetch messages when a peer is selected
  React.useEffect(() => {
    if (!selectedPeer || !user) return

    const fetchMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${selectedPeer.id}),and(sender_id.eq.${selectedPeer.id},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true })
      
      if (data) setMessages(data)
    }

    fetchMessages()

    // Real-time subscription for new messages
    const channel = supabase
      .channel(`chat_${selectedPeer.id}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `receiver_id=eq.${user.id}` 
      }, (payload: any) => {
        if (payload.new.sender_id === selectedPeer.id) {
          setMessages(prev => [...prev, payload.new])
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [selectedPeer, user])

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!message.trim() || !selectedPeer?.id || !user || isSending) {
      console.warn('Cannot send: Missing data', { 
        msg: !!message.trim(), 
        peer: !!selectedPeer?.id, 
        user: !!user 
      })
      return
    }

    setIsSending(true)
    const newMessage = {
      sender_id: user.id,
      receiver_id: selectedPeer.id,
      content: message.trim()
    }

    const { data, error } = await supabase
      .from('messages')
      .insert([newMessage])
      .select()
      .single()

    if (error) {
      console.error('Messaging Error:', error.message, error.details)
      toast.error(`Message failed: ${error.message}`)
      setIsSending(false)
      return
    }

    if (data) {
      setMessages(prev => [...prev, data])
      setMessage("")
      
      // Also trigger a notification for the receiver
      await supabase.from('notifications').insert([{
        user_id: selectedPeer.id,
        type: 'MESSAGE',
        actor_id: user.id,
        content: `New message from ${user.user_metadata?.full_name || 'a developer'}`,
        link: '/dashboard?tab=messages'
      }])
    }
    setIsSending(false)
  }

  return (
    <div className={cn(
      "fixed inset-y-0 right-0 w-full md:w-[480px] bg-background border-l border-border/40 shadow-2xl z-[100] transform transition-transform duration-500 ease-in-out flex flex-col",
      isOpen ? "translate-x-0" : "translate-x-full"
    )}>
      {/* HEADER */}
      <div className="p-6 md:p-8 border-b border-border/20 flex items-center justify-between bg-primary/5">
        <div className="flex items-center gap-4">
          {selectedPeer ? (
            <button 
              onClick={() => setSelectedPeer(null)}
              className="p-2 hover:bg-secondary rounded-full transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          ) : (
            <div className="h-10 w-10 md:h-12 md:w-12 rounded-sm bg-primary flex items-center justify-center text-background">
              <MessageSquare className="h-5 w-5 md:h-6 md:w-6" />
            </div>
          )}
          <div>
            <h3 className="text-[16px] md:text-[18px] font-bold text-foreground">
              {selectedPeer ? selectedPeer.full_name : "Workspace Comms"}
            </h3>
            <p className="text-[11px] md:text-[12px] font-medium text-muted-foreground/50 uppercase tracking-widest leading-none mt-1">
              {selectedPeer ? (selectedPeer.role || "Peer Node") : "Synchronization Node"}
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="p-2 md:p-3 hover:bg-secondary rounded-sm transition-colors group"
        >
          <X className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground/40 group-hover:text-foreground" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar bg-secondary/5">
        {!selectedPeer ? (
          <div className="p-6 md:p-8 space-y-12">
            {/* PENDING REQUESTS SECTION */}
            {pendingRequests.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4 text-primary" />
                  <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">Sync Requests</h4>
                </div>
                <div className="space-y-4">
                  {pendingRequests.map((req) => (
                    <div key={req.id} className="p-5 bg-background border border-primary/20 rounded-sm shadow-sm flex items-center justify-between group animate-in fade-in slide-in-from-right-4 duration-500">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 md:h-12 md:w-12 rounded-full border border-border/40 overflow-hidden bg-secondary">
                          {req.sender?.avatar_url ? (
                            <img src={req.sender.avatar_url} className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-[14px] font-bold">
                              {req.sender?.full_name?.[0]}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-[14px] font-bold text-foreground leading-none">{req.sender?.full_name}</p>
                          <p className="text-[11px] font-medium text-muted-foreground mt-1.5 uppercase tracking-widest">{req.sender?.role || "Developer"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => onAccept(req.id)}
                          className="px-4 py-2 bg-primary text-background text-[10px] font-black uppercase tracking-widest rounded-sm hover:opacity-90 transition-all active:scale-95"
                        >
                          Sync
                        </button>
                        <button 
                          onClick={() => onDecline(req.id)}
                          className="p-2 text-muted-foreground/40 hover:text-red-500 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ACTIVE CHANNELS SECTION */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground/40" />
                <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">Active Channels</h4>
              </div>
              
              {connections.length > 0 ? (
                <div className="space-y-4">
                  {connections.map((conn) => {
                    const peer = conn.sender_id === user?.id ? conn.receiver : conn.sender
                    return (
                      <button 
                        key={conn.id} 
                        onClick={() => setSelectedPeer(peer)}
                        className="w-full p-5 bg-background border border-border/40 rounded-sm shadow-sm flex items-center justify-between group hover:border-primary/20 transition-all text-left"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 md:h-12 md:w-12 rounded-full border border-border/40 overflow-hidden bg-secondary">
                            {peer?.avatar_url ? (
                              <img src={peer.avatar_url} className="h-full w-full object-cover" />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-[14px] font-bold">
                                {peer?.full_name?.[0]}
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-[14px] font-bold text-foreground leading-none">{peer?.full_name}</p>
                            <p className="text-[11px] font-medium text-muted-foreground mt-1.5 line-clamp-1">Sync established. Ready for comms.</p>
                          </div>
                        </div>
                        <MoreVertical className="h-4 w-4 text-muted-foreground/20 group-hover:text-muted-foreground transition-colors" />
                      </button>
                    )
                  })}
                </div>
              ) : (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                  <MessageSquare className="h-10 w-10 text-muted-foreground" />
                  <p className="text-[12px] font-bold uppercase tracking-widest">No active channels.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* CHAT VIEW */
          <div className="flex flex-col min-h-full bg-background animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex-1 p-6 md:p-8 overflow-y-auto space-y-6">
              {messages.length > 0 ? (
                messages.map((msg, idx) => (
                  <div 
                    key={msg.id || idx} 
                    className={cn(
                      "flex flex-col max-w-[85%]",
                      msg.sender_id === user?.id ? "ml-auto items-end" : "mr-auto items-start"
                    )}
                  >
                    <div className={cn(
                      "p-4 rounded-sm text-[13px] md:text-[14px] font-medium leading-relaxed shadow-sm",
                      msg.sender_id === user?.id 
                        ? "bg-primary text-background rounded-tr-none" 
                        : "bg-secondary/50 text-foreground border border-border/20 rounded-tl-none"
                    )}>
                      {msg.content}
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 mt-1.5 px-1">
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-40 py-20 mt-10">
                   <div className="h-20 w-20 rounded-full border-2 border-dashed border-primary/20 flex items-center justify-center p-2">
                      <div className="h-full w-full rounded-full bg-primary/5 flex items-center justify-center">
                        <MessageSquare className="h-8 w-8 text-primary/40" />
                      </div>
                   </div>
                   <div className="space-y-4 px-12">
                      <h4 className="text-[16px] font-bold tracking-tight text-foreground">Encrypted Channel Established</h4>
                      <p className="text-[12px] text-muted-foreground leading-relaxed">
                        Synchronization with <strong>{selectedPeer.full_name}</strong> is verified. Direct messaging is now active.
                      </p>
                   </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* FOOTER - Only show if a peer is selected */}
      {selectedPeer && (
        <div className="p-6 md:p-8 border-t border-border/20 bg-secondary/10">
          <form 
            onSubmit={handleSendMessage}
            className="flex items-center gap-4 bg-background border border-border/40 p-1.5 md:p-2 rounded-sm focus-within:border-primary/40 transition-all shadow-sm"
          >
            <input
              type="text"
              placeholder={`Message ${selectedPeer.full_name}...`}
              className="flex-1 bg-transparent border-none outline-none px-3 md:px-4 text-[13px] md:text-[14px] font-bold tracking-tight"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isSending}
              autoFocus
            />
            <button 
              type="submit"
              disabled={isSending || !message.trim()}
              className={cn(
                "h-10 w-10 md:h-12 md:w-12 bg-primary text-background rounded-sm flex items-center justify-center transition-all",
                (isSending || !message.trim()) ? "opacity-30 cursor-not-allowed" : "hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
              )}
            >
              <Send className="h-4 w-4 md:h-5 md:w-5" />
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
