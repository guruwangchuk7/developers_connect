"use client"

import * as React from "react"
import { createClient } from "@/lib/supabase"
import { GlobalHeader } from "@/components/common/global-header";
import { GlobalFooter } from "@/components/common/global-footer";
import { MessageSquare, ThumbsUp, Eye, Search, AlertCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function FeedPage() {
  const supabase = createClient()
  const [helpPosts, setHelpPosts] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [searchTerm, setSearchTerm] = React.useState("")

  React.useEffect(() => {
    async function fetchHelp() {
      const { data, error } = await supabase
        .from('posts')
        .select(`*, profiles!user_id (full_name)`)
        .eq('type', 'HELP')
        .order('created_at', { ascending: false })

      if (!error && data) {
        setHelpPosts(data.map((p: any) => {
          const contentLines = p.content.split('\n')
          const title = contentLines[0]?.replace('BLOCKER: ', '').replace('MILESTONE: ', '') || p.content.substring(0, 50)
          const description = contentLines[2]?.replace('CONTEXT: ', '') || p.content
          const stack = contentLines[1]?.replace('STACK: ', '') || ''

          return {
            id: p.id,
            title,
            description,
            author: p.profiles?.full_name || 'Anonymous',
            stack: stack ? stack.split(',').map((s: string) => s.trim()) : [],
            replies: p.comments_count || 0,
            likes: p.likes_count || 0,
            tags: p.tags || [],
            urgent: p.content.includes('URGENT')
          }
        }))
      }
      setIsLoading(false)
    }
    fetchHelp()
  }, [])

  const filteredPosts = helpPosts.filter((p: any) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.stack.some((s: string) => s.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-primary/5">
      <GlobalHeader />
      <main className="flex-1">
        <section className="py-16 md:py-24 lg:py-32">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 md:mb-24">
              <div className="space-y-4">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tighter">
                  Technical Help Feed
                </h1>
                <p className="text-muted-foreground font-medium leading-relaxed text-[15px] max-w-2xl">
                  Real-time assistance from vetted professionals across the national ecosystem.
                </p>
              </div>

              <div className="relative w-full md:w-80">
                <Search className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search technical questions..."
                  className="w-full bg-transparent border-b border-border/80 pl-8 py-3 focus:outline-none focus:border-primary transition-colors text-[13px] font-semibold tracking-tight placeholder:text-muted-foreground/40"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-px">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="h-80 bg-secondary/20 animate-pulse rounded-sm"></div>
                ))}
              </div>
            ) : filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post) => (
                  <HelpCard
                    key={post.id}
                    title={post.title}
                    description={post.description}
                    author={post.author}
                    stack={post.stack}
                    replies={post.replies}
                    views={post.likes * 7 + 12} // Simulation of views
                    tags={post.tags}
                    urgent={post.urgent}
                  />
                ))}
              </div>
            ) : (
              <div className="py-24 text-center border border-dashed border-border rounded-sm">
                <p className="text-muted-foreground font-medium underline underline-offset-4 decoration-primary/30">No active help requests found in the current synchronization cycle.</p>
              </div>
            )}

            <div className="mt-20 py-16 bg-secondary/10 px-8 flex flex-col md:flex-row items-center justify-between rounded-sm border border-border overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="space-y-4 max-w-xl text-center md:text-left mb-10 md:mb-0 relative z-10">
                <h3 className="text-2xl md:text-3xl font-bold tracking-tight">Facing a technical blocker?</h3>
                <p className="text-muted-foreground font-medium text-[14px]">
                  Join the network today to post your questions and get answers from our vetted pool of experts within hours.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 relative z-10">
                <Link href="/join" className="px-10 py-4 bg-primary text-primary-foreground font-bold rounded-sm hover:opacity-90 transition-opacity text-center text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-primary/10">
                  Sign in to post
                </Link>
                <Link href="/about" className="px-10 py-4 bg-background border border-border text-foreground font-bold rounded-sm hover:bg-secondary/50 transition-colors text-center text-[11px] uppercase tracking-[0.2em]">
                  How it works
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <GlobalFooter />
    </div>
  );
}

function HelpCard({ title, description, author, stack, replies, views, tags, urgent }: {
  title: string,
  description: string,
  author: string,
  stack: string[],
  replies: number,
  views: number,
  tags: string[],
  urgent?: boolean
}) {
  return (
    <div className="bg-background p-8 md:p-12 space-y-8 hover:bg-secondary/5 transition-all group relative h-full flex flex-col justify-between border border-border/40 rounded-sm">
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary/60 px-2 py-0.5 bg-primary/5 rounded-sm">
            Technical Request
          </span>
          {urgent && (
            <div className="flex items-center gap-1.5 px-2 py-1 bg-red-50 text-red-600 border border-red-100 rounded-sm text-[9px] font-bold uppercase tracking-widest">
              <AlertCircle className="h-3 w-3" /> Urgent
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-[22px] md:text-[24px] font-black tracking-tighter leading-tight group-hover:text-primary transition-colors">{title}</h3>

          {stack.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {stack.map((s, i) => (
                <span key={i} className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/40 px-2 py-0.5 bg-secondary/30 rounded-full border border-border/10">
                  {s}
                </span>
              ))}
            </div>
          )}

          <p className="text-[14px] md:text-[15px] font-medium text-muted-foreground leading-relaxed line-clamp-4">
            {description}
          </p>
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {tags.map((tag, i) => (
              <span key={i} className="text-[10px] font-bold text-primary/60 hover:underline cursor-pointer">
                #{tag.toLowerCase().replace(' ', '')}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="pt-10 space-y-6">
        <div className="flex items-center justify-between border-t border-border pt-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-[10px] font-black uppercase text-primary/60 border border-border/10">
              {author[0]}
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">Posted by</span>
              <span className="text-[13px] font-bold text-foreground">{author}</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-muted-foreground/40 font-bold text-[10px] uppercase tracking-wider">
            <div className="flex items-center gap-1.5">
              <MessageSquare className="h-3.5 w-3.5" /> {replies}
            </div>
            <div className="flex items-center gap-1.5">
              <Eye className="h-3.5 w-3.5" /> {views}
            </div>
          </div>
        </div>

        <button className="w-full py-3 bg-secondary/20 hover:bg-primary hover:text-background transition-all text-[11px] font-bold uppercase tracking-widest rounded-sm">
          View Details →
        </button>
      </div>
    </div>
  );
}
