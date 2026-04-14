"use client"

import * as React from "react"
import { Search, Check, Clock } from "lucide-react"

import { Profile } from "@/types"

interface DiscoverDevelopersProps {
  allProfiles: Profile[]
  user: any
  discoverSearch: string
  setDiscoverSearch: (val: string) => void
  handleConnect: (id: string) => void
  handleCancelConnection: (id: string) => void
  getConnectionStatus: (id: string) => string
}

export function DiscoverDevelopers({
  allProfiles,
  user,
  discoverSearch,
  setDiscoverSearch,
  handleConnect,
  handleCancelConnection,
  getConnectionStatus
}: DiscoverDevelopersProps) {
  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {allProfiles.filter(p => p.id !== user?.id).filter(p =>
          p.full_name?.toLowerCase().includes(discoverSearch.toLowerCase()) ||
          p.role?.toLowerCase().includes(discoverSearch.toLowerCase()) ||
          p.skills?.some((s: string) => s.toLowerCase().includes(discoverSearch.toLowerCase()))
        ).map((dev) => (
          <div key={dev.id} className="p-8 bg-background border border-border/40 rounded-sm hover:border-primary/20 transition-all group">
            <div className="flex items-center gap-5 mb-6">
              <div className="h-14 w-14 rounded-full bg-secondary border border-border/20 flex items-center justify-center text-[14px] font-black uppercase overflow-hidden">
                {dev.avatar_url ? (
                  <img src={dev.avatar_url} alt={dev.full_name || ""} className="h-full w-full object-cover" />
                ) : (
                  dev.full_name?.[0]
                )}
              </div>
              <div className="space-y-0.5 text-left">
                <h4 className="text-[15px] font-medium text-foreground">{dev.full_name}</h4>
                <p className="text-[12px] font-medium text-muted-foreground/50">{dev.role}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-8">
              {dev.skills?.map((s: string) => (
                <span key={s} className="px-2.5 py-1 bg-secondary/40 border border-border/20 text-[9px] font-bold text-muted-foreground/60 rounded-sm">{s}</span>
              ))}
            </div>

            {getConnectionStatus(dev.id) === "SELF" ? (
              <div className="w-full py-3 text-[13px] font-bold border border-border/40 bg-secondary/20 text-muted-foreground/40 rounded-sm text-center">
                Your Profile
              </div>
            ) : getConnectionStatus(dev.id) === "CONNECTED" ? (
              <div className="w-full py-3 text-[13px] font-bold border border-emerald-100 bg-emerald-50 text-emerald-600 rounded-sm text-center flex items-center justify-center gap-2">
                <Check className="h-4 w-4" /> Connected
              </div>
            ) : getConnectionStatus(dev.id) === "PENDING_SENT" ? (
              <button
                onClick={() => handleCancelConnection(dev.id)}
                onMouseEnter={(e) => {
                  const span = e.currentTarget.querySelector('.status-text')
                  if (span) span.innerHTML = 'Cancel Request?'
                  e.currentTarget.classList.add('bg-red-500', 'text-white', 'border-red-600')
                  e.currentTarget.classList.remove('bg-orange-50', 'text-orange-500', 'border-orange-100')
                }}
                onMouseLeave={(e) => {
                  const span = e.currentTarget.querySelector('.status-text')
                  if (span) span.innerHTML = 'Request Sent'
                  e.currentTarget.classList.remove('bg-red-500', 'text-white', 'border-red-600')
                  e.currentTarget.classList.add('bg-orange-50', 'text-orange-500', 'border-orange-100')
                }}
                className="w-full py-3 text-[13px] font-bold border border-orange-100 bg-orange-50 text-orange-500 rounded-sm transition-all text-center flex items-center justify-center gap-2"
              >
                <Clock className="h-4 w-4" />
                <span className="status-text">Request Sent</span>
              </button>
            ) : getConnectionStatus(dev.id) === "PENDING_RECEIVED" ? (
              <div className="w-full py-3 text-[13px] font-bold border border-blue-100 bg-blue-50 text-blue-600 rounded-sm text-center flex items-center justify-center gap-2">
                <Clock className="h-4 w-4" /> Respond in Messages
              </div>
            ) : (
              <button
                onClick={() => handleConnect(dev.id)}
                className="w-full py-3 text-[13px] font-bold border border-border/40 hover:bg-primary hover:text-background transition-all rounded-sm shadow-sm active:scale-95"
              >
                Send Connection Request
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
