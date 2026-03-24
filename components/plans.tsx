import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button-variants"
import Link from "next/link"

export function Plans() {
  const plans = [
    {
      name: "Student",
      price: "Free",
      description: "Perfect for learning and building your first projects.",
      features: ["Professional profile", "Community help access", "Project showcase", "Team formation"],
      highlight: false
    },
    {
      name: "Professional",
      price: "$19",
      description: "For professionals looking to build an elite presence.",
      features: ["Vetted network status", "Priority help requests", "Project management tools", "Portfolio verification"],
      highlight: true
    },
    {
      name: "Corporate",
      price: "Custom",
      description: "Tailored solutions for companies building in Bhutan.",
      features: ["Talent sourcing tool", "Sponsorship badge", "Internal team dashboard", "24/7 Premium support"],
      highlight: false
    }
  ]

  return (
    <section id="plans" className="bg-background py-32 px-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-6 text-center mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-semibold tracking-tighter text-foreground">
            Simple, Scalable Plans
          </h2>
          <p className="max-w-[700px] text-lg text-muted-foreground font-medium">
            Choose the right level of access to Bhutan&apos;s most active technical network.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <div 
              key={i} 
              className={cn(
                "p-8 bg-background border rounded-sm flex flex-col transition-all",
                plan.highlight && "border-primary border-2 scale-105 z-10"
              )}
            >
              <div className="mb-6">
                <h3 className="text-xl font-bold uppercase tracking-widest text-muted-foreground mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.price !== "Custom" && <span className="text-muted-foreground">/mo</span>}
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-8">
                {plan.description}
              </p>
              <ul className="space-y-4 mb-10 flex-1">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex gap-3 text-sm font-medium">
                    <Check className="h-5 w-5 text-primary flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href="/join"
                className={cn(
                  buttonVariants({ variant: plan.highlight ? "default" : "outline" }),
                  "w-full h-11 rounded-sm font-bold tracking-tight"
                )}
              >
                Get Started
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
