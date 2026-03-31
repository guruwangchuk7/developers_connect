import { GlobalHeader } from "@/components/common/global-header";
import { GlobalFooter } from "@/components/common/global-footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Bhutan Developer Network",
  description: "About the mission and vision of the Bhutan Developer Network.",
};

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-primary/5">
      <GlobalHeader />
      <main className="flex-1">
        <section className="py-16 md:py-24 lg:py-32">
          <div className="container max-w-3xl mx-auto px-4">
            <div className="space-y-4 mb-12 md:mb-16">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter">
                About the Network
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed font-medium">
                Professionalizing the Bhutanese tech ecosystem through identity, collaboration, and community-driven engineering.
              </p>
            </div>

            <div className="space-y-12">
              <section className="group">
                <h2 className="text-xl md:text-2xl font-bold tracking-tight border-b pb-3 mb-4 group-hover:border-primary/20 transition-colors">Our Mission</h2>
                <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                  The Bhutan Developer Network (BDN) was founded with a singular purpose: to create a centralized, professional infrastructure for Bhutan's growing tech community. We believe that by building a strong identity layer and enabling seamless collaboration, we can accelerate the growth of our national digital economy.
                </p>
              </section>

              <section className="group">
                <h2 className="text-xl md:text-2xl font-bold tracking-tight border-b pb-3 mb-4 group-hover:border-primary/20 transition-colors">What We Solve</h2>
                <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                  In a rapidly evolving landscape, individual developers often lack a clear way to demonstrate their verified skills and technical reputation. BDN provides a platform where your work speaks for itself, and where finding the right technical partner or help is just a few clicks away.
                </p>
              </section>

              <section className="group">
                <h2 className="text-xl md:text-2xl font-bold tracking-tight border-b pb-3 mb-4 group-hover:border-primary/20 transition-colors">Community Driven</h2>
                <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                  BDN is built by developers, for developers. Whether you are a student, a freelancer, or a lead engineer at a major firm, this network is your home for collaboration, knowledge sharing, and professional growth.
                </p>
              </section>

              <section className="group">
                <h2 className="text-xl md:text-2xl font-bold tracking-tight border-b pb-3 mb-4 group-hover:border-primary/20 transition-colors">Contact Our Team</h2>
                <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                  Have questions or want to get involved? Reach out to us at <a href="mailto:team@devconnect.bt" className="text-primary font-medium hover:underline">team@devconnect.bt</a>. We'd love to hear from you.
                </p>
              </section>
            </div>
          </div>
        </section>
      </main>
      <GlobalFooter />
    </div>
  );
}
