import * as React from "react"

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
    <section id="how-it-works" className="min-h-[100dvh] flex items-center justify-center bg-background py-16 md:py-24 border-t">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center gap-4 md:gap-6 text-center mb-16 md:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-semibold tracking-tighter text-foreground text-balance">
            How It Works
          </h2>
          <p className="max-w-[700px] text-base md:text-lg text-muted-foreground font-medium text-balance">
            A streamlined process to connect with the nation&apos;s technical talent and start building.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 relative overflow-hidden">
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center group">
              <div className="h-12 w-12 md:h-16 md:w-16 rounded-full bg-secondary flex items-center justify-center text-xl md:text-2xl font-bold mb-6 md:mb-8 transition-transform group-hover:scale-110 shadow-sm border border-border/50">
                {i + 1}
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4">{step.title}</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed text-balance">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
