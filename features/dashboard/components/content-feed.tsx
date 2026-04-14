"use client"

import * as React from "react"
import Link from "next/link"
import { Heart, MessageCircle, X, UserPlus } from "lucide-react"
import { cn } from "@/lib/utils"

import { FeedPost, Profile } from "@/types"

interface ContentFeedProps {
  posts: FeedPost[]
  user: Profile | null
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
  if (posts.length === 0) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in duration-700">
        <div className="h-12 w-12 rounded-full bg-secondary/30 flex items-center justify-center border border-border/20">
          <MessageCircle className="h-5 w-5 text-muted-foreground/40" />
        </div>
        <div className="space-y-1">
          <h3 className="text-[15px] font-semibold text-foreground">No updates found</h3>
          <p className="text-[12px] text-muted-foreground/60">Be the first to share an update with the network.</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("grid gap-6", isGrid ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:gap-8")}>
      {posts.map((post) => {
        // Special UI for Developer Joined/Updated items
        if (post.type === 'DEVELOPER') {
          return (
            <article key={post.id} className="p-6 md:p-8 bg-secondary/5 border border-border/20 rounded-sm hover:border-primary/20 transition-all group/card relative overflow-hidden backdrop-blur-sm">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -z-10 opacity-50" />

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-6">
                <Link href={`/profile/${post.userId}`} className="flex items-center gap-4 group/user">
                  <div className="h-12 w-12 md:h-14 md:w-14 rounded-full bg-background border border-primary/20 p-1 group-hover/card:border-primary group-hover/user:ring-2 group-hover/user:ring-primary/20 transition-all duration-500 overflow-hidden">
                    {post.avatar_url ? (
                      <img
                        src={post.avatar_url}
                        alt={post.user}
                        className="h-full w-full rounded-full object-cover"
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                      />
                    ) : (
                      <div className="h-full w-full rounded-full bg-secondary flex items-center justify-center text-[16px] md:text-[18px] font-bold uppercase text-primary/60 group-hover/card:bg-primary group-hover/card:text-background transition-all">
                        {post.user[0]}
                      </div>
                    )}
                  </div>
                  <div className="space-y-0.5 text-left">
                    <div className="flex items-center gap-2.5">
                      <h4 className="text-[16px] md:text-[18px] font-semibold tracking-tight text-foreground group-hover/user:text-primary transition-colors">{post.user}</h4>
                    </div>
                    <p className="text-[13px] font-medium text-muted-foreground/60">{post.role}</p>
                  </div>
                </Link>
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
                    <span key={skill} className="text-[9px] font-bold uppercase tracking-widest text-primary/60 px-2 py-0.5 bg-primary/5 rounded-sm border border-primary/10">
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
              <Link href={`/profile/${post.userId}`} className="flex items-center gap-4 group/user">
                <div className="h-10 w-10 rounded-full bg-secondary border border-border/10 flex items-center justify-center text-[13px] font-bold uppercase text-primary/60 group-hover/card:border-primary group-hover/user:ring-2 group-hover/user:ring-primary/20 transition-all overflow-hidden shrink-0">
                  {post.avatar_url ? (
                    <img src={post.avatar_url} alt={post.user} className="h-full w-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                  ) : (
                    post.user[0]
                  )}
                </div>
                <div className="space-y-0.5 text-left">
                  <h4 className="text-[14px] md:text-[15px] font-semibold tracking-tight text-foreground group-hover/user:text-primary transition-colors">{post.user}</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] md:text-[11px] font-medium text-muted-foreground/60">{post.role}</span>
                    <span className="text-muted-foreground/20 text-[8px]">•</span>
                    <span className="text-[10px] md:text-[11px] font-medium text-muted-foreground/60">{post.timestamp}</span>
                  </div>
                </div>
              </Link>
              <div className="flex items-center gap-1">
                <div className={cn(
                  "px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase",
                  post.type === 'UPDATE' ? "bg-amber-500/10 text-amber-600" :
                    post.type === 'HELP' ? "bg-red-500/10 text-red-600" :
                      post.type === 'TEAM' ? "bg-blue-500/10 text-blue-600" : "bg-emerald-500/10 text-emerald-600"
                )}>
                  {post.type === 'UPDATE' ? 'Update' : post.type}
                </div>
                {post.userId === user?.id && (
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className="p-3 -m-1.5 text-muted-foreground/40 hover:text-red-500 transition-colors"
                    title="Delete Post"
                  >
                    <X className="h-4 w-4" />
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
                  <span key={tag} className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60 px-2 py-0.5 bg-secondary/40 rounded-sm border border-border/10">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="pt-4 border-t border-border/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4 md:gap-6">
                <button
                  onClick={() => handleLike(post.id)}
                  className={cn(
                    "flex items-center gap-2.5 text-[10px] font-bold uppercase tracking-widest transition-all p-2 -m-2",
                    isLiked ? "text-primary" : "text-muted-foreground/40 hover:text-primary"
                  )}
                >
                  <Heart className={cn("h-4 w-4", isLiked && "fill-current")} /> {post.likes}
                </button>
                <button className="flex items-center gap-2.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40 hover:text-primary transition-all p-2 -m-2">
                  <MessageCircle className="h-4 w-4" /> {post.comments}
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

