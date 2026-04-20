"use client"

import * as React from "react"
import { GlobalHeader } from "@/components/common/global-header"
import { GlobalFooter } from "@/components/common/global-footer"
import { ArrowRight, Briefcase, Zap, Shield, BarChart3, Palette, Terminal, Search, Send } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button-variants"

const roles = [
  {
    slug: "frontend-designer",
    title: "Frontend Designer",
    icon: <Palette className="h-6 w-6" />,
    description: "Craft pixel-perfect, high-fidelity user experiences and interactive interfaces for the next generation of our platform.",
    tags: ["React", "Tailwind", "Figma", "UI/UX"],
    availability: "1 Open Slot"
  },
  {
    slug: "backend-developer",
    title: "Backend Developer",
    icon: <Terminal className="h-6 w-6" />,
    description: "Architect scalable server-side systems, manage database synchronization protocols, and optimize high-performance APIs.",
    tags: ["Node.js", "PostgreSQL", "Edge Functions", "Security"],
    availability: "1 Open Slot"
  },
  {
    slug: "security-engineer",
    title: "Security Engineer",
    icon: <Shield className="h-6 w-6" />,
    description: "Harden our technical node ecosystem, implement advanced encryption protocols, and ensure absolute data integrity.",
    tags: ["Cybersecurity", "Protocols", "Authentication", "Auditing"],
    availability: "1 Open Slot"
  },
  {
    slug: "business-analyst",
    title: "Business Analyst",
    icon: <BarChart3 className="h-6 w-6" />,
    description: "Translate complex system metrics into actionable technical roadmaps and bridge the gap between engineering and growth.",
    tags: ["Strategy", "Data Analysis", "Roadmapping", "Tech Specs"],
    availability: "1 Open Slot"
  }
]

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans selection:bg-primary/10">
      <GlobalHeader />

      <main className="flex-1 flex flex-col items-center">
        {/* HERO SECTION */}
        <section className="w-full max-w-7xl px-4 md:px-8 pt-20 pb-12 md:pt-32 md:pb-24 border-b border-border/10 text-center md:text-left">
          <div className="max-w-3xl space-y-6">
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight leading-[1.1]">
              Architecting the future of Bhutan's technical ecosystem.
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
              We're building a synchronized network for developers and designers. Explore our open technical slots and help us push the boundaries of what's possible.
            </p>
          </div>
        </section>

        {/* OPEN SLOTS */}
        <section className="w-full max-w-7xl px-4 md:px-8 py-20 pb-32">
          <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
             <div className="space-y-2">
                <h2 className="text-2xl font-semibold tracking-tight">Open Technical Slots</h2>
                <p className="text-sm text-muted-foreground uppercase tracking-widest font-medium">Currently seeking 4 specialized nodes</p>
             </div>
             <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground/40 uppercase tracking-widest bg-secondary/20 px-4 py-2 rounded-lg border border-border/10">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Active Hiring Cycle
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {roles.map((role) => (
              <div 
                key={role.title}
                className="group relative p-8 bg-background border border-border/60 rounded-2xl hover:border-primary/40 transition-all hover:bg-secondary/5 overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                   {role.icon}
                </div>
                
                <div className="space-y-6 relative z-10">
                  <div className="flex items-center gap-4">
                     <div className="h-12 w-12 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary">
                        {role.icon}
                     </div>
                     <div>
                        <h3 className="text-xl font-bold">{role.title}</h3>
                        <span className="text-[10px] font-normal uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{role.availability}</span>
                     </div>
                  </div>

                  <p className="text-[14px] text-muted-foreground/80 leading-relaxed font-medium">
                    {role.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {role.tags.map(tag => (
                      <span key={tag} className="px-2.5 py-1 bg-secondary/50 rounded-md text-[10px] font-bold text-muted-foreground/80 uppercase tracking-widest border border-border/40">
                         {tag}
                      </span>
                    ))}
                  </div>

                  <div className="pt-4">
                    <Link 
                      href={`/careers/${role.slug}`}
                      className="inline-flex items-center gap-2 text-sm font-bold text-primary group-hover:gap-3 transition-all"
                    >
                      View Details <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <GlobalFooter />
    </div>
  )
}

