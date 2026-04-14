import { buttonVariants } from "@/components/ui/button-variants";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function HeroSection() {
  return (
    <section className="relative flex min-h-[calc(100dvh-var(--header-height,64px))] flex-col items-center justify-center border-b bg-grid overflow-y-auto overflow-x-hidden">
      <div className="w-full relative py-12 md:py-20 lg:py-32 px-[1cm]">
        <div className="flex flex-col items-center gap-8 md:gap-14">
          <div className="flex flex-col items-center gap-4 md:gap-6">
            <h1 className="max-w-[1000px] text-center text-3xl font-semibold leading-[1.2] tracking-tighter sm:text-5xl md:text-7xl lg:text-8xl text-balance">
              Bhutan Developer Network
            </h1>

            <p className="max-w-[650px] text-center text-sm font-medium leading-relaxed text-muted-foreground md:text-lg text-balance">
              A working network for builders in Bhutan. Connect, collaborate,
              and build the future of the nation&apos;s technical ecosystem.
            </p>
          </div>


        </div>
      </div>
    </section>
  );
}
