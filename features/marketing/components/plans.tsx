"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button-variants"
import Link from "next/link"
import { PaymentModal } from "./payment-modal"

export function Plans() {
  const [selectedPlan, setSelectedPlan] = React.useState<{ name: string; price: string } | null>(null)

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
      price: "Nu. 499",
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
    <section id="plans" className="bg-background py-20 md:py-32 px-4 border-t">
      <div className="container mx-auto max-w-6xl px-2 sm:px-4">
        <div className="flex flex-col items-center gap-4 md:gap-6 text-center mb-16 md:mb-20">
          <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-semibold tracking-tighter text-foreground text-balance">
            Simple, Scalable Plans
          </h2>
          <p className="max-w-[700px] text-base text-muted-foreground text-balance">
            Choose the right level of access to Bhutan&apos;s most active technical network.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {plans.map((plan, i) => {
            const isStudent = plan.name === "Student"
            
            return (
              <div 
                key={i} 
                className={cn(
                  "p-6 md:p-8 bg-background border rounded-sm flex flex-col transition-all",
                  plan.highlight && "border-primary md:border-2 md:scale-105 z-10 shadow-lg md:shadow-xl"
                )}
              >
                <div className="mb-6">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl md:text-4xl font-bold">{plan.price}</span>
                    {plan.price !== "Custom" && <span className="text-[11px] text-muted-foreground">/mo</span>}
                  </div>
                </div>
                <p className="text-[13px] text-muted-foreground mb-6 md:mb-8 leading-relaxed">
                  {plan.description}
                </p>
                <ul className="space-y-4 mb-8 md:mb-10 flex-1">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex gap-3 text-[13px] font-medium">
                      <Check className="h-5 w-5 text-primary flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                {isStudent ? (
                  <Link
                    href="/join"
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "w-full h-11 rounded-sm font-bold tracking-tight shadow-sm"
                    )}
                  >
                    Get Started
                  </Link>
                ) : (
                  <button
                    onClick={() => setSelectedPlan({ name: plan.name, price: plan.price })}
                    className={cn(
                      buttonVariants({ variant: plan.highlight ? "default" : "outline" }),
                      "w-full h-11 rounded-sm font-bold tracking-tight shadow-sm"
                    )}
                  >
                    Request To Pay
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <PaymentModal 
        isOpen={!!selectedPlan}
        onClose={() => setSelectedPlan(null)}
        planName={selectedPlan?.name || ""}
        price={selectedPlan?.price || ""}
      />
    </section>
  )
}
