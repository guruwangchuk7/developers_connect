"use client"

import * as React from "react"
import { Heart, MessageCircle, X, UserPlus } from "lucide-react"
import { cn } from "@/lib/utils"

interface Post {
  id: string
  userId: string
  user: string
  role: string
  timestamp: string
  content: string
  type: 'HELP' | 'TEAM' | 'PROJECT' | 'UPDATE' | 'DEVELOPER'
  likes: number
  comments: number
  tags: string[]
  avatar_url?: string
  skills?: string[] // For DEVELOPER type items
}

interface ContentFeedProps {
  posts: Post[]
  user: any
  userLikes: string[]
  handleDeletePost: (id: string) => void
  handleConnect: (id: string) => void
  handleLike: (postId: string) => void
  isGrid?: boolean
}

export function ContentFeed({
  posts,
  user,
  userLikes,
  handleDeletePost,
  handleConnect,
  handleLike,
  isGrid = false
}: ContentFeedProps) {
  return (
    <div className={cn("grid gap-6", isGrid ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:gap-8")}>
      {posts.map((post) => {
        // Special UI for Developer Joined/Updated items
        if (post.type === 'DEVELOPER') {
          return (
            <article key={post.id} className="p-6 md:p-8 bg-secondary/5 border border-border/20 rounded-sm hover:border-primary/20 transition-all group/card relative overflow-hidden backdrop-blur-sm">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -z-10 opacity-50" />

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 md:h-14 md:w-14 rounded-full bg-background border border-primary/20 p-1 group-hover/card:border-primary transition-all duration-500 overflow-hidden">
                    {post.avatar_url ? (
                      <img
                        src={post.avatar_url}
                        alt={post.user}
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full rounded-full bg-secondary flex items-center justify-center text-[16px] md:text-[18px] font-bold uppercase text-primary/60 group-hover/card:bg-primary group-hover/card:text-background transition-all">
                        {post.user[0]}
                      </div>
                    )}
                  </div>
                  <div className="space-y-0.5 text-left">
                    <div className="flex items-center gap-2.5">
                      <h4 className="text-[16px] md:text-[18px] font-semibold tracking-tight text-foreground">{post.user}</h4>
                    </div>
                    <p className="text-[13px] font-medium text-muted-foreground/60">{post.role}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleConnect(post.userId)}
                  disabled={post.userId === user?.id}
                  className="px-5 py-2 bg-primary text-background text-[12px] font-bold rounded-sm hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-30 active:scale-95 shadow-md shadow-primary/10"
                >
                  <UserPlus className="h-3.5 w-3.5" /> {post.userId === user?.id ? "Profile" : "Connect"}
                </button>
              </div>

              <div className="space-y-3 text-left">
                <p className="text-[14px] leading-relaxed font-medium text-foreground/70">
                  "{post.content}"
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {post.skills?.map((skill) => (
                    <span key={skill} className="text-[9px] font-bold uppercase tracking-widest text-primary/50 px-2 py-0.5 bg-primary/5 rounded-sm border border-primary/10">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          )
        }

        const isLiked = userLikes.includes(post.id)
        return (
          <article key={post.id} className="p-6 md:p-10 bg-background border border-border/20 rounded-sm hover:border-primary/20 transition-all group/card relative overflow-hidden backdrop-blur-sm">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -z-10 opacity-0 group-hover/card:opacity-100 transition-opacity" />
            <div className="flex items-center justify-between gap-6 mb-8">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-sm bg-secondary border border-border/10 flex items-center justify-center text-[13px] font-bold uppercase text-primary/60 group-hover/card:border-primary transition-all overflow-hidden shrink-0">
                  {post.avatar_url ? (
                    <img src={post.avatar_url} alt={post.user} className="h-full w-full object-cover" />
                  ) : (
                    post.user[0]
                  )}
                </div>
                <div className="space-y-0.5 text-left">
                  <h4 className="text-[14px] md:text-[15px] font-semibold tracking-tight text-foreground">{post.user}</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] md:text-[11px] font-medium text-muted-foreground/50">{post.role}</span>
                    <span className="text-muted-foreground/20 text-[8px]">•</span>
                    <span className="text-[10px] md:text-[11px] font-medium text-muted-foreground/30">{post.timestamp}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className={cn(
                  "px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase",
                  post.type === 'UPDATE' ? "bg-amber-500/10 text-amber-600" :
                    post.type === 'HELP' ? "bg-red-500/10 text-red-600" :
                      post.type === 'TEAM' ? "bg-blue-500/10 text-blue-600" : "bg-emerald-500/10 text-emerald-600"
                )}>
                  {post.type === 'UPDATE' ? 'Sync' : post.type}
                </div>
                {post.userId === user?.id && (
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className="p-1.5 text-muted-foreground/30 hover:text-red-500 transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
            <div className="space-y-5 text-left mb-6">
              <p className="text-[14px] md:text-[15px] leading-relaxed font-medium text-foreground/80 whitespace-pre-wrap">
                {post.content}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {post.tags.map((tag: string) => (
                  <span key={tag} className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/50 px-2 py-0.5 bg-secondary/40 rounded-sm border border-border/10">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="pt-4 border-t border-border/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <button
                  onClick={() => handleLike(post.id)}
                  className={cn(
                    "flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-all",
                    isLiked ? "text-primary" : "text-muted-foreground/30 hover:text-primary"
                  )}
                >
                  <Heart className={cn("h-3.5 w-3.5", isLiked && "fill-current")} /> {post.likes}
                </button>
                <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/30 hover:text-primary transition-all">
                  <MessageCircle className="h-3.5 w-3.5" /> {post.comments}
                </button>
              </div>
              <button
                onClick={() => handleConnect(post.userId)}
                disabled={post.userId === user?.id}
                className="px-4 py-1.5 text-[12px] font-bold border border-border/20 text-muted-foreground hover:bg-primary hover:text-background transition-all rounded-sm flex items-center justify-center gap-2 active:scale-95 disabled:opacity-30"
              >
                <UserPlus className="h-3.5 w-3.5" /> {post.userId === user?.id ? "Own Post" : "Connect"}
              </button>
            </div>
          </article>
        )
      })}
    </div>
  )
}
