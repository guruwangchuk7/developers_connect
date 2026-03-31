"use client"

import * as React from "react"
import { createClient } from "@/lib/supabase"
import { GlobalHeader } from "@/components/common/global-header"
import { GlobalFooter } from "@/components/common/global-footer"
import { Globe, Briefcase, MapPin, Search, LinkIcon, Award } from "lucide-react"
import { Github } from "@/components/icons"
import { cn } from "@/lib/utils"
import Link from "next/link"

const MOCK_PROFILES = [
  {
    id: "mock-1",
    full_name: "Tashi Dorji",
    role: "Senior Frontend Engineer",
    bio: "Passionate about building accessible and high-performance web applications for the national digital economy. Expert in React and Tailwind v4.",
    availability: "Open to work",
    skills: ["React", "TypeScript", "Tailwind CSS", "Next.js"],
    github_url: "#",
    portfolio_url: "#"
  },
  {
    id: "mock-2",
    full_name: "Pema Yangzom",
    role: "Full Stack Developer",
    bio: "Specializing in scalable backend architectures and secure data exchange protocols. Building the future of Bhutan's fintech ecosystem.",
    availability: "Full-time",
    skills: ["Node.js", "PostgreSQL", "Supabase", "Go"],
    github_url: "#",
    portfolio_url: "#"
  },
  {
    id: "mock-3",
    full_name: "Karma Wangchuk",
    role: "UI/UX Designer & Developer",
    bio: "Bridging the gap between aesthetics and functionality. Focused on creating a standardized design system for Bhutanese digital services.",
    availability: "Contract",
    skills: ["Figma", "React", "Framer Motion", "CSS"],
    github_url: "#",
    portfolio_url: "#"
  },
  {
    id: "mock-4",
    full_name: "Sonam Pelden",
    role: "Data Scientist",
    bio: "Applying machine learning to optimize public service delivery and agricultural yield predictions in the national context.",
    availability: "Open to work",
    skills: ["Python", "PyTorch", "Pandas", "GROQ"],
    github_url: "#",
    portfolio_url: "#"
  },
  {
    id: "mock-5",
    full_name: "Jigme Tenzin",
    role: "Mobile App Developer",
    bio: "Developing cross-platform mobile solutions for local businesses and community-driven initiatives. React Native specialist.",
    availability: "Full-time",
    skills: ["React Native", "Expo", "Firebase", "Swift"],
    github_url: "#",
    portfolio_url: "#"
  },
  {
    id: "mock-6",
    full_name: "Yangchen Lhamo",
    role: "SecOps Engineer",
    bio: "Securing the national technical grid through rigorous audits and automated threat detection systems.",
    availability: "Contract",
    skills: ["AWS", "Docker", "Terraform", "Security"],
    github_url: "#",
    portfolio_url: "#"
  }
];

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

      if (!error && data && data.length > 0) {
        // Interleave mock data with real data for a rich feel
        setProfiles([...data, ...MOCK_PROFILES])
      } else {
        setProfiles(MOCK_PROFILES)
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

      <main className="flex-1 container mx-auto py-12 md:py-24 px-4 md:px-6">
        <div className="flex flex-col gap-16 md:gap-24">
          {/* Header & Filter */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
            <div className="space-y-4 max-w-2xl">
              <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold tracking-tighter">Developer Directory</h1>
              <p className="text-muted-foreground text-sm font-medium leading-relaxed md:text-lg">
                The verified talent layer of the Bhutanese tech ecosystem. Find collaborators for your next project.
              </p>
            </div>

            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name, role, or skill..."
                className="w-full bg-transparent border-b border-border/80 pl-10 py-3 focus:outline-none focus:border-primary transition-colors text-sm font-medium tracking-tight"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-80 bg-secondary/20 animate-pulse rounded-sm border border-border/40"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-px md:bg-border md:border border-border rounded-sm overflow-hidden">
              {filteredProfiles.map((p) => (
                <div key={p.id} className="bg-background p-8 md:p-12 space-y-8 hover:bg-secondary/10 transition-colors group relative overflow-hidden">
                  <div className="flex items-start justify-between relative z-10">
                    <div className="flex flex-col items-center justify-center h-14 w-14 rounded-sm bg-secondary italic font-black text-muted-foreground/40 text-lg border border-border/50 group-hover:scale-110 transition-transform">
                      {p.full_name?.split(' ').map((n: string) => n[0]).join('')}
                    </div>
                    <span className={cn(
                      "px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full border shadow-sm",
                      p.availability === "Open to work"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-secondary text-muted-foreground border-border/60"
                    )}>
                      {p.availability}
                    </span>
                  </div>

                  <div className="space-y-4 relative z-10">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-2xl font-bold tracking-tight">{p.full_name}</h3>
                        {p.id.startsWith('mock') && <Award className="h-4 w-4 text-primary/40" />}
                      </div>
                      <div className="flex items-center gap-2 text-primary/60 text-[10px] font-bold uppercase tracking-[0.2em]">
                        {p.role}
                      </div>
                    </div>
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed line-clamp-3 min-h-[4.5rem]">
                      {p.bio || "Building the future of technical collaboration in Bhutan."}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 relative z-10">
                    {p.skills?.slice(0, 4).map((s: string, i: number) => (
                      <span key={i} className="px-2.5 py-1 border border-border/60 text-[11px] font-bold rounded-sm bg-secondary/20 group-hover:bg-background transition-colors">{s}</span>
                    ))}
                    {p.skills?.length > 4 && <span className="text-[11px] font-bold text-muted-foreground/40 self-center">+{p.skills.length - 4}</span>}
                  </div>

                  <div className="pt-8 border-t flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-5">
                      {p.github_url && (
                        <Link href={p.github_url} className="text-muted-foreground hover:text-foreground transition-colors">
                          <Github className="h-4 w-4" />
                        </Link>
                      )}
                      {p.portfolio_url && (
                        <Link href={p.portfolio_url} className="text-muted-foreground hover:text-foreground transition-colors">
                          <Globe className="h-4 w-4" />
                        </Link>
                      )}
                    </div>
                    <button className="text-[10px] font-bold uppercase tracking-[0.15em] text-primary/60 hover:text-primary transition-colors">
                      View Profile →
                    </button>
                  </div>

                  {/* Decorative background element */}
                  <div className="absolute -right-4 -bottom-4 h-24 w-24 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors"></div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && filteredProfiles.length === 0 && (
            <div className="py-24 text-center space-y-6">
              <div className="h-12 w-12 bg-secondary rounded-full flex items-center justify-center mx-auto">
                <Search className="h-6 w-6 text-muted-foreground/40" />
              </div>
              <div className="space-y-2">
                <p className="text-muted-foreground text-lg font-medium">No developers match your search yet.</p>
                <p className="text-muted-foreground/60 text-sm">Try using different keywords or categories.</p>
              </div>
              <Link href="/join" className="inline-block px-8 py-3 bg-primary text-primary-foreground font-bold rounded-sm hover:opacity-90 transition-opacity uppercase tracking-widest text-xs">
                Be the first to join
              </Link>
            </div>
          )}
        </div>
      </main>
      <GlobalFooter />
    </div>
  )
}
