"use client"

import * as React from "react"
import { createClient } from "@/lib/supabase"
import { GlobalHeader } from "@/components/common/global-header"
import { Globe, Briefcase, MapPin, Search, LinkIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

export default function DirectoryPage() {
  const supabase = createClient()
  const [profiles, setProfiles] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [searchTerm, setSearchTerm] = React.useState("")

  React.useEffect(() => {
    async function fetchProfiles() {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('updated_at', { ascending: false })
      
      if (!error && data) {
        setProfiles(data)
      }
      setIsLoading(false)
    }
    fetchProfiles()
  }, [supabase])

  const filteredProfiles = profiles.filter(p => 
    p.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.skills?.some((s: string) => s.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <GlobalHeader />
      
      <main className="flex-1 container mx-auto py-16 px-4 md:px-6">
        <div className="flex flex-col gap-12">
          {/* Header & Filter */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-3">
              <h1 className="text-4xl font-semibold tracking-tighter">Developer Directory</h1>
              <p className="text-muted-foreground font-medium uppercase tracking-[0.2em] text-[10px]">The National Technical Grid</p>
            </div>
            
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search by name, role, or skill..."
                className="w-full bg-transparent border-b border-border/80 pl-10 py-2 focus:outline-none focus:border-primary transition-colors text-sm font-medium tracking-tight"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="h-64 bg-secondary/20 animate-pulse rounded-sm border border-border/40"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border rounded-sm overflow-hidden">
              {filteredProfiles.map((p) => (
                <div key={p.id} className="bg-background p-8 md:p-10 space-y-6 hover:bg-secondary/10 transition-colors group">
                  <div className="flex items-start justify-between">
                     <div className="flex flex-col items-center justify-center h-12 w-12 rounded-full bg-secondary italic font-black text-muted-foreground/40 text-sm border border-border/50">
                        {p.full_name?.split(' ').map((n: string) => n[0]).join('')}
                     </div>
                     <span className={cn(
                       "px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest rounded-full border border-border/60",
                       p.availability === "Open to work" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-secondary text-muted-foreground"
                     )}>
                       {p.availability}
                     </span>
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold tracking-tight">{p.full_name}</h3>
                    <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium uppercase tracking-widest">
                       <Briefcase className="h-3 w-3" /> {p.role}
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 min-h-[2.5rem]">
                    {p.bio || "Building the future of technical collaboration in Bhutan."}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {p.skills?.slice(0, 4).map((s: string, i: number) => (
                      <span key={i} className="px-2 py-0.5 border border-border/60 text-[10px] font-bold rounded-sm bg-background group-hover:bg-background/50 transition-colors">{s}</span>
                    ))}
                    {p.skills?.length > 4 && <span className="text-[10px] font-bold text-muted-foreground/60">+{p.skills.length - 4} more</span>}
                  </div>

                  <div className="pt-4 flex items-center gap-4">
                    {p.github_url && (
                      <Link href={p.github_url} className="text-muted-foreground hover:text-foreground transition-colors">
                        <LinkIcon className="h-4 w-4" />
                      </Link>
                    )}
                    {p.portfolio_url && (
                      <Link href={p.portfolio_url} className="text-muted-foreground hover:text-foreground transition-colors">
                        <Globe className="h-4 w-4" />
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && filteredProfiles.length === 0 && (
            <div className="py-20 text-center space-y-4">
              <p className="text-muted-foreground font-medium">No developers match your search yet.</p>
              <Link href="/join" className="text-primary font-bold underline">Be the first to join this category</Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
