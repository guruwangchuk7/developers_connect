import { GlobalHeader } from "@/components/common/global-header";
import { GlobalFooter } from "@/components/common/global-footer";
import { Metadata } from "next";
import { Mail, MessageSquare, MapPin, Phone, Send } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us | Bhutan Developer Network",
  description: "Get in touch with the Bhutan Developer Network team for support, partnerships, or inquiries.",
};

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-primary/5">
      <GlobalHeader />
      <main className="flex-1">
        <section className="py-16 md:py-24 lg:py-32">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24">
                <div className="space-y-12">
                  <div className="space-y-6">
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tighter">
                      Get in Touch
                    </h1>
                    <p className="text-muted-foreground text-sm font-medium leading-relaxed md:text-lg max-w-md">
                      Whether you have a technical question, a partnership proposal, or just want to say hi, our team is ready to connect.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <ContactMethod 
                      icon={<Mail className="h-5 w-5" />}
                      title="General Inquiries"
                      value="team@devconnect.bt"
                      link="mailto:team@devconnect.bt"
                    />
                    <ContactMethod 
                      icon={<MessageSquare className="h-5 w-5" />}
                      title="Technical Support"
                      value="support@devconnect.bt"
                      link="mailto:support@devconnect.bt"
                    />
                    <ContactMethod 
                      icon={<MapPin className="h-5 w-5" />}
                      title="Visit Us"
                      value="Thimphu TechPark, Bhutan"
                    />
                    <ContactMethod 
                      icon={<Phone className="h-5 w-5" />}
                      title="Call Us"
                      value="+975-17XXXXXX"
                      link="tel:+97517XXXXXX"
                    />
                  </div>
                </div>

                <div className="bg-secondary/10 p-8 md:p-12 rounded-sm border border-border">
                  <form className="space-y-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Full Name</label>
                      <input 
                        type="text" 
                        placeholder="Ugyen Dorji"
                        className="w-full bg-transparent border-b border-border/80 py-3 focus:outline-none focus:border-primary transition-colors text-sm font-medium tracking-tight"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Email Address</label>
                      <input 
                        type="email" 
                        placeholder="ugyen@example.bt"
                        className="w-full bg-transparent border-b border-border/80 py-3 focus:outline-none focus:border-primary transition-colors text-sm font-medium tracking-tight"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Subject</label>
                      <select 
                        className="w-full bg-transparent border-b border-border/80 py-3 focus:outline-none focus:border-primary transition-colors text-sm font-medium tracking-tight appearance-none cursor-pointer"
                      >
                        <option>General Inquiry</option>
                        <option>Partnership Request</option>
                        <option>Technical Issue</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Message</label>
                      <textarea 
                        rows={4}
                        placeholder="How can we help you today?"
                        className="w-full bg-transparent border-b border-border/80 py-3 focus:outline-none focus:border-primary transition-colors text-sm font-medium tracking-tight resize-none"
                    ></textarea>
                    </div>
                    <button 
                      type="submit"
                      disabled
                      className="w-full h-14 bg-primary text-primary-foreground font-bold rounded-sm uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-3 hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      Send Message <Send className="h-4 w-4" />
                    </button>
                    <p className="text-[10px] text-muted-foreground/60 text-center uppercase tracking-widest">
                       Submissions are currently in preview mode.
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <GlobalFooter />
    </div>
  );
}

function ContactMethod({ icon, title, value, link }: { 
  icon: React.ReactNode, 
  title: string, 
  value: string,
  link?: string
}) {
  const content = (
    <div className="space-y-3 p-6 rounded-sm border border-border/50 hover:bg-secondary/20 transition-all group">
      <div className="h-10 w-10 bg-secondary/50 rounded-sm flex items-center justify-center border border-border/20 group-hover:scale-110 transition-transform">
        <div className="text-primary/70">{icon}</div>
      </div>
      <div className="space-y-1">
        <h3 className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground/60">{title}</h3>
        <p className="text-[13px] font-normal tracking-tight text-foreground/80 leading-relaxed">{value}</p>
      </div>
    </div>
  );

  return link ? (
    <a href={link} className="block transition-transform hover:-translate-y-1">
      {content}
    </a>
  ) : (
    <div className="transition-transform hover:-translate-y-1">{content}</div>
  );
}
