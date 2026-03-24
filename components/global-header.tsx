import Link from "next/link";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

export function GlobalHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-md">
      <div className="w-full px-8 lg:px-12 flex h-16 items-center justify-between">
        <div className="flex items-center gap-12">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[10px] border-b-primary group-hover:scale-110 transition-transform"></div>
            <span className="text-xl font-semibold tracking-tighter">BDN</span>
          </Link>
          <nav className="hidden lg:flex items-center gap-8 text-[12px] font-semibold text-muted-foreground uppercase tracking-widest">
            <Link href="/directory" className="hover:text-foreground transition-colors">
              Developers
            </Link>
            <Link href="/projects" className="hover:text-foreground transition-colors">
              Projects
            </Link>
            <Link href="/feed" className="hover:text-foreground transition-colors">
              Help
            </Link>
            <Link href="/events" className="hover:text-foreground transition-colors">
              Events
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-8">
          <Link href="/pricing" className="text-[12px] font-semibold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest">
            Pricing
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/join" className={cn(buttonVariants({ variant: "outline", size: "sm" }), "h-9 rounded-sm px-5 text-[12px] font-bold tracking-tight shadow-sm transition hover:bg-secondary/50")}>
              Sign in
            </Link>
            <Link href="/join" className={cn(buttonVariants({ size: "sm" }), "h-9 rounded-sm px-5 text-[12px] font-bold tracking-tight bg-primary shadow-sm transition hover:opacity-90")}>
              Join Network
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
