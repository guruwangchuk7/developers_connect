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
            category: stack || 'General',
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
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-primary/5">
      <GlobalHeader />
      <main className="flex-1">
        <section className="py-16 md:py-24 lg:py-32">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 md:mb-24">
              <div className="space-y-4">
                <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold tracking-tighter">
                  Technical Help Feed
                </h1>
                <p className="text-muted-foreground text-sm font-medium leading-relaxed md:text-lg max-w-2xl">
                  Real-time assistance from vetted professionals across the national ecosystem.
                </p>
              </div>

              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search technical questions..."
                  className="w-full bg-transparent border-b border-border/80 pl-10 py-3 focus:outline-none focus:border-primary transition-colors text-sm font-medium tracking-tight"
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
                    category={post.category}
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

            <div className="mt-20 py-16 bg-secondary/10 px-8 flex flex-col md:flex-row items-center justify-between rounded-sm border border-border">
              <div className="space-y-4 max-w-xl text-center md:text-left mb-10 md:mb-0">
                <h3 className="text-2xl md:text-3xl font-bold tracking-tight">Facing a technical blocker?</h3>
                <p className="text-muted-foreground font-medium text-[14px]">
                  Join the network today to post your questions and get answers from our vetted pool of experts within hours.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/join" className="px-8 py-3 bg-primary text-primary-foreground font-bold rounded-sm hover:opacity-90 transition-opacity text-center text-[10px] uppercase tracking-[0.2em]">
                  Sign in to post
                </Link>
                <Link href="/about" className="px-8 py-3 bg-background border border-border text-foreground font-bold rounded-sm hover:bg-secondary/50 transition-colors text-center text-[10px] uppercase tracking-[0.2em]">
                  Learn how it works
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

function HelpCard({ title, description, author, category, replies, views, tags, urgent }: {
  title: string,
  description: string,
  author: string,
  category: string,
  replies: number,
  views: number,
  tags: string[],
  urgent?: boolean
}) {
  return (
    <div className="bg-background p-8 md:p-10 space-y-6 hover:bg-secondary/10 transition-colors group">
      <div className="flex items-start justify-between">
        <span className="text-[9px] font-bold uppercase tracking-widest text-primary/40 group-hover:text-primary transition-colors">
          {category}
        </span>
        {urgent && (
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-red-50 text-red-600 border border-red-100 rounded-full text-[9px] font-bold uppercase tracking-widest animate-pulse">
            <AlertCircle className="h-3 w-3" /> Urgent
          </div>
        )}
      </div>

      <div className="space-y-3">
        <h3 className="text-xl font-bold tracking-tight group-hover:underline cursor-pointer decoration-2 decoration-primary/20 line-clamp-2">{title}</h3>
        <p className="text-[13px] text-muted-foreground leading-relaxed line-clamp-3 overflow-hidden text-ellipsis h-16">
          {description}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 pt-2">
        {tags.map((tag, i) => (
          <span key={i} className="text-[10px] font-bold border border-border/50 px-2 py-0.5 rounded-sm bg-secondary/10">
            #{tag.toLowerCase().replace(' ', '')}
          </span>
        ))}
        {tags.length === 0 && <span className="text-[10px] font-bold text-muted-foreground/30 italic">No tags</span>}
      </div>

      <div className="pt-6 border-t flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center text-[8px] font-black italic text-muted-foreground/60 border border-border/30">
              {author[0]}
            </div>
            <span className="text-[11px] font-bold text-muted-foreground/70">{author}</span>
          </div>
          <div className="flex items-center gap-4 text-muted-foreground/60 font-semibold text-[10px]">
            <div className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3" /> {replies}
            </div>
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3" /> {views}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
