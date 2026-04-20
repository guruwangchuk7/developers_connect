import * as React from "react"
import Image from "next/image"
import { Github, Twitter, Linkedin } from "@/components/icons"
import guruPhoto from "../../../assets/guru.jpg"
import tsheringPhoto from "../../../assets/tshering.jpg"

export function Founder() {
  return (
    <section id="founder" className="bg-background py-20 md:py-32 px-4 relative">
      <div className="w-full px-[1cm] mx-auto">
        <div className="flex flex-col items-center gap-5 md:gap-6 text-center mb-12 md:mb-20">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-5xl font-semibold tracking-tighter text-foreground text-balance">Meet the Founders</h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl leading-relaxed">
            The team behind Bhutan Developer Network — building the infrastructure for technical collaboration in the Himalayas.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12 max-w-6xl mx-auto">

          {/* Founder 1: Guru Wangchuk */}
          <div className="group relative p-8 md:p-12 border border-border/40 rounded-sm hover:border-primary/20 transition-all bg-background">
            <div className="flex flex-col items-center text-center">
              {/* Photo */}
              <div className="relative h-40 w-40 sm:h-48 sm:w-48 overflow-hidden rounded-full border border-border transition-transform group-hover:scale-105 duration-700 shadow-inner mb-6">
                <Image 
                  src={guruPhoto} 
                  alt="Guru Wangchuk" 
                  fill 
                  className="object-cover object-top"
                  unoptimized={true}
                  placeholder="blur"
                />
                <div className="absolute inset-0 bg-primary/5 mix-blend-overlay pointer-events-none"></div>
              </div>

              {/* Name & Location */}
              <h3 className="text-xl md:text-2xl font-bold tracking-tight mb-1">Guru Wangchuk</h3>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60 mb-1">Founder & Lead Developer</p>
              <p className="text-muted-foreground font-medium uppercase tracking-widest text-[9px] md:text-[10px] mb-6">Thimphu, Bhutan</p>

              {/* Social Links */}
              <div className="flex gap-4 items-center mb-6">
                <a href="https://x.com/guru_wangchuk" target="_blank" rel="noopener noreferrer">
                  <Twitter className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
                </a>
                <a href="https://github.com/guruwangchuk7" target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
                </a>
                <a href="https://lnkd.in/dw3Xf4Q6" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
                </a>
              </div>

              {/* Bio */}
              <div className="space-y-4 text-sm leading-relaxed text-muted-foreground text-center">
                <p>
                  Guru has spent years deeply immersed in the Bhutanese tech ecosystem,
                  witnessing first-hand the bridge needed between raw technical talent and professional opportunities.
                </p>
                <p>
                  He built BDN to solve the fragmentation of the community across various platforms.
                  As a developer-led initiative, every strategic decision is guided by what actually
                  helps builders in the Himalayas create high-impact products.
                </p>
              </div>

              {/* Quote */}
              <p className="italic border-l-4 border-primary/20 pl-4 text-foreground/80 py-2 text-left text-sm mt-6 w-full">
                &quot;We don&apos;t just connect; we elevate the standard of technical collaboration in Bhutan.&quot;
              </p>
            </div>
          </div>

          {/* Founder 2: Tshering Thinley Yangden */}
          <div className="group relative p-8 md:p-12 border border-border/40 rounded-sm hover:border-primary/20 transition-all bg-background">
            <div className="flex flex-col items-center text-center">
              {/* Photo */}
              <div className="relative h-40 w-40 sm:h-48 sm:w-48 overflow-hidden rounded-full border border-border transition-transform group-hover:scale-105 duration-700 shadow-inner mb-6">
                <Image 
                  src={tsheringPhoto} 
                  alt="Tshering Thinley Yangden" 
                  fill 
                  className="object-cover object-top"
                  unoptimized={true}
                />
                <div className="absolute inset-0 bg-primary/5 mix-blend-overlay pointer-events-none"></div>
              </div>

              {/* Name & Location */}
              <h3 className="text-xl md:text-2xl font-bold tracking-tight mb-1">Tshering Thinley Yangden</h3>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60 mb-1">Co-Founder & Frontend Developer</p>
              <p className="text-muted-foreground font-medium uppercase tracking-widest text-[9px] md:text-[10px] mb-6">Chukha, Bhutan</p>

              {/* Social Links */}
              <div className="flex gap-4 items-center mb-6">
                <a href="https://github.com/tshering877" target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
                </a>
                <a href="https://linkedin.com/in/ttyangden" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
                </a>
              </div>

              {/* Bio */}
              <div className="space-y-4 text-sm leading-relaxed text-muted-foreground text-center">
                <p>
                  Tshering is a driven ICT student at Rangsit University with a 3.93 GPA, bringing strong foundations in web development, 
                  UI/UX design, and data analysis. A former School Captain and hackathon winner, she combines leadership with technical skill.
                </p>
                <p>
                  As a frontend developer at KodaDev, she builds performant, user-focused web applications.
                  Her passion for turning data into decisions was demonstrated at the Hospitality ERP Hackathon 2025, 
                  where she earned 3rd place for her BI dashboard work.
                </p>
              </div>


            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

