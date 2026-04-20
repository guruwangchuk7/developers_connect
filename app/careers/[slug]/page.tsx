"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { GlobalHeader } from "@/components/common/global-header"
import { GlobalFooter } from "@/components/common/global-footer"
import { ArrowLeft, ArrowRight, Palette, Terminal, Shield, BarChart3, CheckCircle2, MapPin, Clock, Briefcase, ChevronRight, Loader2, UploadCloud, FileText } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

// Full role data with detailed descriptions
const rolesData: Record<string, any> = {
  "frontend-designer": {
    title: "Frontend Designer",
    icon: <Palette className="h-6 w-6" />,
    shortDescription: "Craft pixel-perfect, high-fidelity user experiences and interactive interfaces for the next generation of our platform.",
    tags: ["React", "Tailwind", "Figma", "UI/UX"],
    availability: "1 Open Slot",
    location: "Remote / Bhutan",
    type: "Contract / Full-time",
    about: [
      "We are looking for a talented Frontend Designer to join our team and help shape the visual identity and user experience of the Bhutan Developer Network platform.",
      "You will work closely with our engineering team to translate design concepts into responsive, accessible, and performant interfaces. Your work will directly impact how thousands of developers interact with the platform."
    ],
    responsibilities: [
      "Design and implement responsive UI components using React and Tailwind CSS",
      "Create high-fidelity mockups and prototypes in Figma",
      "Collaborate with backend engineers to ensure seamless data integration",
      "Conduct user research and usability testing to inform design decisions",
      "Maintain and evolve the platform's design system",
      "Optimize interfaces for performance and accessibility standards"
    ],
    requirements: [
      "3+ years of experience in frontend development and UI/UX design",
      "Strong proficiency in React, TypeScript, and modern CSS",
      "Expert-level Figma skills with a portfolio showcasing web applications",
      "Understanding of responsive design principles and mobile-first approaches",
      "Experience with design systems and component libraries",
      "Excellent communication skills and ability to work in a collaborative environment"
    ],
    niceToHave: [
      "Experience with Next.js and server-side rendering",
      "Knowledge of motion design and micro-animations (Framer Motion)",
      "Familiarity with design tokens and theming systems",
      "Contributions to open-source design projects"
    ]
  },
  "backend-developer": {
    title: "Backend Developer",
    icon: <Terminal className="h-6 w-6" />,
    shortDescription: "Architect scalable server-side systems, manage database synchronization protocols, and optimize high-performance APIs.",
    tags: ["Node.js", "PostgreSQL", "Edge Functions", "Security"],
    availability: "1 Open Slot",
    location: "Remote / Bhutan",
    type: "Contract / Full-time",
    about: [
      "We're seeking a Backend Developer to build and maintain the core infrastructure powering the Bhutan Developer Network.",
      "You'll be responsible for designing APIs, managing database schemas, and ensuring our platform can scale to serve the growing developer community across Bhutan."
    ],
    responsibilities: [
      "Design and implement RESTful and real-time APIs using Node.js",
      "Manage and optimize PostgreSQL database schemas and queries",
      "Build and maintain Supabase Edge Functions for serverless operations",
      "Implement authentication, authorization, and security protocols",
      "Set up monitoring, logging, and alerting systems",
      "Write comprehensive tests and maintain CI/CD pipelines"
    ],
    requirements: [
      "3+ years of backend development experience with Node.js",
      "Strong knowledge of PostgreSQL and database design principles",
      "Experience with Supabase or similar BaaS platforms",
      "Understanding of RESTful API design and real-time communication (WebSockets)",
      "Proficiency in TypeScript",
      "Experience with cloud deployment and DevOps practices"
    ],
    niceToHave: [
      "Experience with blockchain technology and smart contracts",
      "Knowledge of message queues and event-driven architectures",
      "Familiarity with Deno and edge computing",
      "Experience with data migration and ETL processes"
    ]
  },
  "security-engineer": {
    title: "Security Engineer",
    icon: <Shield className="h-6 w-6" />,
    shortDescription: "Harden our technical node ecosystem, implement advanced encryption protocols, and ensure absolute data integrity.",
    tags: ["Cybersecurity", "Protocols", "Authentication", "Auditing"],
    availability: "1 Open Slot",
    location: "Remote / Bhutan",
    type: "Contract / Full-time",
    about: [
      "As our Security Engineer, you will be the guardian of our platform's integrity and the protector of our developer community's data.",
      "You'll implement security best practices, conduct vulnerability assessments, and ensure our platform meets the highest standards of data protection and compliance."
    ],
    responsibilities: [
      "Conduct regular security audits and penetration testing",
      "Implement and maintain authentication and authorization systems",
      "Design and enforce security policies for data handling and storage",
      "Monitor for and respond to security incidents and threats",
      "Review code for security vulnerabilities and recommend fixes",
      "Implement encryption protocols for data at rest and in transit"
    ],
    requirements: [
      "3+ years of experience in cybersecurity or security engineering",
      "Strong knowledge of web application security (OWASP Top 10)",
      "Experience with authentication systems (OAuth 2.0, JWT, SSO)",
      "Proficiency in security auditing tools and methodologies",
      "Understanding of encryption standards and certificate management",
      "Experience with compliance frameworks (SOC 2, GDPR)"
    ],
    niceToHave: [
      "Blockchain security and smart contract auditing experience",
      "Bug bounty participation or CTF competition experience",
      "Security certifications (CISSP, CEH, OSCP)",
      "Experience securing cloud-native applications"
    ]
  },
  "business-analyst": {
    title: "Business Analyst",
    icon: <BarChart3 className="h-6 w-6" />,
    shortDescription: "Translate complex system metrics into actionable technical roadmaps and bridge the gap between engineering and growth.",
    tags: ["Strategy", "Data Analysis", "Roadmapping", "Tech Specs"],
    availability: "1 Open Slot",
    location: "Remote / Bhutan",
    type: "Contract / Full-time",
    about: [
      "We're looking for a Business Analyst who can bridge the gap between our technical capabilities and strategic goals.",
      "You'll analyze platform data, identify growth opportunities, and help shape the product roadmap that will guide the development of the Bhutan Developer Network."
    ],
    responsibilities: [
      "Analyze platform metrics and user behavior to identify trends and opportunities",
      "Create detailed technical specifications and product requirement documents",
      "Develop and maintain the product roadmap in collaboration with engineering",
      "Conduct market research on the Bhutanese tech ecosystem",
      "Facilitate stakeholder meetings and translate business needs into technical requirements",
      "Track and report on key performance indicators (KPIs)"
    ],
    requirements: [
      "3+ years of experience in business analysis or product management",
      "Strong analytical skills with experience in data visualization tools",
      "Ability to write clear technical specifications and documentation",
      "Understanding of software development lifecycle and agile methodologies",
      "Excellent communication and presentation skills",
      "Experience working with cross-functional engineering teams"
    ],
    niceToHave: [
      "Experience with the Bhutanese tech or startup ecosystem",
      "Technical background or understanding of web technologies",
      "Experience with analytics platforms (Mixpanel, Amplitude, etc.)",
      "MBA or related advanced degree"
    ]
  }
}

export default function CareerDetailPage({ params }: { params: any }) {
  const { slug } = React.use(params) as { slug: string }
  const router = useRouter()
  const role = rolesData[slug]

  const [showForm, setShowForm] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isSuccess, setIsSuccess] = React.useState(false)
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    portfolio: "",
    motivation: ""
  })
  const [cvFile, setCvFile] = React.useState<File | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  if (!role) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-4">
        <p className="text-muted-foreground font-medium">Role not found.</p>
        <Link href="/careers" className="text-sm font-bold text-primary underline underline-offset-4">
          Back to Careers
        </Link>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate submission delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setIsSuccess(true)
    toast.success("Application submitted successfully!")
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <GlobalHeader />
        <main className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
            <div className="h-20 w-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
              <CheckCircle2 className="h-10 w-10 text-emerald-500" />
            </div>
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter">Application Submitted!</h1>
              <p className="text-muted-foreground leading-relaxed">
                Thank you for applying for the <span className="text-foreground font-semibold">{role.title}</span> position. We'll review your application and get back to you soon.
              </p>
            </div>
            <button 
              onClick={() => router.push("/careers")}
              className="px-8 py-3 bg-primary text-background text-[11px] font-bold uppercase tracking-[0.2em] rounded-sm hover:opacity-90 transition-all shadow-xl shadow-primary/20"
            >
              Back to Careers
            </button>
          </div>
        </main>
        <GlobalFooter />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-primary/5 font-sans">
      <GlobalHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative">
          <div className="h-[200px] md:h-[280px] w-full bg-gradient-to-br from-primary/5 via-secondary/20 to-background" />

          {/* Back Button */}
          <div className="absolute top-6 left-6">
            <button
              onClick={() => router.push('/careers')}
              className="flex items-center gap-2 px-4 py-2 bg-background/80 backdrop-blur-md border border-border/40 rounded-full text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> All Careers
            </button>
          </div>
        </section>

        {/* Content */}
        <section className="relative -mt-24 md:-mt-32 pb-24">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="bg-background border border-border/40 rounded-sm p-8 md:p-12 space-y-8 shadow-xl shadow-black/[0.03]">
              
              {/* Badge Row */}
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60 px-3 py-1 bg-primary/5 border border-primary/10 rounded-full">
                  Career
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border bg-emerald-50 text-emerald-700 border-emerald-100">
                  {role.availability}
                </span>
              </div>

              {/* Title */}
              <div className="flex items-center gap-5">
                <div className="h-14 w-14 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary shrink-0">
                  {role.icon}
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter leading-[1.1]">
                  {role.title}
                </h1>
              </div>

              {/* Meta Info */}
              <div className="flex flex-wrap gap-6 md:gap-10 pt-2">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-secondary rounded-full flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-primary/60" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">Location</p>
                    <p className="text-sm font-semibold">{role.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-secondary rounded-full flex items-center justify-center">
                    <Briefcase className="h-5 w-5 text-primary/60" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">Type</p>
                    <p className="text-sm font-semibold">{role.type}</p>
                  </div>
                </div>
              </div>

              {/* Skills Tags */}
              <div className="flex flex-wrap gap-2">
                {role.tags.map((tag: string) => (
                  <span key={tag} className="px-3 py-1.5 bg-secondary/50 rounded-md text-[10px] font-bold text-muted-foreground/80 uppercase tracking-widest border border-border/40">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Divider */}
              <div className="border-t border-border/30" />

              {/* About */}
              <div className="space-y-6">
                <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">About This Role</h2>
                <div className="space-y-4">
                  {role.about.map((p: string, idx: number) => (
                    <p key={idx} className="text-[15px] text-foreground/80 leading-relaxed">{p}</p>
                  ))}
                </div>
              </div>

              {/* Responsibilities */}
              <div className="border-t border-border/30" />
              <div className="space-y-6">
                <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">Responsibilities</h2>
                <ul className="space-y-3">
                  {role.responsibilities.map((r: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3 text-[15px] text-foreground/80 leading-relaxed">
                      <CheckCircle2 className="h-4 w-4 text-primary/40 mt-1 shrink-0" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Requirements */}
              <div className="border-t border-border/30" />
              <div className="space-y-6">
                <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">Requirements</h2>
                <ul className="space-y-3">
                  {role.requirements.map((r: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3 text-[15px] text-foreground/80 leading-relaxed">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-2 shrink-0" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Nice to Have */}
              <div className="border-t border-border/30" />
              <div className="space-y-6">
                <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">Nice to Have</h2>
                <ul className="space-y-3">
                  {role.niceToHave.map((r: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3 text-[15px] text-foreground/60 leading-relaxed">
                      <div className="w-1.5 h-1.5 rounded-full bg-border mt-2 shrink-0" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Apply CTA */}
              <div className="border-t border-border/30" />
              
              {!showForm ? (
                <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                  <button
                    onClick={() => setShowForm(true)}
                    className="inline-flex items-center justify-center gap-3 px-10 py-4 bg-primary text-background text-[11px] font-bold uppercase tracking-[0.2em] rounded-sm hover:opacity-90 transition-all shadow-xl shadow-primary/10 active:scale-95"
                  >
                    Submit Application <ArrowRight className="h-4 w-4" />
                  </button>
                  <Link
                    href="/careers"
                    className="inline-flex items-center gap-2 px-4 py-2 border border-border/60 text-[10px] font-bold uppercase tracking-widest rounded-sm hover:bg-secondary/20 transition-colors"
                  >
                    <ArrowLeft className="h-3 w-3" /> Back
                  </Link>
                </div>
              ) : (
                /* Application Form */
                <form onSubmit={handleSubmit} className="space-y-8 pt-2">
                  <h2 className="text-xl font-bold tracking-tight">Apply for {role.title}</h2>

                  <div className="space-y-4">
                    <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
                      <span className="w-1 h-1 bg-primary rounded-full" /> Full Name
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="Your full name"
                      className="w-full bg-secondary/20 border border-border/50 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
                      <span className="w-1 h-1 bg-primary rounded-full" /> Email Address
                    </label>
                    <input
                      required
                      type="email"
                      placeholder="you@example.com"
                      className="w-full bg-secondary/20 border border-border/50 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
                      <span className="w-1 h-1 bg-primary rounded-full" /> Portfolio / GitHub
                    </label>
                    <input
                      type="url"
                      placeholder="https://github.com/yourhandle"
                      className="w-full bg-secondary/20 border border-border/50 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all"
                      value={formData.portfolio}
                      onChange={e => setFormData({ ...formData, portfolio: e.target.value })}
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
                      <span className="w-1 h-1 bg-primary rounded-full" /> Why do you want this role?
                    </label>
                    <textarea
                      required
                      placeholder="Tell us why you're passionate about this opportunity..."
                      className="w-full bg-secondary/20 border border-border/50 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all min-h-[120px] resize-none"
                      value={formData.motivation}
                      onChange={e => setFormData({ ...formData, motivation: e.target.value })}
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
                      <span className="w-1 h-1 bg-primary rounded-full" /> Upload CV
                    </label>
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className={cn(
                        "border-2 border-dashed rounded-xl p-8 text-center space-y-3 cursor-pointer transition-all",
                        cvFile ? "border-emerald-500/30 bg-emerald-500/5" : "border-border/60 hover:border-primary/20 bg-secondary/10"
                      )}
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept=".pdf,.doc,.docx"
                        onChange={e => setCvFile(e.target.files?.[0] || null)}
                      />
                      {cvFile ? (
                        <div className="space-y-2">
                          <div className="h-10 w-10 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto">
                            <FileText className="h-5 w-5 text-emerald-600" />
                          </div>
                          <p className="text-xs font-bold text-emerald-600">{cvFile.name}</p>
                          <p className="text-[10px] text-emerald-600/60 uppercase">Ready to submit</p>
                        </div>
                      ) : (
                        <>
                          <div className="h-10 w-10 bg-secondary rounded-full flex items-center justify-center mx-auto text-muted-foreground/40">
                            <UploadCloud className="h-5 w-5" />
                          </div>
                          <p className="text-xs font-bold text-primary">Click to upload CV</p>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-widest">PDF, DOC (max 5MB)</p>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center justify-center gap-3 px-10 py-4 bg-primary text-background text-[11px] font-bold uppercase tracking-[0.2em] rounded-sm hover:opacity-90 transition-all shadow-xl shadow-primary/10 disabled:opacity-50 active:scale-95"
                    >
                      {isSubmitting ? (
                        <><Loader2 className="h-4 w-4 animate-spin" /> Submitting...</>
                      ) : (
                        <>Submit Application <ChevronRight className="h-4 w-4" /></>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="inline-flex items-center gap-2 px-4 py-2 border border-border/60 text-[10px] font-bold uppercase tracking-widest rounded-sm hover:bg-secondary/20 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>
      <GlobalFooter />
    </div>
  )
}
