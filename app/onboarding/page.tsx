"use client"

import * as React from "react"
import { createClient } from "@/lib/supabase"
import { buttonVariants } from "@/components/ui/button-variants"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { User, Briefcase, Rocket, Plus, X, Code2, Layout, Database, Smartphone, Palette, LineChart, Cpu, ClipboardList, GraduationCap, Lightbulb, PencilLine, PlusCircle } from "lucide-react"

const PREDEFINED_ROLES = [
  { name: "Frontend Developer", icon: Layout },
  { name: "Backend Developer", icon: Database },
  { name: "Fullstack Developer", icon: Code2 },
  { name: "Mobile Developer", icon: Smartphone },
  { name: "UI/UX Designer", icon: Palette },
  { name: "Data Scientist", icon: LineChart },
  { name: "DevOps Engineer", icon: Cpu },
  { name: "Project Manager", icon: ClipboardList },
  { name: "Student / Learner", icon: GraduationCap },
  { name: "Founder / Entrepreneur", icon: Lightbulb },
  { name: "Other", icon: PencilLine }
]

const PREDEFINED_SKILLS = [
  "React", "Next.js", "TypeScript", "Python", "Node.js", 
  "AutoCAD", "UI/UX Design", "AWS", "Java", "SQL"
]

export default function OnboardingPage() {
  const supabase = createClient()
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)
  const [selectedRole, setSelectedRole] = React.useState("")
  const [customRole, setCustomRole] = React.useState("")
  const [selectedSkills, setSelectedSkills] = React.useState<string[]>([])
  const [customSkill, setCustomSkill] = React.useState("")
  const [fullName, setFullName] = React.useState("")
  const [showOtherSkills, setShowOtherSkills] = React.useState(false)
  const [showOtherRole, setShowOtherRole] = React.useState(false)

  React.useEffect(() => {
    async function getInitialData() {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user?.user_metadata?.full_name) {
        setFullName(session.user.user_metadata.full_name)
      }
    }
    getInitialData()
  }, [supabase])

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    )
  }

  const handleRoleSelect = (roleName: string) => {
    setSelectedRole(roleName)
    if (roleName !== "Other") {
      setShowOtherRole(false)
      setCustomRole("")
    } else {
      setShowOtherRole(true)
    }
  }

  const addCustomSkill = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && customSkill.trim()) {
      e.preventDefault()
      if (!selectedSkills.includes(customSkill.trim())) {
        setSelectedSkills([...selectedSkills, customSkill.trim()])
      }
      setCustomSkill("")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error("No session found")

      const finalRole = selectedRole === "Other" ? customRole : selectedRole
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: session.user.id,
          full_name: fullName,
          role: finalRole,
          skills: selectedSkills,
          updated_at: new Date().toISOString()
        })

      if (error) throw error
      router.push('/dashboard')
    } catch (error) {
      console.error('Error during onboarding:', error)
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-background py-16 px-4 md:py-24">
      <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[10px] border-b-primary mb-8"></div>
      
      <div className="w-full max-w-4xl space-y-16">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-semibold tracking-tighter sm:text-5xl">Quick Access Setup</h1>
          <p className="text-sm text-muted-foreground font-medium uppercase tracking-[0.2em]">
            Step 2: Build your basic identity
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-20">
          <div className="space-y-16">
             {/* 1. Full Name */}
             <div className="max-w-md mx-auto space-y-4 text-center border-b border-border/40 pb-12">
               <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground flex items-center justify-center gap-2">
                 <User className="h-3.5 w-3.5" /> Confirm your name
               </label>
               <input
                 required
                 type="text"
                 placeholder="FullName"
                 className="w-full bg-transparent text-center border-b border-border/80 py-4 focus:outline-none focus:border-primary transition-all text-xl font-medium tracking-tight"
                 value={fullName}
                 onChange={e => setFullName(e.target.value)}
               />
             </div>

             {/* 2. Role Identity (Elevated like Skillset) */}
             <div className="space-y-8">
                <div className="space-y-2 text-center">
                  <h2 className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground flex items-center justify-center gap-2">
                    <Briefcase className="h-3.5 w-3.5" /> What is your role?
                  </h2>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                   {PREDEFINED_ROLES.map((role) => {
                     const Icon = role.icon
                     const isSelected = selectedRole === role.name
                     return (
                       <button
                         key={role.name}
                         type="button"
                         onClick={() => handleRoleSelect(role.name)}
                         className={cn(
                           "flex flex-col items-center justify-center gap-3 p-5 border rounded-sm transition-all duration-300 group aspect-square",
                           isSelected 
                             ? "bg-primary border-primary shadow-xl shadow-primary/10" 
                             : "bg-background border-border/60 hover:border-primary/40 hover:bg-secondary/20"
                         )}
                       >
                         <Icon className={cn(
                           "h-6 w-6 transition-transform duration-300 group-hover:scale-110",
                           isSelected ? "text-background" : "text-primary/60"
                         )} />
                         <span className={cn(
                           "text-[9px] font-bold uppercase tracking-wider text-center",
                           isSelected ? "text-background" : "text-muted-foreground"
                         )}>
                           {role.name}
                         </span>
                       </button>
                     )
                   })}
                </div>

                {showOtherRole && (
                  <div className="max-w-md mx-auto pt-6 animate-in fade-in slide-in-from-top-2">
                    <div className="relative group">
                      <Plus className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        required
                        type="text"
                        placeholder="Type your unique role and press Enter..."
                        className="w-full bg-transparent border-b border-border/80 pl-8 py-3 focus:outline-none focus:border-primary transition-all text-sm font-medium tracking-tight"
                        value={customRole}
                        onChange={e => setCustomRole(e.target.value)}
                      />
                    </div>
                  </div>
                )}
             </div>

             {/* 3. Skillset */}
             <div className="space-y-8 border-t border-border/40 pt-16">
                <div className="space-y-2 text-center">
                  <h2 className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground flex items-center justify-center gap-2">
                    <Rocket className="h-3.5 w-3.5" /> Skillset
                  </h2>
                  <p className="text-xs text-muted-foreground font-medium">Select a few core competencies to begin.</p>
                </div>
                
                <div className="flex flex-wrap justify-center gap-2.5">
                  {PREDEFINED_SKILLS.map(skill => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={cn(
                        "px-6 py-3 text-[11px] font-bold uppercase tracking-widest transition-all rounded-sm border",
                        selectedSkills.includes(skill) 
                          ? "bg-primary text-background border-primary" 
                          : "bg-background text-muted-foreground border-border/80 hover:border-primary/40"
                      )}
                    >
                      {skill}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setShowOtherSkills(!showOtherSkills)}
                    className={cn(
                      "px-6 py-3 text-[11px] font-bold uppercase tracking-widest transition-all rounded-sm border flex items-center gap-2",
                      showOtherSkills 
                        ? "bg-primary text-background border-primary" 
                        : "bg-background text-muted-foreground border-border/80 hover:border-primary/40"
                    )}
                  >
                    Other <PlusCircle className="h-3 w-3" />
                  </button>
                </div>

                {showOtherSkills && (
                  <div className="max-w-md mx-auto pt-6 animate-in fade-in slide-in-from-top-2">
                    <div className="relative group">
                      <Plus className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Type other skill and press Enter..."
                        className="w-full bg-transparent border-b border-border/80 pl-8 py-3 focus:outline-none focus:border-primary transition-all text-sm font-medium tracking-tight"
                        value={customSkill}
                        onChange={e => setCustomSkill(e.target.value)}
                        onKeyDown={addCustomSkill}
                      />
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4 justify-center">
                      {selectedSkills.filter(s => !PREDEFINED_SKILLS.includes(s)).map(s => (
                         <span key={s} className="px-3 py-1.5 bg-secondary text-primary font-bold text-[10px] uppercase tracking-widest rounded-sm flex items-center gap-2">
                            {s}
                            <button onClick={() => toggleSkill(s)}><X className="h-2.5 w-2.5" /></button>
                         </span>
                      ))}
                    </div>
                  </div>
                )}
             </div>
          </div>

          <div className="pt-12 text-center">
            <button
              type="submit"
              disabled={isLoading || !selectedRole || (selectedRole === "Other" && !customRole) || selectedSkills.length === 0}
              className={cn(
                buttonVariants({ size: "lg" }),
                "min-w-64 h-16 rounded-sm bg-primary text-background font-bold tracking-[0.1em] uppercase shadow-2xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-30"
              )}
            >
              {isLoading ? "Synchronizing..." : "Complete Identity Setup"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
