"use client"

import * as React from "react"
import { Plus, Trophy, Trash2 } from "lucide-react"

interface EventGridProps {
  events: any[]
  onOrganizeEvent: () => void
  onDeleteEvent?: (id: string) => void
  currentUserId?: string
}

export function EventGrid({ events, onOrganizeEvent, onDeleteEvent, currentUserId }: EventGridProps) {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold tracking-tight">Active synchronization nodes</h3>
        <button
          onClick={onOrganizeEvent}
          className="px-6 py-2 bg-primary text-background text-[11px] font-bold rounded-sm hover:opacity-90 transition-all uppercase tracking-widest flex items-center gap-2"
        >
          <Plus className="h-3.5 w-3.5" /> Organize Event
        </button>
      </div>

      {events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => {
            const hasPoster = !!event.image_url
            const endDateMatch = event.description?.match(/END_DATE: (.*)/)
            const endDate = endDateMatch ? endDateMatch[1] : null
            const cleanDescription = event.description?.replace(/END_DATE: (.*)/, '').trim()
            const isOwner = currentUserId === event.organizer_id

            return (
              <div key={event.id} className="bg-background border border-border/40 rounded-sm overflow-hidden flex flex-col hover:border-primary/20 transition-all group relative">
                {isOwner && onDeleteEvent && (
                  <button 
                    onClick={() => onDeleteEvent(event.id)}
                    className="absolute top-3 right-3 z-10 p-2 bg-background/80 backdrop-blur-md rounded-full border border-border/40 text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
                {hasPoster && (
                  <div className="aspect-video w-full overflow-hidden border-b border-border/10">
                    <img src={event.image_url} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                )}
                <div className="p-6 space-y-4 flex-1 flex flex-col">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary/60">Community Event</span>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 bg-secondary rounded-full">
                        {new Date(event.event_date).toLocaleDateString()}
                      </span>
                      {endDate && (
                        <span className="text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 border border-border/40 rounded-full text-muted-foreground">
                          Ends: {new Date(endDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2 flex-1">
                    <h4 className="text-lg font-bold tracking-tight group-hover:text-primary transition-colors line-clamp-1">{event.title}</h4>
                    <p className="text-[13px] text-muted-foreground line-clamp-3 leading-relaxed">{cleanDescription}</p>
                  </div>
                  <div className="pt-4 border-t border-border/20 flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 rounded-full bg-secondary flex items-center justify-center text-[8px] font-black italic">
                        {event.profiles?.full_name?.[0] || 'A'}
                      </div>
                      <span className="text-[10px] font-bold text-muted-foreground/60">{event.profiles?.full_name || 'Anonymous'}</span>
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground/40">{event.venue}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="py-24 text-center border border-dashed border-border/30 rounded-xl bg-secondary/5">
          <div className="h-12 w-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-bold tracking-tight mb-2">Upcoming Community Events</h3>
          <p className="text-muted-foreground max-w-sm mx-auto">No events scheduled. Be the first to organize a workshop or hackathon!</p>
        </div>
      )}
    </div>
  )
}
