"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface TeamMember {
  id: string
  full_name: string
  email: string
  role: string
}

interface TeamManagementProps {
  team: TeamMember[]
  user: any
  inviteData: { name: string; email: string; role: string }
  setInviteData: (data: any) => void
  isInviting: boolean
  handleAddMember: () => void
  handleRemoveMember: (id: string) => void
  confirmRemoveId: string | null
}

export function TeamManagement({
  team,
  user,
  inviteData,
  setInviteData,
  isInviting,
  handleAddMember,
  handleRemoveMember,
  confirmRemoveId
}: TeamManagementProps) {
  return (
    <div className="p-6 md:p-8 space-y-10 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-[#101828]">Your Team</h3>
          <p className="text-xs text-muted-foreground">Manage your collaborators and their roles.</p>
        </div>
      </div>

      <div className="p-6 bg-secondary/20 rounded-xl border border-border/40 space-y-6">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Add Team Member</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Full name"
            className="bg-background border border-border rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-primary/10 transition-all"
            value={inviteData.name}
            onChange={e => setInviteData({ ...inviteData, name: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email address"
            className="bg-background border border-border rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-primary/10 transition-all"
            value={inviteData.email}
            onChange={e => setInviteData({ ...inviteData, email: e.target.value })}
          />
          <div className="flex gap-2">
            <select
              className="flex-1 bg-background border border-border rounded-lg p-2 text-sm outline-none"
              value={inviteData.role}
              onChange={e => setInviteData({ ...inviteData, role: e.target.value })}
            >
              <option>Contributor</option>
              <option>Editor</option>
              <option>Viewer</option>
            </select>
            <button
              onClick={handleAddMember}
              disabled={isInviting || !inviteData.email}
              className="px-4 bg-primary text-background rounded-lg text-sm font-bold hover:opacity-90 transition-all disabled:opacity-30"
            >
              {isInviting ? "..." : "Add"}
            </button>
          </div>
        </div>
      </div>

      <div className="border border-border/60 rounded-xl divide-y divide-border/40 overflow-hidden shadow-sm">
        <div className="flex items-center justify-between p-5 bg-secondary/10">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center text-[10px] font-bold text-primary overflow-hidden shrink-0">
              {user.user_metadata?.avatar_url ? (
                <img src={user.user_metadata.avatar_url} className="h-full w-full object-cover" />
              ) : (
                user.user_metadata?.full_name?.[0] || user.email?.[0].toUpperCase()
              )}
            </div>
            <div>
              <p className="text-[13px] font-bold text-[#101828]">{user.user_metadata?.full_name || "You"}</p>
              <p className="text-[11px] text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 bg-primary/10 text-primary rounded-full">Owner</span>
        </div>

        {team.map((m) => (
          <div key={m.id} className="flex items-center justify-between p-5 bg-background hover:bg-secondary/20 transition-all relative group">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-secondary italic flex items-center justify-center text-[12px] font-black text-muted-foreground/60 border border-border/60">
                {m.full_name[0]}
              </div>
              <div>
                <p className="text-[13px] font-bold text-[#101828]">{m.full_name}</p>
                <p className="text-[11px] text-muted-foreground">{m.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 px-2 py-0.5 bg-secondary/50 rounded-md border border-border/40">{m.role}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveMember(m.id);
                }}
                className={cn(
                  "text-[10px] font-bold uppercase tracking-widest transition-all px-4 py-2 rounded-md border min-w-[100px] text-center",
                  confirmRemoveId === m.id
                    ? "bg-red-500 text-white border-red-600 animate-pulse"
                    : "text-muted-foreground/60 hover:text-red-500 hover:border-red-200"
                )}
              >
                {confirmRemoveId === m.id ? "Click to Confirm" : "Remove"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {team.length === 0 && (
        <div className="py-12 text-center border border-dashed border-border rounded-xl">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">No team members added yet.</p>
        </div>
      )}
    </div>
  )
}
