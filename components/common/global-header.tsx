"use client"

import * as React from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import { Menu, X, LayoutGrid, Search, Users, Trophy, MessageSquare, LogOut, Settings } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { usePathname } from "next/navigation";
import { Session } from "@supabase/supabase-js";

interface GlobalHeaderProps {
  children?: React.ReactNode;
}

export function GlobalHeader({ children }: GlobalHeaderProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [session, setSession] = React.useState<Session | null>(null);
  const supabase = createClient();
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith('/dashboard');

  React.useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then((response: any) => {
      setSession(response.data?.session ?? null);
    });
  }, [supabase]);

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Hide marketing links if on dashboard or if custom children are provided
  const showMarketingLinks = !isDashboard && !children;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-md pt-[env(safe-area-inset-top)]">
        <div className="w-full px-4 md:px-8 lg:px-12 relative flex h-16 items-center justify-between">
          <div className="flex items-center gap-6 lg:gap-12 shrink-0">
            <Link href="/" className="flex items-center gap-2.5 group shrink-0">
              <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[10px] border-b-primary group-hover:scale-110 transition-transform"></div>
              <span className="text-lg md:text-xl font-semibold tracking-tighter">BDN</span>
            </Link>
          </div>

          {showMarketingLinks && (
            <nav className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-8 text-[13px] font-medium text-muted-foreground/80">
              <Link href="/directory" className="hover:text-foreground transition-colors">Developers</Link>
              <Link href="/projects" className="hover:text-foreground transition-colors">Projects</Link>
              <Link href="/feed" className="hover:text-foreground transition-colors">Help</Link>
              <Link href="/events" className="hover:text-foreground transition-colors">Events</Link>
              <Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link>
            </nav>
          )}

          <div className="flex items-center gap-3 lg:gap-8 shrink-0">
          {children ? (
            children
          ) : (
            <>
              {showMarketingLinks && !session && (
                <div className="hidden sm:flex items-center gap-2">
                  <Link href="/join" className={cn(buttonVariants({ variant: "outline", size: "sm" }), "h-9 rounded-sm px-4 md:px-5 text-[13px] font-semibold shadow-sm transition hover:bg-secondary/50")}>
                    Sign in
                  </Link>
                  <Link href="/join" className={cn(buttonVariants({ size: "sm" }), "h-9 rounded-sm px-4 md:px-5 text-[13px] font-semibold bg-primary shadow-sm transition hover:opacity-90")}>
                    Join Network
                  </Link>
                </div>
              )}

              {session && (
                <Link href="/dashboard" className={cn(buttonVariants({ variant: "outline", size: "sm" }), "h-9 rounded-sm px-4 font-bold text-[12px] uppercase tracking-widest")}>
                  Dashboard
                </Link>
              )}
            </>
          )}

          <button
            className="lg:hidden p-2 text-foreground/70 hover:text-foreground transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={cn(
        "lg:hidden fixed left-0 right-0 top-[calc(4rem+env(safe-area-inset-top))] h-[calc(100dvh-4rem-env(safe-area-inset-top))] z-40 bg-background transition-transform duration-300 ease-in-out overflow-y-auto border-t",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <nav className="flex flex-col p-6 gap-6 min-h-full">
          {showMarketingLinks && (
            <>
              <Link href="/directory" className="text-lg font-semibold border-b pb-4" onClick={() => setIsOpen(false)}>Developers</Link>
              <Link href="/projects" className="text-lg font-semibold border-b pb-4" onClick={() => setIsOpen(false)}>Projects</Link>
              <Link href="/feed" className="text-lg font-semibold border-b pb-4" onClick={() => setIsOpen(false)}>Help</Link>
              <Link href="/events" className="text-lg font-semibold border-b pb-4" onClick={() => setIsOpen(false)}>Events</Link>
              <Link href="/contact" className="text-lg font-semibold border-b pb-4" onClick={() => setIsOpen(false)}>Contact</Link>
            </>
          )}

          {isDashboard && (
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-4">
                <p className="text-[12px] font-medium uppercase tracking-widest text-muted-foreground/40 px-1">Network</p>
                <div className="flex flex-col gap-2">
                  <Link href="/dashboard?tab=all" className="flex items-center gap-4 text-[15px] font-medium py-2" onClick={() => setIsOpen(false)}>
                    <LayoutGrid className="h-5 w-5 opacity-30" /> Feed
                  </Link>
                  <Link href="/dashboard?tab=discover" className="flex items-center gap-4 text-[15px] font-medium py-2" onClick={() => setIsOpen(false)}>
                    <Search className="h-5 w-5 opacity-30" /> Developers
                  </Link>
                  <Link href="/dashboard?tab=teams" className="flex items-center gap-4 text-[15px] font-medium py-2" onClick={() => setIsOpen(false)}>
                    <Users className="h-5 w-5 opacity-30" /> Teams
                  </Link>
                  <Link href="/dashboard?tab=leaderboard" className="flex items-center gap-4 text-[15px] font-medium py-2" onClick={() => setIsOpen(false)}>
                    <Trophy className="h-5 w-5 opacity-30" /> Leaderboard
                  </Link>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <p className="text-[12px] font-medium uppercase tracking-widest text-muted-foreground/40 px-1">Workspace</p>
                <div className="flex flex-col gap-2">
                  <Link href="/messages" className="flex items-center gap-4 text-[15px] font-medium py-2" onClick={() => setIsOpen(false)}>
                    <MessageSquare className="h-5 w-5 opacity-30" /> Messages
                  </Link>
                  <Link href="/identity" className="flex items-center gap-4 text-[15px] font-medium py-2" onClick={() => setIsOpen(false)}>
                    <Settings className="h-5 w-5 opacity-30" /> Settings
                  </Link>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3 mt-auto pt-8 pb-4">
            {session ? (
              <div className="flex flex-col gap-3">
                <Link href="/dashboard" className={cn(buttonVariants({ size: "lg" }), "w-full justify-center bg-primary rounded-sm")} onClick={() => setIsOpen(false)}>
                  Dashboard Home
                </Link>
                <button
                  onClick={async () => {
                    await supabase.auth.signOut();
                    setIsOpen(false);
                    window.location.href = "/";
                  }}
                  className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full justify-center rounded-sm")}
                >
                  Sign out
                </button>
              </div>
            ) : (
              <>
                <Link href="/join" className={cn(buttonVariants({ size: "lg" }), "w-full justify-center bg-primary rounded-sm")} onClick={() => setIsOpen(false)}>Join Network</Link>
                <Link href="/join" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full justify-center rounded-sm")} onClick={() => setIsOpen(false)}>Sign in</Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
