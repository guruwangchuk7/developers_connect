import { GlobalHeader } from "@/components/common/global-header";
import { HeroSection } from "@/features/marketing/components/hero-section";
import Link from "next/link";
import { Database, Code, Monitor, Share2 } from "lucide-react";
import { Twitter, Github, Linkedin } from "@/components/icons";
import { HowItWorks } from "@/features/marketing/components/how-it-works";
import { Plans } from "@/features/marketing/components/plans";
import { WhyUseIt } from "@/features/marketing/components/why-use-it";
import { Founder } from "@/features/marketing/components/founder";
import { FAQ } from "@/features/marketing/components/faq";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-primary/5">
      <GlobalHeader />
      <main className="flex-1">
        <HeroSection />

        {/* Core Capabilities Section */}
        <section id="capabilities" className="min-h-[100dvh] flex items-center justify-center bg-background py-16 md:py-20 lg:py-32 border-t">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center gap-4 md:gap-6 text-center mb-16 md:mb-24 lg:mb-32">
              <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-semibold tracking-tighter text-foreground text-balance">
                Where Identity Meets Collaboration
              </h2>
              <p className="max-w-[700px] text-sm md:text-base lg:text-lg text-muted-foreground/80 leading-relaxed font-medium text-balance">
                We provide the Bhutanese tech ecosystem with a centralized layer for professional identity, 
                technical help, and team formation.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-px md:bg-border border border-border overflow-hidden rounded-sm">
              <FeatureCard
                icon={<Monitor className="h-full w-full" />}
                title="Developer Identity"
                description="Build a Bhutan-specific professional identity that showcases your technical reputation."
              />
              <FeatureCard
                icon={<Code className="h-full w-full" />}
                title="Technical Help"
                description="Get clear answers to blocking problems from a community of vetted local experts."
              />
              <FeatureCard
                icon={<Database className="h-full w-full" />}
                title="Team Formation"
                description="Find collaborators for your next project based on verified skills and availability."
              />
              <FeatureCard
                icon={<Share2 className="h-full w-full" />}
                title="Project Collaboration"
                description="Collaborate on projects and open-source initiatives to grow the national ecosystem."
              />
            </div>
          </div>
        </section>

        <HowItWorks />
        <WhyUseIt />
        <Founder />
        <Plans />
        <FAQ />
      </main>

      <Footer />
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-background p-8 md:p-10 lg:p-12 transition-all hover:bg-secondary/20 group cursor-pointer border sm:border-none rounded-sm">
      <div className="h-8 w-8 md:h-9 md:w-9 mb-6 md:mb-8 p-1.5 md:p-2 rounded-sm bg-secondary/80 text-primary group-hover:scale-110 transition-transform shadow-[0_2px_4px_rgba(0,0,0,0.05)] border border-border/20">
        {icon}
      </div>
      <h3 className="text-base md:text-lg font-semibold tracking-tight mb-2 md:mb-4 text-foreground">
        {title}
      </h3>
      <p className="text-[13px] md:text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
}

function Footer() {
  return (
    <footer className="bg-background pt-24 md:pt-32 pb-12 md:pb-16 border-t">
      <div className="w-full px-4 md:px-8 lg:px-12">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-12 lg:gap-16 pb-16 md:pb-20 border-b">
          <div className="space-y-6 max-w-sm">
            <Link href="/" className="flex items-center gap-2 group cursor-pointer">
              <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[10px] border-b-primary group-hover:translate-x-1 transition-transform"></div>
              <span className="text-xl font-semibold tracking-tighter">BDN</span>
            </Link>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              Professionalizing the Bhutanese tech ecosystem through identity, collaboration, 
              and community-driven engineering.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 md:gap-20 w-full lg:w-auto">
            <div className="space-y-4 md:space-y-5">
              <h4 className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.15em] text-foreground">Product</h4>
              <nav className="flex flex-col gap-2 md:gap-3 text-[12px] md:text-[13px] font-medium text-muted-foreground">
                <Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
                <Link href="/login" className="hover:text-foreground transition-colors">Login</Link>
                <Link href="/directory" className="hover:text-foreground transition-colors">Developers</Link>
              </nav>
            </div>
            <div className="space-y-4 md:space-y-5">
              <h4 className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.15em] text-foreground">Company</h4>
              <nav className="flex flex-col gap-2 md:gap-3 text-[12px] md:text-[13px] font-medium text-muted-foreground">
                <Link href="/about" className="hover:text-foreground transition-colors">About</Link>
                <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
                <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
              </nav>
            </div>
          </div>
        </div>
        <div className="mt-10 md:mt-12 flex flex-col items-center lg:flex-row justify-between gap-6 md:gap-8 text-[11px] md:text-[12px] font-medium text-muted-foreground/60 text-center lg:text-left">
          <span>© 2026 Bhutan Developer Network. Built on the national grid.</span>
          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
            <Link href="#" className="hover:text-foreground transition-colors flex items-center gap-1.5"><Twitter className="h-3 w-3" /> Twitter</Link>
            <Link href="#" className="hover:text-foreground transition-colors flex items-center gap-1.5"><Github className="h-3 w-3" /> GitHub</Link>
            <Link href="#" className="hover:text-foreground transition-colors flex items-center gap-1.5"><Linkedin className="h-3 w-3" /> LinkedIn</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
