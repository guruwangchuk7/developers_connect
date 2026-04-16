"use client"

import * as React from "react"
import { Flame, Sparkles, Trophy, Bookmark, MessageCircle, LayoutGrid, ImagePlus, X, Camera, Tag as TagIcon } from "lucide-react"
import { Profile } from "@/types"

interface PostCreatorProps {
  activeTab: string
  guidedFields: Record<string, string>
  setGuidedFields: (fields: Record<string, string>) => void
  isPosting: boolean
  handlePost: () => void
  onUploadImage?: (file: File) => Promise<string | null>
  user?: Profile | null
}

export function PostCreator({
  activeTab,
  guidedFields,
  setGuidedFields,
  isPosting,
  handlePost,
  onUploadImage,
  user
}: PostCreatorProps) {
  const [isUploading, setIsUploading] = React.useState(false)
  const [isDragging, setIsDragging] = React.useState(false)
  const [showTags, setShowTags] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const updateFileInputRef = React.useRef<HTMLInputElement>(null)

  const isHelpType = ["help", "post-update", "ask-help"].includes(activeTab)
  const isTeamType = ["teams", "team-needed", "dev-needed"].includes(activeTab)
  const isProjectType = ["projects", "share-project"].includes(activeTab)
  const isEventType = ["organize-event"].includes(activeTab)

  if (!isHelpType && !isTeamType && !isProjectType && !isEventType) return null

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !onUploadImage) return

    setIsUploading(true)
    const url = await onUploadImage(file)
    if (url) {
      setGuidedFields({ ...guidedFields, eventPoster: url })
    }
    setIsUploading(false)
  }

  const getHelpLabels = () => {
    if (activeTab === "post-update") {
      return {
        title: "Share an Update",
        blocker: "",
        context: ""
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
      title: "Quick Post",
      blocker: "Main Problem",
      context: "Explain what you're stuck on so the network can help..."
    }
  }

  const helpLabels = getHelpLabels()

  if (activeTab === 'post-update' || activeTab === 'dev-needed') {
    return (
      <div className="bg-background border border-border/40 rounded-sm shadow-xl shadow-black/[0.02] overflow-hidden">
        <div className="p-6 md:p-8 space-y-6">
          <div className="flex gap-4">
            <div className="h-12 w-12 rounded-full bg-secondary border border-border/10 flex items-center justify-center text-[13px] font-bold uppercase text-primary/60 overflow-hidden shrink-0">
              {user?.avatar_url ? (
                <img src={user.avatar_url || ""} alt={user.full_name || undefined} className="h-full w-full object-cover" />
              ) : (
                user?.full_name?.[0] || '?'
              )}
            </div>

            <div className="flex-1 space-y-4">
              {activeTab === 'dev-needed' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-500">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40 pl-1">Role Needed</label>
                    <input
                      type="text"
                      placeholder="e.g. Rust Developer"
                      className="w-full bg-secondary/20 border-none px-4 py-2 rounded-sm focus:ring-1 focus:ring-primary/20 text-[14px] font-medium placeholder:text-muted-foreground/30"
                      value={guidedFields.role || ""}
                      onChange={e => setGuidedFields({ ...guidedFields, role: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40 pl-1">Project Name</label>
                    <input
                      type="text"
                      placeholder="e.g. DrukRide MVP"
                      className="w-full bg-secondary/20 border-none px-4 py-2 rounded-sm focus:ring-1 focus:ring-primary/20 text-[14px] font-medium placeholder:text-muted-foreground/30"
                      value={guidedFields.project || ""}
                      onChange={e => setGuidedFields({ ...guidedFields, project: e.target.value })}
                    />
                  </div>
                </div>
              )}

              <textarea
                placeholder={activeTab === 'dev-needed' ? "Describe the mission, the challenge, and who you are looking for..." : "Share your thoughts..."}
                className="w-full bg-transparent border-none px-0 py-2 focus:ring-0 focus:outline-none text-[15px] md:text-[16px] font-medium placeholder:text-muted-foreground/30 min-h-[120px] resize-none leading-relaxed"
                value={activeTab === 'dev-needed' ? guidedFields.mission : guidedFields.blocker}
                onChange={e => setGuidedFields({ ...guidedFields, [activeTab === 'dev-needed' ? 'mission' : 'blocker']: e.target.value })}
              />

              {activeTab === 'post-update' && guidedFields.updateImage && (
                <div className="relative rounded-sm overflow-hidden border border-border/30 group/img">
                  <img src={guidedFields.updateImage} alt="Upload preview" className="w-full object-contain bg-secondary/10" />
                  <button
                    type="button"
                    onClick={() => setGuidedFields({ ...guidedFields, updateImage: "" })}
                    className="absolute top-3 right-3 h-8 w-8 bg-black/60 hover:bg-red-500 text-white rounded-full flex items-center justify-center transition-colors shadow-lg"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              {showTags && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex items-center gap-3 bg-secondary/20 p-3 rounded-sm">
                    <TagIcon className="h-4 w-4 text-primary/60" />
                    <input
                      type="text"
                      placeholder="Add tags (e.g. Next.js, Supabase) comma separated"
                      className="bg-transparent border-none p-0 focus:ring-0 focus:outline-none text-[13px] font-medium w-full placeholder:text-muted-foreground/40"
                      value={guidedFields.stack || ""}
                      onChange={e => setGuidedFields({ ...guidedFields, stack: e.target.value })}
                      autoFocus
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-secondary/10 border-t border-border/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {activeTab === 'post-update' && (
              <>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={updateFileInputRef}
                  onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (!file || !onUploadImage) return
                    setIsUploading(true)
                    const url = await onUploadImage(file)
                    if (url) setGuidedFields({ ...guidedFields, updateImage: url })
                    setIsUploading(false)
                  }}
                />

                <button
                  onClick={() => updateFileInputRef.current?.click()}
                  className="p-2.5 rounded-full hover:bg-secondary transition-colors text-muted-foreground hover:text-primary disabled:opacity-50"
                  title="Add Image"
                  disabled={isUploading}
                >
                  <Camera className={`h-5 w-5 ${isUploading ? 'animate-pulse' : ''}`} />
                </button>
              </>
            )}
            <button
              onClick={() => setShowTags(!showTags)}
              className={`p-2.5 rounded-full hover:bg-secondary transition-colors ${showTags ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
              title="Add Tags"
            >
              <TagIcon className="h-5 w-5" />
            </button>
          </div>

          <button
            onClick={handlePost}
            disabled={isPosting || (activeTab === 'dev-needed' ? !guidedFields.mission?.trim() : !guidedFields.blocker?.trim())}
            className="px-8 h-10 bg-primary text-background text-[13px] font-bold rounded-full hover:opacity-90 disabled:opacity-50 disabled:grayscale transition-all flex items-center gap-2 shadow-lg shadow-primary/20 active:scale-95"
          >
            {isPosting ? "Posting..." : activeTab === 'dev-needed' ? "Share Role" : "Post"}
            <Sparkles className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    )
  }

  if (activeTab === 'ask-help') {
    return (
      <div className="bg-background border border-border/40 rounded-sm shadow-xl shadow-black/[0.02] overflow-hidden">
        <div className="p-6 md:p-8 space-y-6">
          <div className="flex gap-4">
            <div className="h-12 w-12 rounded-full bg-secondary border border-border/10 flex items-center justify-center text-[13px] font-bold uppercase text-primary/60 overflow-hidden shrink-0">
              {user?.avatar_url ? (
                <img src={user.avatar_url || ""} alt={user.full_name || undefined} className="h-full w-full object-cover" />
              ) : (
                user?.full_name?.[0] || '?'
              )}
            </div>

            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary/60 px-2 py-0.5 bg-primary/5 rounded-sm">Project SOS</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-500">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40 pl-1">The Blocker</label>
                  <input
                    type="text"
                    placeholder="e.g. Supabase Auth Error"
                    className="w-full bg-secondary/20 border-none px-4 py-2 rounded-sm focus:ring-1 focus:ring-primary/20 text-[14px] font-medium placeholder:text-muted-foreground/30"
                    value={guidedFields.blocker || ""}
                    onChange={e => setGuidedFields({ ...guidedFields, blocker: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40 pl-1">Tech Stack</label>
                  <input
                    type="text"
                    placeholder="e.g. Next.js, FastAPI"
                    className="w-full bg-secondary/20 border-none px-4 py-2 rounded-sm focus:ring-1 focus:ring-primary/20 text-[14px] font-medium placeholder:text-muted-foreground/30"
                    value={guidedFields.stack || ""}
                    onChange={e => setGuidedFields({ ...guidedFields, stack: e.target.value })}
                  />
                </div>
              </div>

              <textarea
                placeholder="Describe where you're stuck and what you've tried..."
                className="w-full bg-transparent border-none px-0 py-2 focus:ring-0 focus:outline-none text-[15px] md:text-[16px] font-medium placeholder:text-muted-foreground/30 min-h-[120px] resize-none leading-relaxed"
                value={guidedFields.context}
                onChange={e => setGuidedFields({ ...guidedFields, context: e.target.value })}
              />

              {showTags && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex items-center gap-3 bg-secondary/20 p-3 rounded-sm">
                    <TagIcon className="h-4 w-4 text-primary/60" />
                    <input
                      type="text"
                      placeholder="Add tags... comma separated"
                      className="bg-transparent border-none p-0 focus:ring-0 focus:outline-none text-[13px] font-medium w-full placeholder:text-muted-foreground/40"
                      value={guidedFields.stack_tags || ""}
                      onChange={e => setGuidedFields({ ...guidedFields, stack_tags: e.target.value })}
                      autoFocus
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-secondary/10 border-t border-border/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowTags(!showTags)}
              className={`p-2.5 rounded-full hover:bg-secondary transition-colors ${showTags ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
              title="Add Tags"
            >
              <TagIcon className="h-5 w-5" />
            </button>
          </div>

          <button
            onClick={handlePost}
            disabled={isPosting || !guidedFields.blocker?.trim()}
            className="px-8 h-10 bg-primary text-background text-[13px] font-bold rounded-full hover:opacity-90 disabled:opacity-50 disabled:grayscale transition-all flex items-center gap-2 shadow-lg shadow-primary/20 active:scale-95"
          >
            {isPosting ? "Posting..." : "Request Help"}
            <Sparkles className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    )
  }

  if (activeTab === 'share-project') {
    return (
      <div className="bg-background border border-border/40 rounded-sm shadow-xl shadow-black/[0.02] overflow-hidden">
        <div className="p-6 md:p-8 space-y-6">
          <div className="flex gap-4">
            <div className="h-12 w-12 rounded-full bg-secondary border border-border/10 flex items-center justify-center text-[13px] font-bold uppercase text-primary/60 overflow-hidden shrink-0">
              {user?.avatar_url ? (
                <img src={user.avatar_url || ""} alt={user.full_name || undefined} className="h-full w-full object-cover" />
              ) : (
                user?.full_name?.[0] || '?'
              )}
            </div>

            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary/60 px-2 py-0.5 bg-primary/5 rounded-sm">Project Launch</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-500">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40 pl-1">Project Name</label>
                  <input
                    type="text"
                    placeholder="e.g. OpenBhutan Maps"
                    className="w-full bg-secondary/20 border-none px-4 py-2 rounded-sm focus:ring-1 focus:ring-primary/20 text-[14px] font-medium placeholder:text-muted-foreground/30"
                    value={guidedFields.projectName || ""}
                    onChange={e => setGuidedFields({ ...guidedFields, projectName: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40 pl-1">Public Link</label>
                  <input
                    type="text"
                    placeholder="github.com/..."
                    className="w-full bg-secondary/20 border-none px-4 py-2 rounded-sm focus:ring-1 focus:ring-primary/20 text-[14px] font-medium placeholder:text-muted-foreground/30"
                    value={guidedFields.link || ""}
                    onChange={e => setGuidedFields({ ...guidedFields, link: e.target.value })}
                  />
                </div>
              </div>

              <textarea
                placeholder="What does it do? Why did you build it? Share the magic..."
                className="w-full bg-transparent border-none px-0 py-2 focus:ring-0 focus:outline-none text-[15px] md:text-[16px] font-medium placeholder:text-muted-foreground/30 min-h-[120px] resize-none leading-relaxed"
                value={guidedFields.description}
                onChange={e => setGuidedFields({ ...guidedFields, description: e.target.value })}
              />

              {showTags && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex items-center gap-3 bg-secondary/20 p-3 rounded-sm">
                    <TagIcon className="h-4 w-4 text-primary/60" />
                    <input
                      type="text"
                      placeholder="Add tags... comma separated"
                      className="bg-transparent border-none p-0 focus:ring-0 focus:outline-none text-[13px] font-medium w-full placeholder:text-muted-foreground/40"
                      value={guidedFields.stack || ""}
                      onChange={e => setGuidedFields({ ...guidedFields, stack: e.target.value })}
                      autoFocus
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-secondary/10 border-t border-border/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowTags(!showTags)}
              className={`p-2.5 rounded-full hover:bg-secondary transition-colors ${showTags ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
              title="Add Tags"
            >
              <TagIcon className="h-5 w-5" />
            </button>
          </div>

          <button
            onClick={handlePost}
            disabled={isPosting || !guidedFields.projectName?.trim()}
            className="px-8 h-10 bg-primary text-background text-[13px] font-bold rounded-full hover:opacity-90 disabled:opacity-50 disabled:grayscale transition-all flex items-center gap-2 shadow-lg shadow-primary/20 active:scale-95"
          >
            {isPosting ? "Posting..." : "Launch Project"}
            <Sparkles className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    )
  }

  if (activeTab === 'organize-event') {
    return (
      <div className="bg-background border border-border/40 rounded-sm shadow-xl shadow-black/[0.02] overflow-hidden">
        <div className="p-6 md:p-8 space-y-6">
          <div className="flex gap-4">
            <div className="h-12 w-12 rounded-full bg-secondary border border-border/10 flex items-center justify-center text-[13px] font-bold uppercase text-primary/60 overflow-hidden shrink-0">
              {user?.avatar_url ? (
                <img src={user.avatar_url || ""} alt={user.full_name || undefined} className="h-full w-full object-cover" />
              ) : (
                user?.full_name?.[0] || '?'
              )}
            </div>

            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary/60 px-2 py-0.5 bg-primary/5 rounded-sm">Host an Event</span>
              </div>

              <div className="space-y-4 animate-in fade-in duration-500">
                <input
                  type="text"
                  placeholder="Event Title (e.g. Tech Summit 2026)"
                  className="w-full bg-secondary/20 border-none px-4 py-3 rounded-sm focus:ring-1 focus:ring-primary/20 text-[16px] font-bold placeholder:text-muted-foreground/30"
                  value={guidedFields.eventTitle || ""}
                  onChange={e => setGuidedFields({ ...guidedFields, eventTitle: e.target.value })}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40 pl-1">Venue</label>
                    <input
                      type="text"
                      placeholder="e.g. TechPark Amphitheater"
                      className="w-full bg-secondary/10 border-none px-4 py-2 rounded-sm focus:ring-1 focus:ring-primary/20 text-[13px] font-medium"
                      value={guidedFields.eventVenue || ""}
                      onChange={e => setGuidedFields({ ...guidedFields, eventVenue: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40 pl-1">Date</label>
                    <input
                      type="date"
                      className="w-full bg-secondary/10 border-none px-4 py-2 rounded-sm focus:ring-1 focus:ring-primary/20 text-[13px] font-medium color-scheme-dark"
                      value={guidedFields.eventDate || ""}
                      onChange={e => setGuidedFields({ ...guidedFields, eventDate: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <textarea
                placeholder="Theme, prizes, schedule... tell everyone about it!"
                className="w-full bg-transparent border-none px-0 py-2 focus:ring-0 focus:outline-none text-[15px] md:text-[16px] font-medium placeholder:text-muted-foreground/30 min-h-[120px] resize-none leading-relaxed"
                value={guidedFields.eventDescription}
                onChange={e => setGuidedFields({ ...guidedFields, eventDescription: e.target.value })}
              />

              {guidedFields.eventPoster && (
                <div className="relative rounded-sm overflow-hidden border border-border/30 group/img bg-secondary/5">
                  <img src={guidedFields.eventPoster} alt="Poster" className="w-full object-contain max-h-[400px]" />
                  <button
                    type="button"
                    onClick={() => setGuidedFields({ ...guidedFields, eventPoster: "" })}
                    className="absolute top-3 right-3 h-8 w-8 bg-black/60 hover:bg-red-500 text-white rounded-full flex items-center justify-center transition-colors shadow-lg"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-secondary/10 border-t border-border/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageUpload}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2.5 rounded-full hover:bg-secondary transition-colors text-muted-foreground hover:text-primary disabled:opacity-50"
              title="Add Poster"
              disabled={isUploading}
            >
              <Camera className={`h-5 w-5 ${isUploading ? 'animate-pulse' : ''}`} />
            </button>
          </div>

          <button
            onClick={handlePost}
            disabled={isPosting || !guidedFields.eventTitle?.trim()}
            className="px-8 h-10 bg-primary text-background text-[13px] font-bold rounded-full hover:opacity-90 disabled:opacity-50 disabled:grayscale transition-all flex items-center gap-2 shadow-lg shadow-primary/20 active:scale-95"
          >
            {isPosting ? "Listing..." : "List Event"}
            <Sparkles className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="py-20 flex items-center justify-center text-muted-foreground/30 italic font-medium tracking-wide">
      Select a category from the sidebar to start creating
    </div>
  )
}
