import { GlobalHeader } from "@/components/global-header";
import { HeroSection } from "@/components/hero-section";
import Link from "next/link";
import { Database, Code, Monitor, Share2 } from "lucide-react";
import { Twitter, Github, Linkedin } from "@/components/icons";
import { HowItWorks } from "@/components/how-it-works";
import { Plans } from "@/components/plans";
import { WhyUseIt } from "@/components/why-use-it";
import { Founder } from "@/components/founder";
import { FAQ } from "@/components/faq";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-primary/5">
      <GlobalHeader />
      <main className="flex-1">
        <HeroSection />

        {/* Core Capabilities Section */}
        <section id="capabilities" className="min-h-[100dvh] flex items-center justify-center bg-background py-20 lg:py-32">
          <div className="container mx-auto">
            <div className="flex flex-col items-center gap-6 text-center mb-24 lg:mb-32">
              <h2 className="text-4xl md:text-5xl lg:text-7xl font-semibold tracking-tighter text-foreground text-balance">
                Where Identity Meets Collaboration
              </h2>
              <p className="max-w-[700px] text-base md:text-lg text-muted-foreground/80 leading-relaxed font-medium">
                We provide the Bhutanese tech ecosystem with a centralized layer for professional identity, 
                technical help, and team formation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-px md:bg-border border border-border overflow-hidden rounded-sm">
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
    <div className="bg-background p-10 md:p-12 transition-colors hover:bg-secondary/20 group cursor-pointer border md:border-none rounded-sm">
      <div className="h-9 w-9 mb-8 p-2 rounded-sm bg-secondary/80 text-primary group-hover:scale-110 transition-transform shadow-[0_2px_4px_rgba(0,0,0,0.05)] border border-border/20">
        {icon}
      </div>
      <h3 className="text-lg font-semibold tracking-tight mb-4 text-foreground">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
}

function Footer() {
  return (
    <footer className="bg-background pt-32 pb-16 border-t">
      <div className="w-full px-8 lg:px-12">
        <div className="flex flex-col md:flex-row items-start justify-between gap-16 pb-20 border-b">
          <div className="space-y-6 max-w-sm">
            <Link href="/" className="flex items-center gap-2 group cursor-pointer mb-6">
              <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[10px] border-b-primary group-hover:translate-x-1 transition-transform"></div>
              <span className="text-xl font-semibold tracking-tighter">BDN</span>
            </Link>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              Profesionalizing the Bhutanese tech ecosystem through identity, collaboration, 
              and community-driven engineering.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-20">
            <div className="space-y-5">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-foreground">Product</h4>
              <nav className="flex flex-col gap-3 text-[13px] font-medium text-muted-foreground">
                <Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
                <Link href="/login" className="hover:text-foreground transition-colors">Login</Link>
                <Link href="/directory" className="hover:text-foreground transition-colors">Developers</Link>
              </nav>
            </div>
            <div className="space-y-5">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-foreground">Company</h4>
              <nav className="flex flex-col gap-3 text-[13px] font-medium text-muted-foreground">
                <Link href="/about" className="hover:text-foreground transition-colors">About</Link>
                <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
                <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
              </nav>
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center md:flex-row justify-between gap-8 text-[12px] font-medium text-muted-foreground/50">
          <span>© 2026 Bhutan Developer Network. Built on the national grid.</span>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-foreground transition-colors flex items-center gap-1.5"><Twitter className="h-3 w-3" /> Twitter</Link>
            <Link href="#" className="hover:text-foreground transition-colors flex items-center gap-1.5"><Github className="h-3 w-3" /> GitHub</Link>
            <Link href="#" className="hover:text-foreground transition-colors flex items-center gap-1.5"><Linkedin className="h-3 w-3" /> LinkedIn</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
