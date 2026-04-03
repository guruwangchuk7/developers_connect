"use client"

import * as React from "react"
import { Trophy, Medal, Crown, Star, ArrowUpRight, MessageSquare, Heart, Users } from "lucide-react"
import { cn } from "@/lib/utils"

interface LeaderboardProps {
  allProfiles: any[]
}

export function Leaderboard({ allProfiles }: LeaderboardProps) {
  // Generate some semi-random ranking data for demo purposes if real data isn't aggregated
  const leaderboardData = React.useMemo(() => {
    return allProfiles.slice(0, 10).map((p, index) => ({
      ...p,
      rank: index + 1,
      connections: Math.floor(Math.random() * 50) + 20,
      impact: Math.floor(Math.random() * 1000) + 500,
      contributions: Math.floor(Math.random() * 30) + 5,
      trending: Math.random() > 0.7
    })).sort((a, b) => b.impact - a.impact)
  }, [allProfiles])

  const topThree = leaderboardData.slice(0, 3)
  const rest = leaderboardData.slice(3)

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 font-sans">
      {/* Top 3 Spotlight */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
        {/* Silver - Rank 2 */}
        <div className="order-2 md:order-1 h-full flex items-end">
          {topThree[1] && <SpotlightCard dev={topThree[1]} rank={2} color="text-slate-400" />}
        </div>
        
        {/* Gold - Rank 1 */}
        <div className="order-1 md:order-2 h-full">
          {topThree[0] && <SpotlightCard dev={topThree[0]} rank={1} color="text-amber-500" isLarge />}
        </div>
        
        {/* Bronze - Rank 3 */}
        <div className="order-3 md:order-3 h-full flex items-end">
          {topThree[2] && <SpotlightCard dev={topThree[2]} rank={3} color="text-orange-600" />}
        </div>
      </div>

      {/* Main Ranking Table */}
      <div className="bg-background border border-border/40 rounded-sm overflow-hidden shadow-sm">
        <div className="grid grid-cols-12 px-8 py-5 bg-secondary/10 border-b border-border/10 text-[10px] font-medium uppercase tracking-widest text-muted-foreground/40">
          <div className="col-span-1">Rank</div>
          <div className="col-span-5 md:col-span-6">Contributor</div>
          <div className="col-span-3 lg:col-span-2 text-center">Score</div>
          <div className="col-span-3 lg:col-span-3 text-right">Metrics</div>
        </div>
        
        <div className="divide-y divide-border/5">
          {rest.map((dev) => (
            <div key={dev.id} className="grid grid-cols-12 px-8 py-6 items-center hover:bg-secondary/10 transition-colors group">
              <div className="col-span-1 text-[13px] font-medium text-muted-foreground/20 group-hover:text-primary transition-colors">
                {dev.rank}
              </div>
              <div className="col-span-5 md:col-span-6 flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-[11px] font-bold overflow-hidden shrink-0">
                  {dev.full_name?.[0]}
                </div>
                <div className="space-y-0.5 truncate">
                  <div className="text-[14px] font-medium text-foreground truncate uppercase tracking-tight">{dev.full_name}</div>
                  <p className="text-[11px] text-muted-foreground/40 truncate uppercase tracking-wider font-medium">{dev.role}</p>
                </div>
              </div>
              <div className="col-span-3 lg:col-span-2 text-center">
                <span className="text-[14px] font-medium tracking-tight text-foreground/80">{dev.impact}</span>
              </div>
              <div className="col-span-3 lg:col-span-3 flex items-center justify-end gap-6 text-muted-foreground/20 font-medium text-[11px]">
                  <div className="flex items-center gap-1.5 cursor-default">
                    <Users className="h-3.5 w-3.5" />
                    {dev.connections}
                  </div>
                  <div className="hidden sm:flex items-center gap-1.5 cursor-default">
                    <Star className="h-3.5 w-3.5" />
                    {dev.contributions}
                  </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function SpotlightCard({ dev, rank, color, isLarge = false }: { dev: any, rank: number, color: string, isLarge?: boolean }) {
  const Icon = rank === 1 ? Crown : rank === 2 ? Medal : Trophy

  return (
    <div className={cn(
      "w-full bg-background border border-border/20 rounded-sm p-8 text-center relative group transition-all",
      isLarge ? "pb-12 pt-14 shadow-lg" : "py-8"
    )}>
      <div className="absolute top-4 left-4">
        <Icon className={cn("h-4 w-4 opacity-20", color)} />
      </div>

      <div className="space-y-4">
        <div className={cn(
          "mx-auto rounded-full bg-secondary/50 flex items-center justify-center font-bold uppercase text-secondary-foreground transition-transform group-hover:scale-105",
          isLarge ? "h-20 w-20 text-xl" : "h-14 w-14 text-sm"
        )}>
           {dev.full_name?.[0]}
        </div>
        
        <div className="space-y-0.5">
          <div className={cn("font-medium tracking-tight text-foreground uppercase border-b border-transparent group-hover:border-primary/10 transition-all inline-block px-1", isLarge ? "text-[15px]" : "text-[13px]")}>{dev.full_name}</div>
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground/40">{dev.role}</p>
        </div>

        <div className="pt-6 flex flex-col items-center gap-2">
           <p className={cn("font-medium tracking-tight", isLarge ? "text-3xl" : "text-xl")}>{dev.impact}</p>
           
           <div className="flex items-center gap-3 text-[10px] font-medium text-muted-foreground/20">
              <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {dev.connections}</span>
              <span className="flex items-center gap-1"><Star className="h-3 w-3" /> {dev.contributions}</span>
           </div>
        </div>
      </div>
    </div>
  )
}
