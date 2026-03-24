import * as React from "react"
import { Sparkles, Zap, TrendingUp, Users } from "lucide-react"

export function WhyUseIt() {
  const benefits = [
    {
      icon: <Users className="h-5 w-5 md:h-6 md:w-6" />,
      title: "Centralized Network",
      description: "No more fragmentation across individual groups. Connect with the entire tech community in one place."
    },
    {
      icon: <Sparkles className="h-5 w-5 md:h-6 md:w-6" />,
      title: "Professional Identity",
      description: "Build a reputation that translates across the nation's teams with a unified profile system."
    },
    {
      icon: <Zap className="h-5 w-5 md:h-6 md:w-6" />,
      title: "Technical Help",
      description: "Fast, clear answers to technical blockers from vetted local experts who understand the context."
    },
    {
      icon: <Users className="h-5 w-5 md:h-6 md:w-6" />,
      title: "Team Formation",
      description: "Find your next collaborator based on skills and availability to scale your project effectively."
    }
  ]

  return (
    <section id="why-use-it" className="min-h-[100dvh] flex items-center justify-center bg-background py-16 md:py-24 border-t">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center gap-4 md:gap-6 text-center mb-16 md:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-semibold tracking-tighter text-foreground text-balance">
            A Working Network
          </h2>
          <p className="max-w-[700px] text-base md:text-lg text-muted-foreground font-medium text-balance">
            Bridging the gap between students, freelancers, and professionals to accelerate the growth of our tech ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border border border-border overflow-hidden rounded-sm">
          {benefits.map((benefit, i) => (
            <div key={i} className="p-8 md:p-12 bg-background space-y-4 hover:bg-secondary/10 transition-colors group">
              <div className="h-10 w-10 md:h-12 md:w-12 rounded-sm bg-secondary flex items-center justify-center text-primary mb-4 md:mb-6 group-hover:scale-110 transition-transform">
                {benefit.icon}
              </div>
              <h3 className="text-xl md:text-2xl font-bold tracking-tight">{benefit.title}</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
