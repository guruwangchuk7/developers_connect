"use client"

import * as React from "react"
import { 
  LayoutGrid, 
  Search, 
  Users, 
  Trophy, 
  MessageSquare, 
  Share2, 
  Activity,
  Flame,
  Zap,
  ShieldCheck,
  Target
} from "lucide-react"
import { cn } from "@/lib/utils"

export function Help() {
  const guides = [
    {
      title: "The Network Feed",
      description: "Your central hub for collaboration. Switch between tabs to see different types of activity.",
      icon: LayoutGrid,
      steps: [
        { label: "Feed", detail: "A unified stream of all network updates and member activity." },
        { label: "Help", detail: "A dedicated space for technical blockers and architectural advice." },
        { label: "Projects", detail: "Showcase area for products and tools built within the community." }
      ]
    },
    {
      title: "How to Contribute",
      description: "Contributing useful technical content is how you build your reputation in the network.",
      icon: Share2,
      steps: [
        { label: "Post Update", detail: "Share a technical milestone or a breakthrough you just achieved." },
        { label: "Developers Needed", detail: "Recruit specialized talent for specific technical challenges." },
        { label: "Share Project", detail: "Launch your application or library to get feedback and users." }
      ]
    },
    {
      title: "Developer Discovery",
      description: "Find and connect with technical experts across Bhutan using our specialized search.",
      icon: Search,
      steps: [
        { label: "Search by Skill", detail: "Search by specific frameworks, languages, or tech stack." },
        { label: "Connect", detail: "Request a connection to start collaborating on projects." },
        { label: "Direct Messages", detail: "Once connected, you can use the workspace to discuss details." }
      ]
    },
    {
      title: "Impact & Rankings",
      description: "The leaderboard recognizes high-impact technical contributors based on network activity.",
      icon: Trophy,
      steps: [
        { label: "Engagement", detail: "Helping others through comments and advice boosts your ranking." },
        { label: "Quality Posts", detail: "High-signal technical project launches earn significant points." },
        { label: "Network Growth", detail: "Active participation in project teams and collaborations." }
      ]
    }
  ]

  return (
    <div className="space-y-12 animate-in fade-in duration-700 max-w-[900px]">
      {/* Intro Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Zap className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-[20px] font-semibold tracking-tight">Member Guide</h2>
        </div>
        <p className="text-[15px] text-muted-foreground leading-relaxed max-w-[700px]">
          The Bhutanese Developer Network (BDN) is a place for professional technical collaboration. 
          Use this guide to get the most out of the platform.
        </p>
      </section>

      {/* Feature Guides */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
        {guides.map((guide, idx) => (
          <section key={idx} className="space-y-5 group">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 flex items-center justify-center bg-secondary/50 rounded-xl group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                <guide.icon className="h-5 w-5" />
              </div>
              <h3 className="text-[17px] font-bold tracking-tight">{guide.title}</h3>
            </div>
            
            <p className="text-[13px] text-muted-foreground/80 leading-relaxed font-medium">
              {guide.description}
            </p>

            <ul className="space-y-4 pt-1">
              {guide.steps.map((step, sIdx) => (
                <li key={sIdx} className="flex gap-4">
                  <span className="flex-none h-1.5 w-1.5 rounded-full bg-primary/30 mt-2" />
                  <div className="space-y-1">
                    <p className="text-[12px] font-bold uppercase tracking-widest text-foreground/80">{step.label}</p>
                    <p className="text-[13px] text-muted-foreground/60 leading-tight">{step.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      {/* Professional Guidelines */}
      <section className="mt-8 p-8 border border-border/10 bg-secondary/5 rounded-[24px] space-y-6">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <h3 className="text-[16px] font-bold tracking-tight uppercase">Community Guidelines</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="space-y-2">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-primary/60">Quality</p>
            <p className="text-[13px] text-muted-foreground/70 leading-snug">Focus on technical quality and clarity over generic updates.</p>
          </div>
          <div className="space-y-2">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-primary/60">Helpful</p>
            <p className="text-[13px] text-muted-foreground/70 leading-snug">Prioritize helping peers solve problems to strengthen the tech community.</p>
          </div>
          <div className="space-y-2">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-primary/60">Professional</p>
            <p className="text-[13px] text-muted-foreground/70 leading-snug">Maintain a standard of excellence in project documentation and communication.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="flex flex-col items-center justify-center py-12 space-y-4 text-center">
        <div className="h-12 w-0.5 bg-gradient-to-b from-primary/50 to-transparent" />
        <p className="text-[13px] font-medium text-muted-foreground">Ready to begin your journey?</p>
        <button 
          onClick={() => window.location.search = '?tab=all'}
          className="text-[12px] font-black uppercase tracking-[0.3em] text-primary hover:tracking-[0.4em] transition-all"
        >
          Go to Feed
        </button>
      </section>
    </div>
  )
}
