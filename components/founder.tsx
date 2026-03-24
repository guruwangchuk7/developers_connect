import * as React from "react"
import { Github, Twitter, Linkedin } from "@/components/icons"

export function Founder() {
  return (
    <section id="founder" className="bg-background py-32 px-4 relative">
      <div className="container mx-auto max-w-5xl">
        <div className="flex flex-col items-center gap-12 text-center mb-16">
          <div className="space-y-4">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-muted-foreground bg-background px-4 py-1.5 rounded-full border border-border shadow-sm">Creator-Led</span>
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-semibold tracking-tighter text-foreground">Meet the Founder</h2>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center bg-background rounded-sm border border-border p-12 md:p-20 relative overflow-hidden group">
          <div className="relative flex flex-col items-center">
            {/* Minimal profile placeholder */}
            <div className="relative h-64 w-64 md:h-80 md:w-80 overflow-hidden rounded-full border border-border transition-transform group-hover:scale-105 duration-700">
               {/* Note: In a real app, use <Image /> with src */}
               <div className="w-full h-full bg-secondary flex items-center justify-center bg-gradient-to-br from-secondary via-background to-secondary/50">
                  <span className="text-6xl font-black text-muted-foreground/20 italic">GW</span>
               </div>
               
               {/* Visual Effect: A soft glow */}
               <div className="absolute inset-0 bg-primary/5 mix-blend-overlay"></div>
            </div>
            
            <div className="mt-8 text-center">
              <h3 className="text-2xl font-bold tracking-tight mb-2">Guru Wangchuk</h3>
              <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs">Thimphu, BT</p>
            </div>
          </div>
          
          <div className="space-y-8 relative">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold tracking-tight text-primary">@guru_wangchuk</span>
              <div className="flex gap-4 items-center">
                <Twitter className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
                <Github className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
                <Linkedin className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
              </div>
            </div>
            
            <div className="space-y-6 text-base md:text-lg leading-relaxed text-muted-foreground font-medium">
              <p>
                Guru has spent years deeply immersed in the Bhutanese tech ecosystem, 
                witnessing first-hand the bridge needed between raw technical talent and professional opportunities.
              </p>
              <p>
                He built BDN to solve the fragmentation of the community across various platforms. 
                As a developer-led initiative, every strategic decision is guided by what actually 
                helps builders in the Himalayas create high-impact products.
              </p>
              <p className="italic border-l-4 border-primary/20 pl-6 text-foreground/80 py-2">
                &quot;We don&apos;t just connect; we elevate the standard of technical collaboration in Bhutan.&quot;
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
