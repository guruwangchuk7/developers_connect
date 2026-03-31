import { GlobalHeader } from "@/components/common/global-header";
import { GlobalFooter } from "@/components/common/global-footer";
import { Metadata } from "next";
import { Calendar, MapPin, Search, Users, Trophy } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Events | Bhutan Developer Network",
  description: "Join technical meetups, hackathons, and workshops across the national ecosystem.",
};

export default function EventsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-primary/5">
      <GlobalHeader />
      <main className="flex-1">
        <section className="py-16 md:py-24 lg:py-32">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 md:mb-24">
              <div className="space-y-4 text-center md:text-left">
                <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold tracking-tighter">
                  Ecosystem Events
                </h1>
                <p className="text-muted-foreground text-sm font-medium leading-relaxed md:text-lg max-w-2xl">
                  Join the conversations and competitions shaping the future of technical innovation in Bhutan.
                </p>
              </div>
              
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Filter events..."
                  className="w-full bg-transparent border-b border-border/80 pl-10 py-3 focus:outline-none focus:border-primary transition-colors text-sm font-medium tracking-tight"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-px md:bg-border md:border border-border rounded-sm overflow-hidden mb-20 md:mb-32">
              <EventCard 
                title="Bhutopia Hackathon 2026"
                description="48 hours of building for the national grid. Top projects get seed funding and expert mentorship."
                location="Thimphu TechPark"
                date="June 12 - 14, 2026"
                type="HACKATHON"
                attendees={128}
                prize="Nu. 500,000"
                featured={true}
              />
              <EventCard 
                title="Frontend performance at scale"
                description="A deep dive into Tailwind v4 and React 19 performance patterns for high-traffic public portals."
                location="Rigsum IT Institute"
                date="April 25, 2026"
                type="WORKSHOP"
                attendees={45}
              />
              <EventCard 
                title="Cybersecurity in Public Services"
                description="Discussing infrastructure hardening and secure data exchange protocols within government services."
                location="Jigme Namgyel Engineering College"
                date="May 05, 2026"
                type="SYMPOSIUM"
                attendees={80}
              />
              <EventCard 
                title="Sanity + Next.js User Group"
                description="Monthly casual meetup for developers building CMS-driven applications in the national context."
                location="FabLab Bhutan"
                date="May 18, 2026"
                type="MEETUP"
                attendees={22}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-secondary/20 p-12 lg:p-24 rounded-sm border border-border">
                <div className="space-y-8">
                    <div className="space-y-4">
                        <h3 className="text-3xl md:text-5xl font-bold tracking-tighter">Organize an Event</h3>
                        <p className="text-muted-foreground text-lg font-medium leading-relaxed">
                            Have an idea for a workshop, meetup, or hackathon? Use our platform to manage registrations, find venues, and scale your impact.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-6 pt-4">
                       <div className="flex items-center gap-3">
                           <div className="h-10 w-10 bg-background rounded-full flex items-center justify-center text-primary border border-border shadow-sm">
                               <Users className="h-5 w-5" />
                           </div>
                           <span className="text-[12px] font-bold uppercase tracking-widest text-muted-foreground/80 leading-snug">Registration<br/>Tools</span>
                       </div>
                       <div className="flex items-center gap-3">
                           <div className="h-10 w-10 bg-background rounded-full flex items-center justify-center text-primary border border-border shadow-sm">
                               <MapPin className="h-5 w-5" />
                           </div>
                           <span className="text-[12px] font-bold uppercase tracking-widest text-muted-foreground/80 leading-snug">Venue<br/>Partners</span>
                       </div>
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center space-y-6 md:border-l border-border md:pl-16">
                    <p className="text-muted-foreground font-medium text-center">Join the network to submit your event proposal to the national board.</p>
                    <Link href="/join" className="w-full sm:w-auto px-12 py-4 bg-primary text-primary-foreground font-bold rounded-sm hover:opacity-90 transition-opacity text-sm uppercase tracking-widest text-center shadow-lg hover:shadow-primary/20">
                        Sign in to submit
                    </Link>
                </div>
            </div>
          </div>
        </section>
      </main>
      <GlobalFooter />
    </div>
  );
}

function EventCard({ title, description, location, date, type, attendees, prize, featured }: { 
  title: string, 
  description: string, 
  location: string,
  date: string,
  type: string,
  attendees: number,
  prize?: string,
  featured?: boolean
}) {
  return (
    <div className={cn(
        "bg-background p-8 md:p-12 space-y-8 hover:bg-secondary/10 transition-colors group",
        featured && "md:col-span-2 border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors"
    )}>
      <div className="flex items-start justify-between">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60">
          {type}
        </span>
        {prize && (
            <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm">
                <Trophy className="h-3 w-3" /> Prize: {prize}
            </div>
        )}
      </div>
      
      <div className={cn("space-y-4", featured && "max-w-xl mx-auto text-center md:text-left md:mx-0")}>
        <h3 className={cn("text-xl md:text-2xl lg:text-3xl font-bold tracking-tight group-hover:text-primary transition-colors cursor-pointer", featured && "md:text-2xl lg:text-4xl")}>{title}</h3>
        <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
          {description}
        </p>
      </div>

      <div className="flex flex-wrap gap-x-8 gap-y-4 pt-4 border-t border-border/60">
        <div className="flex items-center gap-2 font-semibold text-[11px] text-muted-foreground uppercase tracking-widest">
            <Calendar className="h-4 w-4 text-primary/40" /> {date}
        </div>
        <div className="flex items-center gap-2 font-semibold text-[11px] text-muted-foreground uppercase tracking-widest">
            <MapPin className="h-4 w-4 text-primary/40" /> {location}
        </div>
        <div className="flex items-center gap-2 font-semibold text-[11px] text-muted-foreground uppercase tracking-widest ml-auto">
            <Users className="h-4 w-4 text-primary/40" /> {attendees} Joined
        </div>
      </div>
      
      <div className="pt-4">
          <button className="w-full md:w-auto px-8 py-2.5 bg-primary/10 text-primary font-bold hover:bg-primary/20 transition-colors rounded-sm text-xs uppercase tracking-widest">
              Register Now →
          </button>
      </div>
    </div>
  );
}
