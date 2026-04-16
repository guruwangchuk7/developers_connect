"use client"

import * as React from "react"
import { Sparkles, X, Camera, Tag as TagIcon, MapPin, Calendar, HelpCircle, Rocket, Briefcase } from "lucide-react"
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
  const [showTags, setShowTags] = React.useState(false)
  const updateFileInputRef = React.useRef<HTMLInputElement>(null)

  // Identify category types
  const allTabs = ['post-update', 'dev-needed', 'ask-help', 'share-project', 'organize-event']
  if (!allTabs.includes(activeTab)) return null

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0]
    if (!file || !onUploadImage) return

    setIsUploading(true)
    const url = await onUploadImage(file)
    if (url) {
      setGuidedFields({ ...guidedFields, [field]: url })
    }
    setIsUploading(false)
  }

  // Determine button text and placeholders
  const getUIConfig = () => {
    switch (activeTab) {
      case 'dev-needed': return { button: "Share Role", placeholder: "Describe the mission and success criteria...", icon: Briefcase }
      case 'ask-help': return { button: "Request Help", placeholder: "Describe where you're stuck and what you've tried...", icon: HelpCircle }
      case 'share-project': return { button: "Launch Project", placeholder: "What does it do? Why did you build it? Share the magic...", icon: Rocket }
      case 'organize-event': return { button: "List Event", placeholder: "Theme, prizes, schedule... tell everyone about it!", icon: Calendar }
      default: return { button: "Post", placeholder: "Share your thoughts...", icon: Sparkles }
    }
  }

  const ui = getUIConfig()
  const imagePreview = activeTab === 'post-update' ? guidedFields.updateImage : guidedFields.eventPoster

  return (
    <div className="bg-background border border-border/40 rounded-sm shadow-xl shadow-black/[0.02] overflow-hidden">
      <div className="p-6 md:p-8 space-y-6">
        <div className="flex gap-4">
          {/* Avatar Section */}
          <div className="h-12 w-12 rounded-full bg-secondary border border-border/10 flex items-center justify-center text-[13px] font-bold uppercase text-primary/60 overflow-hidden shrink-0">
            {user?.avatar_url ? (
              <img src={user.avatar_url || ""} alt={user.full_name || undefined} className="h-full w-full object-cover" />
            ) : (
              user?.full_name?.[0] || '?'
            )}
          </div>

          <div className="flex-1 space-y-4">
            {/* Dynamic Metadata Fields (Similar to dev-needed) */}
            {(activeTab === 'dev-needed' || activeTab === 'ask-help' || activeTab === 'share-project' || activeTab === 'organize-event') && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-500">
                {activeTab === 'dev-needed' && (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40 pl-1">Role Needed</label>
                      <input type="text" placeholder="e.g. Rust Developer" className="w-full bg-secondary/20 border-none px-4 py-2 rounded-sm focus:ring-1 focus:ring-primary/20 text-[14px] font-medium" value={guidedFields.role || ""} onChange={e => setGuidedFields({ ...guidedFields, role: e.target.value })} />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40 pl-1">Project Name</label>
                      <input type="text" placeholder="e.g. DrukRide MVP" className="w-full bg-secondary/20 border-none px-4 py-2 rounded-sm focus:ring-1 focus:ring-primary/20 text-[14px] font-medium" value={guidedFields.project || ""} onChange={e => setGuidedFields({ ...guidedFields, project: e.target.value })} />
                    </div>
                  </>
                )}
                {activeTab === 'ask-help' && (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40 pl-1">The Blocker</label>
                      <input type="text" placeholder="e.g. Supabase Auth Error" className="w-full bg-secondary/20 border-none px-4 py-2 rounded-sm focus:ring-1 focus:ring-primary/20 text-[14px] font-medium" value={guidedFields.blocker || ""} onChange={e => setGuidedFields({ ...guidedFields, blocker: e.target.value })} />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40 pl-1">Tech Stack</label>
                      <input type="text" placeholder="e.g. Next.js, FastAPI" className="w-full bg-secondary/20 border-none px-4 py-2 rounded-sm focus:ring-1 focus:ring-primary/20 text-[14px] font-medium" value={guidedFields.stack || ""} onChange={e => setGuidedFields({ ...guidedFields, stack: e.target.value })} />
                    </div>
                  </>
                )}
                {activeTab === 'share-project' && (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40 pl-1">Project Name</label>
                      <input type="text" placeholder="e.g. OpenBhutan Maps" className="w-full bg-secondary/20 border-none px-4 py-2 rounded-sm focus:ring-1 focus:ring-primary/20 text-[14px] font-medium" value={guidedFields.projectName || ""} onChange={e => setGuidedFields({ ...guidedFields, projectName: e.target.value })} />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40 pl-1">Public Link</label>
                      <input type="text" placeholder="github.com/..." className="w-full bg-secondary/20 border-none px-4 py-2 rounded-sm focus:ring-1 focus:ring-primary/20 text-[14px] font-medium" value={guidedFields.link || ""} onChange={e => setGuidedFields({ ...guidedFields, link: e.target.value })} />
                    </div>
                  </>
                )}
                {activeTab === 'organize-event' && (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40 pl-1">Event Title</label>
                      <input type="text" placeholder="e.g. Tech Summit 2026" className="w-full bg-secondary/20 border-none px-4 py-2 rounded-sm focus:ring-1 focus:ring-primary/20 text-[14px] font-medium" value={guidedFields.eventTitle || ""} onChange={e => setGuidedFields({ ...guidedFields, eventTitle: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                       <div className="space-y-1.5">
                         <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40 pl-1">Venue</label>
                         <input type="text" placeholder="Venue" className="w-full bg-secondary/20 border-none px-4 py-2 rounded-sm focus:ring-1 focus:ring-primary/20 text-[14px] font-medium" value={guidedFields.eventVenue || ""} onChange={e => setGuidedFields({ ...guidedFields, eventVenue: e.target.value })} />
                       </div>
                       <div className="space-y-1.5">
                         <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40 pl-1">Date</label>
                         <input type="date" className="w-full bg-secondary/20 border-none px-4 py-2 rounded-sm focus:ring-1 focus:ring-primary/20 text-[14px] font-medium color-scheme-dark" value={guidedFields.eventDate || ""} onChange={e => setGuidedFields({ ...guidedFields, eventDate: e.target.value })} />
                       </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Main Textarea */}
            <textarea
              placeholder={ui.placeholder}
              className="w-full bg-transparent border-none px-0 py-2 focus:ring-0 focus:outline-none text-[15px] md:text-[16px] font-medium placeholder:text-muted-foreground/30 min-h-[120px] resize-none leading-relaxed"
              value={activeTab === 'dev-needed' ? guidedFields.mission : activeTab === 'ask-help' ? guidedFields.context : activeTab === 'share-project' ? guidedFields.description : activeTab === 'organize-event' ? guidedFields.eventDescription : guidedFields.blocker}
              onChange={e => setGuidedFields({ 
                ...guidedFields, 
                [activeTab === 'dev-needed' ? 'mission' : activeTab === 'ask-help' ? 'context' : activeTab === 'share-project' ? 'description' : activeTab === 'organize-event' ? 'eventDescription' : 'blocker']: e.target.value 
              })}
            />

            {/* Image Preview */}
            {imagePreview && (
              <div className="relative rounded-sm overflow-hidden border border-border/30 group/img bg-secondary/5">
                <img src={imagePreview} alt="Upload preview" className="w-full object-contain max-h-[400px]" />
                <button
                  type="button"
                  onClick={() => setGuidedFields({ ...guidedFields, [activeTab === 'post-update' ? 'updateImage' : 'eventPoster']: "" })}
                  className="absolute top-3 right-3 h-8 w-8 bg-black/60 hover:bg-red-500 text-white rounded-full flex items-center justify-center transition-colors shadow-lg"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Tags Input */}
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

      {/* Footer / Toolbar */}
      <div className="px-6 py-4 bg-secondary/10 border-t border-border/10 flex items-center justify-between">
        <div className="flex items-center gap-1">
          {(activeTab === 'post-update' || activeTab === 'organize-event') && (
            <>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={updateFileInputRef}
                onChange={async (e) => handleImageUpload(e, activeTab === 'post-update' ? 'updateImage' : 'eventPoster')}
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
          disabled={isPosting || (
            activeTab === 'post-update' ? !guidedFields.blocker?.trim() :
            activeTab === 'dev-needed' ? !guidedFields.role?.trim() :
            activeTab === 'ask-help' ? !guidedFields.blocker?.trim() :
            activeTab === 'share-project' ? !guidedFields.projectName?.trim() :
            activeTab === 'organize-event' ? !guidedFields.eventTitle?.trim() : false
          )}
          className="px-8 h-10 bg-primary text-background text-[13px] font-bold rounded-full hover:opacity-90 disabled:opacity-50 disabled:grayscale transition-all flex items-center gap-2 shadow-lg shadow-primary/20 active:scale-95"
        >
          {isPosting ? "Posting..." : ui.button}
          <Sparkles className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}
