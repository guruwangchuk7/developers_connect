"use client"

import * as React from "react"
import { createClient } from "@/lib/supabase"
import { GlobalHeader } from "@/components/common/global-header";
import { GlobalFooter } from "@/components/common/global-footer";
import { Calendar, MapPin, Search, Users, Trophy } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function EventsPage() {
  const supabase = createClient()
  const [events, setEvents] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [searchTerm, setSearchTerm] = React.useState("")

  React.useEffect(() => {
    async function fetchEvents() {
      const { data, error } = await supabase
        .from('events')
        .select(`*, profiles!organizer_id (full_name)`)
        .order('event_date', { ascending: true })

      if (!error && data) {
        setEvents(data.map((e: any) => ({
          id: e.id,
          title: e.title,
          description: e.description,
          location: e.venue,
          date: new Date(e.event_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          type: "COMMUNITY", // Default type
          attendees: 0, // Not tracked in schema yet
          prize: null,
          featured: false,
          image_url: e.image_url
        })))
      }
      setIsLoading(false)
    }
    fetchEvents()
  }, [])

  const filteredEvents = events.filter((e: any) => 
    e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {isLoading ? (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-px">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-80 bg-secondary/20 animate-pulse rounded-sm"></div>
                  ))}
               </div>
            ) : filteredEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20 md:mb-32">
                {filteredEvents.map((event) => {
                   const endDateMatch = event.description?.match(/END_DATE: (.*)/)
                   const endDate = endDateMatch ? endDateMatch[1] : null
                   const cleanDescription = event.description?.replace(/END_DATE: (.*)/, '').trim()

                   return (
                    <EventCard 
                      key={event.id}
                      title={event.title}
                      description={cleanDescription}
                      location={event.location}
                      date={event.date}
                      endDate={endDate}
                      type={event.type}
                      attendees={event.attendees}
                      prize={event.prize}
                      featured={event.featured}
                      imageUrl={event.image_url}
                    />
                  )
                })}
              </div>
            ) : (
              <div className="py-24 text-center border border-dashed border-border rounded-sm mb-20 md:mb-32">
                 <p className="text-muted-foreground font-medium underline underline-offset-4 decoration-primary/30">No upcoming events are currently synchronized within the national grid.</p>
              </div>
            )}

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
                    <Link href="/join" className="w-full sm:w-auto px-12 py-4 bg-primary text-primary-foreground font-bold rounded-sm hover:opacity-90 transition-opacity text-[10px] uppercase tracking-[0.2em] text-center shadow-lg hover:shadow-primary/20">
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

function EventCard({ title, description, location, date, endDate, type, attendees, prize, featured, imageUrl }: { 
  title: string, 
  description: string, 
  location: string,
  date: string,
  endDate?: string | null,
  type: string,
  attendees: number,
  prize?: string | null,
  featured?: boolean,
  imageUrl?: string | null
}) {
  return (
    <div className={cn(
        "bg-background p-8 md:p-12 space-y-8 hover:bg-secondary/10 transition-colors group border border-border/40 rounded-sm",
        featured && "md:col-span-2 border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors"
    )}>
      {imageUrl && (
        <div className="aspect-video w-full overflow-hidden rounded-sm border border-border/10 mb-6">
          <img src={imageUrl} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
      )}
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
        <p className="text-muted-foreground leading-relaxed text-[14px] md:text-base line-clamp-3">
          {description}
        </p>
      </div>

      <div className="flex flex-wrap gap-x-8 gap-y-4 pt-4 border-t border-border/60">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 font-semibold text-[11px] text-muted-foreground uppercase tracking-widest">
              <Calendar className="h-4 w-4 text-primary/40" /> Starts: {date}
          </div>
          {endDate && (
             <div className="flex items-center gap-2 font-semibold text-[9px] text-muted-foreground/60 uppercase tracking-widest ml-6">
                Ends: {new Date(endDate).toLocaleDateString()}
             </div>
          )}
        </div>
        <div className="flex items-center gap-2 font-semibold text-[11px] text-muted-foreground uppercase tracking-widest">
            <MapPin className="h-4 w-4 text-primary/40" /> {location}
        </div>
        <div className="flex items-center gap-2 font-semibold text-[11px] text-muted-foreground uppercase tracking-widest ml-auto">
            <Users className="h-4 w-4 text-primary/40" /> {attendees} Joined
        </div>
      </div>
      
      <div className="pt-4">
          <button className="w-full md:w-auto px-8 py-2.5 bg-primary/10 text-primary font-bold hover:bg-primary/20 transition-colors rounded-sm text-[10px] uppercase tracking-widest">
              Register Now →
          </button>
      </div>
    </div>
  );
}
