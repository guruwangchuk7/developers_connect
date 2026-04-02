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
    <div className={cn("grid gap-6", isGrid ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:gap-10")}>
      {posts.map((post) => {
        // Special UI for Developer Joined/Updated items
        if (post.type === 'DEVELOPER') {
          return (
            <article key={post.id} className="p-8 md:p-10 bg-secondary/10 border border-border/20 rounded-sm hover:border-primary/20 transition-all group/card relative overflow-hidden backdrop-blur-sm">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -z-10 opacity-50" />
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div className="flex items-center gap-6">
                  <div className="h-16 w-16 md:h-20 md:w-20 rounded-full bg-background border-2 border-primary/20 p-1 group-hover/card:border-primary transition-all duration-500">
                    <div className="h-full w-full rounded-full bg-secondary flex items-center justify-center text-[20px] md:text-[24px] font-black uppercase text-primary/60 group-hover/card:bg-primary group-hover/card:text-background transition-all">
                      {post.user[0]}
                    </div>
                  </div>
                  <div className="space-y-1 text-left">
                    <div className="flex items-center gap-3">
                      <h4 className="text-[18px] md:text-[22px] font-bold tracking-tight text-foreground">{post.user}</h4>
                      <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full">Member Spotlight</span>
                    </div>
                    <p className="text-[14px] font-medium text-muted-foreground/60">{post.role}</p>
                    <p className="text-[11px] font-medium text-muted-foreground/30">Active recently</p>
                  </div>
                </div>
                <button
                  onClick={() => handleConnect(post.userId)}
                  disabled={post.userId === user?.id}
                  className="px-6 py-2.5 bg-primary text-background text-[13px] font-bold rounded-sm hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-30 active:scale-95 shadow-lg shadow-primary/20"
                >
                  <UserPlus className="h-4 w-4" /> {post.userId === user?.id ? "Your Profile" : "Connect"}
                </button>
              </div>

              <div className="space-y-4 text-left">
                <p className="text-[15px] leading-relaxed font-medium text-foreground/80 font-inter italic">
                  "{post.content}"
                </p>
                <div className="flex flex-wrap gap-2">
                  {post.skills?.map((skill) => (
                    <span key={skill} className="text-[10px] font-black uppercase tracking-widest text-primary/50 px-2.5 py-1 bg-primary/5 rounded-sm border border-primary/10">
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
          <article key={post.id} className="p-8 md:p-12 bg-background border border-border/40 rounded-sm hover:border-primary/20 transition-all group/card relative overflow-hidden backdrop-blur-sm">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -z-10 opacity-0 group-hover/card:opacity-100 transition-opacity" />
            <div className="flex items-center justify-between gap-6 mb-10">
              <div className="flex items-center gap-4 md:gap-6">
                <div className="h-10 w-10 md:h-12 md:w-12 rounded-sm bg-secondary border border-border/20 flex items-center justify-center text-[13px] md:text-[14px] font-black uppercase text-primary/60 group-hover/card:bg-primary group-hover/card:text-background transition-all">
                  {post.user[0]}
                </div>
                <div className="space-y-0.5 text-left">
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
                  post.type === 'UPDATE' ? "bg-amber-500/10 text-amber-600" :
                    post.type === 'HELP' ? "bg-red-500/10 text-red-600" :
                      post.type === 'TEAM' ? "bg-blue-500/10 text-blue-600" : "bg-emerald-500/10 text-emerald-600"
                )}>
                  {post.type === 'UPDATE' ? 'Sync' : post.type}
                </div>
                {post.id.startsWith('mock-') === false && post.userId === user?.id && (
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
              <p className="text-[15px] leading-relaxed font-medium text-foreground/80 font-inter whitespace-pre-wrap">
                {post.content}
              </p>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag: string) => (
                  <span key={tag} className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-2.5 py-1 bg-secondary/60 rounded-sm border border-border/20 transition-colors hover:border-primary/20">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="pt-5 md:pt-6 border-t border-border/20 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
              <div className="flex items-center gap-6 md:gap-8">
                <button
                  onClick={() => handleLike(post.id)}
                  className={cn(
                    "flex items-center gap-2 text-[10px] md:text-[10px] font-black uppercase tracking-widest transition-all group/btn",
                    isLiked ? "text-primary" : "text-muted-foreground/40 hover:text-primary"
                  )}
                >
                  <Heart className={cn("h-4 w-4 transition-transform group-hover/btn:scale-110", isLiked && "fill-current")} /> {post.likes}
                </button>
                <button className="flex items-center gap-2 text-[10px] md:text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 hover:text-primary transition-all group/btn">
                  <MessageCircle className="h-4 w-4 transition-transform group-hover/btn:scale-110" /> {post.comments}
                </button>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleConnect(post.userId)}
                  disabled={post.userId === user?.id}
                  className="flex-1 md:flex-none justify-center px-4 md:px-5 py-2 text-[12px] md:text-[13px] font-bold border border-border/40 hover:bg-primary hover:text-background transition-all rounded-sm flex items-center gap-2 disabled:opacity-30 active:scale-95 shadow-sm"
                >
                  <UserPlus className="h-3.5 w-3.5" /> {post.userId === user?.id ? "Your Post" : "Connect"}
                </button>
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}
