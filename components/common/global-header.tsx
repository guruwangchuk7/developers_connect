"use client"

import * as React from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import { Menu, X, LayoutGrid, Search, Users, Trophy, MessageSquare, LogOut } from "lucide-react";
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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-md">
      <div className="w-full px-4 md:px-8 lg:px-12 flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 lg:gap-12">
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[10px] border-b-primary group-hover:scale-110 transition-transform"></div>
            <span className="text-lg md:text-xl font-semibold tracking-tighter">BDN</span>
          </Link>

          {showMarketingLinks && (
            <nav className="hidden lg:flex items-center gap-8 text-[12px] font-semibold text-muted-foreground uppercase tracking-widest">
              <Link href="/directory" className="hover:text-foreground transition-colors">Developers</Link>
              <Link href="/projects" className="hover:text-foreground transition-colors">Projects</Link>
              <Link href="/feed" className="hover:text-foreground transition-colors">Help</Link>
              <Link href="/events" className="hover:text-foreground transition-colors">Events</Link>
            </nav>
          )}
        </div>

        <div className="flex items-center gap-3 lg:gap-8">
          {children ? (
            children
          ) : (
            <>
              {showMarketingLinks && !session && (
                <div className="hidden sm:flex items-center gap-2">
                  <Link href="/join" className={cn(buttonVariants({ variant: "outline", size: "sm" }), "h-9 rounded-sm px-4 md:px-5 text-[11px] md:text-[12px] font-bold tracking-tight shadow-sm transition hover:bg-secondary/50")}>
                    Sign in
                  </Link>
                  <Link href="/join" className={cn(buttonVariants({ size: "sm" }), "h-9 rounded-sm px-4 md:px-5 text-[11px] md:text-[12px] font-bold tracking-tight bg-primary shadow-sm transition hover:opacity-90")}>
                    Join Network
                  </Link>
                </div>
              )}

              {session && (
                <Link href="/dashboard" className={cn(buttonVariants({ variant: "outline", size: "sm" }), "h-9 rounded-sm px-4 font-bold text-[11px] uppercase tracking-widest")}>
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
        "lg:hidden fixed left-0 right-0 top-16 h-[calc(100dvh-4rem)] z-40 bg-background transition-transform duration-300 ease-in-out overflow-y-auto border-t",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <nav className="flex flex-col p-6 gap-6 min-h-full">
          {showMarketingLinks && (
            <>
              <Link href="/directory" className="text-lg font-semibold border-b pb-4" onClick={() => setIsOpen(false)}>Developers</Link>
              <Link href="/projects" className="text-lg font-semibold border-b pb-4" onClick={() => setIsOpen(false)}>Projects</Link>
              <Link href="/feed" className="text-lg font-semibold border-b pb-4" onClick={() => setIsOpen(false)}>Help</Link>
              <Link href="/events" className="text-lg font-semibold border-b pb-4" onClick={() => setIsOpen(false)}>Events</Link>
            </>
          )}

          {isDashboard && (
            <>
              <Link href="/dashboard?tab=all" className="text-lg font-semibold border-b pb-4" onClick={() => setIsOpen(false)}>
                Feed
              </Link>
              <Link href="/dashboard?tab=discover" className="text-lg font-semibold border-b pb-4" onClick={() => setIsOpen(false)}>
                Discover Developers
              </Link>
              <Link href="/dashboard?tab=teams" className="text-lg font-semibold border-b pb-4" onClick={() => setIsOpen(false)}>
                Teams
              </Link>
              <Link href="/dashboard?tab=leaderboard" className="text-lg font-semibold border-b pb-4" onClick={() => setIsOpen(false)}>
                Leaderboard
              </Link>
              <Link href="/dashboard?tab=messages" className="text-lg font-semibold border-b pb-4" onClick={() => setIsOpen(false)}>
                Messages
              </Link>
            </>
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
