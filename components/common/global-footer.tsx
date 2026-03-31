import Link from "next/link";
import { Twitter, Github, Linkedin } from "@/components/icons";

export function GlobalFooter() {
  return (
    <footer className="bg-background pt-24 md:pt-32 pb-12 md:pb-16 border-t">
      <div className="w-full px-4 md:px-8 lg:px-12">
        <div className="flex flex-col items-center text-center gap-12 lg:gap-16 pb-16 md:pb-20 border-b">
          <div className="space-y-6 max-w-sm flex flex-col items-center">
            <Link href="/" className="flex items-center gap-2 group cursor-pointer justify-center">
              <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[10px] border-b-primary group-hover:translate-x-1 transition-transform"></div>
              <span className="text-xl font-semibold tracking-tighter">BDN</span>
            </Link>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              Professionalizing the Bhutanese tech ecosystem through identity, collaboration,
              and community-driven engineering.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 gap-10 md:gap-20 w-full max-w-md">
            <div className="space-y-4 md:space-y-5">
              <h4 className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.15em] text-foreground">Product</h4>
              <nav className="flex flex-col gap-2 md:gap-3 text-[12px] md:text-[13px] font-medium text-muted-foreground">
                <Link href="/#plans" className="hover:text-foreground transition-colors">Pricing</Link>
                <Link href="/join" className="hover:text-foreground transition-colors">Login</Link>
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
