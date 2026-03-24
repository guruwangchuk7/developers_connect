import * as React from "react"
import { CheckCircle2, ArrowRight } from "lucide-react"

export function HowItWorks() {
  const steps = [
    {
      title: "Build Your Identity",
      description: "Create a professional profile that highlights your skills, projects, and technical reputation."
    },
    {
      title: "Join the Conversation",
      description: "Ask technical questions, share knowledge, and engage with the Bhutanese developer community."
    },
    {
      title: "Collaborate & Build",
      description: "Find your next team, form groups, and launch projects that drive the national ecosystem forward."
    }
  ]

  return (
    <section id="how-it-works" className="min-h-[100dvh] flex items-center justify-center bg-background py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-6 text-center mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-semibold tracking-tighter text-foreground">
            How It Works
          </h2>
          <p className="max-w-[700px] text-lg text-muted-foreground font-medium">
            A streamlined process to connect with the nation&apos;s technical talent and start building.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center group">
              <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center text-2xl font-bold mb-8 transition-transform group-hover:scale-110">
                {i + 1}
              </div>
              <h3 className="text-xl font-bold mb-4">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
