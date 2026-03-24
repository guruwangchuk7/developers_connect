import { buttonVariants } from "@/components/ui/button-variants";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function HeroSection() {
  return (
    <section className="relative flex min-h-[calc(100dvh-var(--header-height))] flex-col items-center justify-center border-b bg-grid overflow-y-auto">
      <div className="container mx-auto relative py-20 lg:py-32">
        <div className="flex flex-col items-center gap-10 md:gap-14">
          <div className="flex flex-col items-center gap-6">
            <h1 className="max-w-[1000px] text-center text-5xl font-semibold leading-[1.1] tracking-tighter md:text-7xl lg:text-8xl">
              Bhutan Developer Network
            </h1>
            
            <p className="max-w-[650px] text-center text-base font-medium leading-relaxed text-muted-foreground md:text-lg">
              A working network for builders in Bhutan. Connect, collaborate, 
              and build the future of the nation&apos;s technical ecosystem.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <Link 
              href="/pricing"
              className={cn(buttonVariants({ size: "lg" }), "h-11 rounded-sm bg-primary px-10 text-[13px] font-bold tracking-tight shadow-md transition hover:opacity-90 active:scale-95")}
            >
              See pricing
            </Link>
            <Link 
              href="#capabilities"
              className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "h-11 rounded-sm border px-10 text-[13px] font-bold tracking-tight transition hover:bg-secondary/50 active:scale-95")}
            >
              Learn more
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
