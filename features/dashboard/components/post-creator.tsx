"use client"

import * as React from "react"
import { Flame, Sparkles, Trophy, Bookmark, MessageCircle, LayoutGrid } from "lucide-react"

interface PostCreatorProps {
  activeTab: string
  guidedFields: Record<string, string>
  setGuidedFields: (fields: Record<string, string>) => void
  isPosting: boolean
  handlePost: () => void
}

export function PostCreator({
  activeTab,
  guidedFields,
  setGuidedFields,
  isPosting,
  handlePost
}: PostCreatorProps) {
  const isHelpType = ["help", "post-update", "ask-help"].includes(activeTab)
  const isTeamType = ["teams", "team-needed", "dev-needed"].includes(activeTab)
  const isProjectType = ["projects", "share-project"].includes(activeTab)
  const isEventType = ["organize-event"].includes(activeTab)

  if (!isHelpType && !isTeamType && !isProjectType && !isEventType) return null

  const getHelpLabels = () => {
    if (activeTab === "post-update") {
      return {
        title: "Project Sync",
        blocker: "Primary Milestone",
        context: "Update details to help others synchronize with your progress..."
      }
    }
    if (activeTab === "ask-help") {
      return {
        title: "Project SOS",
        blocker: "What's the blocker?",
        context: "Provide details about your project and the specific help you need..."
      }
    }
    return {
      title: "Guided Synthesis",
      blocker: "Primary Blocker",
      context: "Provide details to help others synchronize with your issue..."
    }
  }

  const helpLabels = getHelpLabels()

  return (
    <div className="p-8 md:p-10 bg-background border border-border/40 rounded-sm shadow-xl shadow-black/[0.02] space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="flex items-center gap-4">
        <div className="h-0.5 w-8 bg-primary/30" />
        <h3 className="text-[13px] font-semibold uppercase tracking-widest text-primary/60">
          {isHelpType ? helpLabels.title : isTeamType ? "Team Formation" : isEventType ? "Event Initiation" : "Project Launch"}
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
        {isHelpType && (
          <>
            <div className={`space-y-3 ${activeTab === 'post-update' ? 'md:col-span-2' : ''}`}>
              <label className="text-[13px] font-medium text-muted-foreground/60 pl-1">{helpLabels.blocker}</label>
              {activeTab === 'post-update' ? (
                <textarea
                  placeholder="Share a specific technical update or milestone..."
                  className="w-full bg-secondary/40 border border-transparent px-4 py-4 rounded-sm focus:outline-none focus:border-primary/20 focus:bg-background transition-all text-[14px] font-medium placeholder:text-muted-foreground/30 min-h-[100px] resize-none"
                  value={guidedFields.blocker || ""}
                  onChange={e => setGuidedFields({ ...guidedFields, blocker: e.target.value })}
                />
              ) : (
                <input type="text" placeholder="e.g. Supabase Auth Proxy" className="w-full bg-secondary/40 border border-transparent px-4 py-3 rounded-sm focus:outline-none focus:border-primary/20 focus:bg-background transition-all text-[14px] font-medium placeholder:text-muted-foreground/30" value={guidedFields.blocker || ""} onChange={e => setGuidedFields({ ...guidedFields, blocker: e.target.value })} />
              )}
            </div>
            <div className="space-y-3">
              <label className="text-[13px] font-medium text-muted-foreground/60 pl-1">Tech Stack</label>
              <input type="text" placeholder="e.g. Next.js 14, Tailwind" className="w-full bg-secondary/40 border border-transparent px-4 py-3 rounded-sm focus:outline-none focus:border-primary/20 focus:bg-background transition-all text-[14px] font-medium placeholder:text-muted-foreground/30" value={guidedFields.stack || ""} onChange={e => setGuidedFields({ ...guidedFields, stack: e.target.value })} />
            </div>
            <div className="space-y-3 md:col-span-1">
              <label className="text-[13px] font-medium text-muted-foreground/60 pl-1">Full Context</label>
              <textarea placeholder={helpLabels.context} className="w-full bg-secondary/40 border border-transparent px-4 py-4 rounded-sm focus:outline-none focus:border-primary/20 focus:bg-background transition-all text-[14px] font-medium placeholder:text-muted-foreground/30 min-h-[120px] resize-none" value={guidedFields.context || ""} onChange={e => setGuidedFields({ ...guidedFields, context: e.target.value })} />
            </div>
          </>
        )}

        {isTeamType && (
          <>
            <div className="space-y-3">
              <label className="text-[13px] font-medium text-muted-foreground/60 pl-1">Role Needed</label>
              <input type="text" placeholder="e.g. Rust Developer" className="w-full bg-secondary/40 border border-transparent px-4 py-3 rounded-sm focus:outline-none focus:border-primary/20 focus:bg-background transition-all text-[14px] font-medium placeholder:text-muted-foreground/30" value={guidedFields.role || ""} onChange={e => setGuidedFields({ ...guidedFields, role: e.target.value })} />
            </div>
            <div className="space-y-3">
              <label className="text-[13px] font-medium text-muted-foreground/60 pl-1">Project Name</label>
              <input type="text" placeholder="e.g. DrukRide MVP" className="w-full bg-secondary/40 border border-transparent px-4 py-3 rounded-sm focus:outline-none focus:border-primary/20 focus:bg-background transition-all text-[14px] font-medium placeholder:text-muted-foreground/30" value={guidedFields.project || ""} onChange={e => setGuidedFields({ ...guidedFields, project: e.target.value })} />
            </div>
            <div className="space-y-3 md:col-span-2">
              <label className="text-[13px] font-medium text-muted-foreground/60 pl-1">Mission Goal</label>
              <textarea placeholder="Describe the mission and what success looks like..." className="w-full bg-secondary/40 border border-transparent px-4 py-4 rounded-sm focus:outline-none focus:border-primary/20 focus:bg-background transition-all text-[14px] font-medium placeholder:text-muted-foreground/30 min-h-[120px] resize-none" value={guidedFields.mission || ""} onChange={e => setGuidedFields({ ...guidedFields, mission: e.target.value })} />
            </div>
          </>
        )}

        {isProjectType && (
          <>
            <div className="space-y-3">
              <label className="text-[13px] font-medium text-muted-foreground/60 pl-1">Project Name</label>
              <input type="text" placeholder="e.g. OpenBhutan Maps" className="w-full bg-secondary/40 border border-transparent px-4 py-3 rounded-sm focus:outline-none focus:border-primary/20 focus:bg-background transition-all text-[14px] font-medium placeholder:text-muted-foreground/30" value={guidedFields.projectName || ""} onChange={e => setGuidedFields({ ...guidedFields, projectName: e.target.value })} />
            </div>
            <div className="space-y-3">
              <label className="text-[13px] font-medium text-muted-foreground/60 pl-1">Public Link</label>
              <input type="text" placeholder="github.com/..." className="w-full bg-secondary/40 border border-transparent px-4 py-3 rounded-sm focus:outline-none focus:border-primary/20 focus:bg-background transition-all text-[14px] font-medium placeholder:text-muted-foreground/30" value={guidedFields.link || ""} onChange={e => setGuidedFields({ ...guidedFields, link: e.target.value })} />
            </div>
            <div className="space-y-3 md:col-span-2">
              <label className="text-[13px] font-medium text-muted-foreground/60 pl-1">Brief Description</label>
              <textarea placeholder="What are you building?" className="w-full bg-secondary/40 border border-transparent px-4 py-4 rounded-sm focus:outline-none focus:border-primary/20 focus:bg-background transition-all text-[14px] font-medium placeholder:text-muted-foreground/30 min-h-[120px] resize-none" value={guidedFields.description || ""} onChange={e => setGuidedFields({ ...guidedFields, description: e.target.value })} />
            </div>
          </>
        )}

        {isEventType && (
          <>
            <div className="space-y-3 md:col-span-2">
              <label className="text-[13px] font-medium text-muted-foreground/60 pl-1">Event Title</label>
              <input type="text" placeholder="e.g. Thimphu AI Hackathon 2026" className="w-full bg-secondary/40 border border-transparent px-4 py-3 rounded-sm focus:outline-none focus:border-primary/20 focus:bg-background transition-all text-[14px] font-medium placeholder:text-muted-foreground/30" value={guidedFields.eventTitle || ""} onChange={e => setGuidedFields({ ...guidedFields, eventTitle: e.target.value })} />
            </div>
            <div className="space-y-3">
              <label className="text-[13px] font-medium text-muted-foreground/60 pl-1">Venue</label>
              <input type="text" placeholder="e.g. TechPark Amphitheater" className="w-full bg-secondary/40 border border-transparent px-4 py-3 rounded-sm focus:outline-none focus:border-primary/20 focus:bg-background transition-all text-[14px] font-medium placeholder:text-muted-foreground/30" value={guidedFields.eventVenue || ""} onChange={e => setGuidedFields({ ...guidedFields, eventVenue: e.target.value })} />
            </div>
            <div className="space-y-3">
              <label className="text-[13px] font-medium text-muted-foreground/60 pl-1">Poster URL (Optional)</label>
              <input type="text" placeholder="https://image-host.com/poster.jpg" className="w-full bg-secondary/40 border border-transparent px-4 py-3 rounded-sm focus:outline-none focus:border-primary/20 focus:bg-background transition-all text-[14px] font-medium placeholder:text-muted-foreground/30" value={guidedFields.eventPoster || ""} onChange={e => setGuidedFields({ ...guidedFields, eventPoster: e.target.value })} />
            </div>
            <div className="space-y-3">
              <label className="text-[13px] font-medium text-muted-foreground/60 pl-1">Start Date</label>
              <input type="date" className="w-full bg-secondary/40 border border-transparent px-4 py-3 rounded-sm focus:outline-none focus:border-primary/20 focus:bg-background transition-all text-[14px] font-medium placeholder:text-muted-foreground/30" value={guidedFields.eventDate || ""} onChange={e => setGuidedFields({ ...guidedFields, eventDate: e.target.value })} />
            </div>
            <div className="space-y-3">
              <label className="text-[13px] font-medium text-muted-foreground/60 pl-1">End Date (Optional)</label>
              <input type="date" className="w-full bg-secondary/40 border border-transparent px-4 py-3 rounded-sm focus:outline-none focus:border-primary/20 focus:bg-background transition-all text-[14px] font-medium placeholder:text-muted-foreground/30" value={guidedFields.eventEndDate || ""} onChange={e => setGuidedFields({ ...guidedFields, eventEndDate: e.target.value })} />
            </div>
            <div className="space-y-3 md:col-span-2">
              <label className="text-[13px] font-medium text-muted-foreground/60 pl-1">Event Description</label>
              <textarea placeholder="Describe the hackathon theme, prizes, and schedule..." className="w-full bg-secondary/40 border border-transparent px-4 py-4 rounded-sm focus:outline-none focus:border-primary/20 focus:bg-background transition-all text-[14px] font-medium placeholder:text-muted-foreground/30 min-h-[120px] resize-none" value={guidedFields.eventDescription || ""} onChange={e => setGuidedFields({ ...guidedFields, eventDescription: e.target.value })} />
            </div>
          </>
        )}
      </div>

      <div className="pt-6 border-t border-border/20 flex flex-col md:flex-row md:items-center justify-end gap-6">
        <div className="flex items-center gap-4">
          <button
            onClick={handlePost}
            disabled={isPosting}
            className="w-full md:w-auto px-10 h-12 bg-primary text-background text-[13px] font-bold rounded-sm hover:opacity-90 transition-all flex items-center justify-center gap-3 shadow-lg shadow-primary/20 active:scale-95 disabled:opacity-50"
          >
            {isPosting ? "Synchronizing..." : "Post Fragment"}
            <Sparkles className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
