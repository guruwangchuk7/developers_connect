import * as React from "react"
import Image from "next/image"
import { Github, Twitter, Linkedin } from "@/components/icons"
import guruPhoto from "../../../assets/guru.jpg"

export function Founder() {
  return (
    <section id="founder" className="bg-background py-20 md:py-32 px-4 relative">
      <div className="container mx-auto max-w-5xl px-0 sm:px-4">
        <div className="flex flex-col items-center gap-8 md:gap-12 text-center mb-12 md:mb-16">
          <div className="space-y-4">
            <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.25em] text-muted-foreground bg-background px-3 py-1 md:px-4 md:py-1.5 rounded-full border border-border shadow-sm">Creator-Led</span>
            <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-semibold tracking-tighter text-foreground text-balance">Meet the Founder</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center p-0 md:p-12 lg:p-16 relative group">
          <div className="relative flex flex-col items-center">
            {/* Founder Profile Photo */}
            <div className="relative h-48 w-48 sm:h-64 sm:w-64 md:h-80 md:w-80 overflow-hidden rounded-full border border-border transition-transform group-hover:scale-105 duration-700 shadow-inner">
              <Image 
                src={guruPhoto} 
                alt="Guru Wangchuk" 
                fill 
                className="object-cover object-top"
                unoptimized={true}
                placeholder="blur"
              />

              {/* Visual Effect: A soft glow */}
              <div className="absolute inset-0 bg-primary/5 mix-blend-overlay pointer-events-none"></div>
            </div>

            <div className="mt-6 md:mt-8 text-center">
              <h3 className="text-lg md:text-2xl font-bold tracking-tight mb-1 md:mb-2">Guru Wangchuk</h3>
              <p className="text-muted-foreground font-medium uppercase tracking-widest text-[9px] md:text-xs">Thimphu, BT</p>
            </div>
          </div>

          <div className="space-y-6 md:space-y-8 relative">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b pb-4 sm:border-none sm:pb-0">
              <span className="text-sm md:text-lg font-bold tracking-tight text-primary">@guru_wangchuk</span>
              <div className="flex gap-4 items-center">
                <Twitter className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
                <Github className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
                <Linkedin className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
              </div>
            </div>

            <div className="space-y-4 md:space-y-6 text-base leading-relaxed text-muted-foreground text-center md:text-left">
              <p>
                Guru has spent years deeply immersed in the Bhutanese tech ecosystem,
                witnessing first-hand the bridge needed between raw technical talent and professional opportunities.
              </p>
              <p>
                He built BDN to solve the fragmentation of the community across various platforms.
                As a developer-led initiative, every strategic decision is guided by what actually
                helps builders in the Himalayas create high-impact products.
              </p>
              <p className="italic border-l-4 border-primary/20 pl-4 md:pl-6 text-foreground/80 py-2 text-left">
                &quot;We don&apos;t just connect; we elevate the standard of technical collaboration in Bhutan.&quot;
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
