"use client"

import * as React from "react"
import { Plus, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

export function FAQ() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null)

  const faqs = [
    {
      question: "What is BDN?",
      answer: "Bhutan Developer Network (BDN) is a centralized digital platform designed to connect developers, engineers, and technical builders in Bhutan. It provides a dedicated layer for professional identity and collaboration."
    },
    {
      question: "How does it help Bhutanese developers?",
      answer: "BDN solves the fragmentation of our community by providing a central hub for technical help, team formation, and reputational identity, bringing together students and professionals."
    },
    {
      question: "Is it free for students?",
      answer: "Yes, our Student plan is completely free and provides full access to community help, project showcases, and team formation features to help you jumpstart your career."
    },
    {
      question: "How do I form a team?",
      answer: "You can post a project or collaboration request on our focused feed. Other members can then view your requirements and apply to join based on their verified skills."
    },
    {
      question: "Can I use it to hire developers?",
      answer: "Yes, our Corporate plan is specifically designed for companies and agencies looking to source and vet high-quality technical talent within the Bhutanese ecosystem."
    },
    {
      question: "What kind of projects can I share?",
      answer: "We encourage everything from open-source initiatives to startup MVPs. Our goal is to promote visibility for all types of technical work being done in the country."
    }
  ]

  return (
    <section id="faq" className="bg-background py-16 px-4">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="flex flex-col items-center gap-4 text-center mb-12 lg:mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tighter text-foreground">
            Frequently Asked Questions
          </h2>
          <p className="max-w-[700px] text-sm md:text-base text-muted-foreground/80 leading-relaxed font-medium">
            Everything you need to know about the BDN ecosystem.
          </p>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div 
              key={i} 
              className={cn(
                "group border border-border/40 rounded-sm overflow-hidden transition-all duration-300",
                openIndex === i ? "bg-secondary/5 border-primary/10" : "bg-transparent"
              )}
            >
              <button 
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full h-14 px-6 flex items-center justify-between text-left hover:bg-secondary/10 transition-colors"
              >
                <span className="text-base font-bold tracking-tight">{faq.question}</span>
                <div className="h-8 w-8 flex items-center justify-center text-muted-foreground rounded-full border border-border/40 transition-transform group-hover:bg-background">
                  {openIndex === i ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </div>
              </button>
              
              <div 
                className={cn(
                  "overflow-hidden transition-all duration-300",
                  openIndex === i ? "max-h-[300px] opacity-100 py-8 px-8 border-t border-border/20" : "max-h-0 opacity-0"
                )}
              >
                <p className="text-muted-foreground leading-relaxed text-base">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
