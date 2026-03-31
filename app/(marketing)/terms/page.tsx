import { GlobalHeader } from "@/components/common/global-header";
import { GlobalFooter } from "@/components/common/global-footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Bhutan Developer Network",
  description: "Terms and conditions for using the Bhutan Developer Network platform.",
};

export default function TermsPage() {
  const lastUpdated = "March 31, 2026";

  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-primary/5">
      <GlobalHeader />
      <main className="flex-1">
        <section className="py-16 md:py-24 lg:py-32">
          <div className="container max-w-3xl mx-auto px-4">
            <div className="space-y-4 mb-12 md:mb-16">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter">
                Terms of Service
              </h1>
              <p className="text-muted-foreground text-sm font-medium">
                Last Updated: {lastUpdated}
              </p>
            </div>

            <div className="space-y-12">
              <section className="group">
                <h2 className="text-xl md:text-2xl font-bold tracking-tight border-b pb-3 mb-4 group-hover:border-primary/20 transition-colors">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                  By accessing or using the Bhutan Developer Network (BDN) platform, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
                </p>
              </section>

              <section className="group">
                <h2 className="text-xl md:text-2xl font-bold tracking-tight border-b pb-3 mb-4 group-hover:border-primary/20 transition-colors">2. Description of Service</h2>
                <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                  BDN provides a professional networking and collaboration platform for the Bhutanese tech ecosystem. Our services include developer identity management, technical help feeds, team formation tools, and project collaboration spaces.
                </p>
              </section>

              <section className="group">
                <h2 className="text-xl md:text-2xl font-bold tracking-tight border-b pb-3 mb-4 group-hover:border-primary/20 transition-colors">3. User Conduct</h2>
                <p className="text-muted-foreground leading-relaxed text-sm md:text-base mb-4">
                  Users are expected to maintain professional conduct. We prohibit:
                </p>
                <ul className="space-y-3 text-muted-foreground text-sm md:text-base">
                  <li className="flex gap-3">
                    <span className="text-primary/40">•</span>
                    <span>Harassment or abuse of other members.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary/40">•</span>
                    <span>Posting of malicious code or content.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary/40">•</span>
                    <span>Misrepresentation of professional identity or skills.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary/40">•</span>
                    <span>Unauthorized scraping of platform data.</span>
                  </li>
                </ul>
              </section>

              <section className="group">
                <h2 className="text-xl md:text-2xl font-bold tracking-tight border-b pb-3 mb-4 group-hover:border-primary/20 transition-colors">4. Intellectual Property</h2>
                <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                  The platform, including its design, logos, and code, is the property of Bhutan Developer Network. Content posted by users remains the property of the respective users, but you grant BDN a license to display and distribute such content within the platform.
                </p>
              </section>

              <section className="group">
                <h2 className="text-xl md:text-2xl font-bold tracking-tight border-b pb-3 mb-4 group-hover:border-primary/20 transition-colors">5. Privacy</h2>
                <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                  Your use of BDN is also governed by our Privacy Policy. Please review it to understand how we collect and use your data.
                </p>
              </section>

              <section className="group">
                <h2 className="text-xl md:text-2xl font-bold tracking-tight border-b pb-3 mb-4 group-hover:border-primary/20 transition-colors">6. Limitation of Liability</h2>
                <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                  BDN is provided "as is" without warranties of any kind. We are not liable for any damages arising from your use of the platform or interactions with other users.
                </p>
              </section>

              <section className="group">
                <h2 className="text-xl md:text-2xl font-bold tracking-tight border-b pb-3 mb-4 group-hover:border-primary/20 transition-colors">7. Changes to Terms</h2>
                <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                  We reserve the right to modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the new terms.
                </p>
              </section>

              <section className="group">
                <h2 className="text-xl md:text-2xl font-bold tracking-tight border-b pb-3 mb-4 group-hover:border-primary/20 transition-colors">8. Contact Information</h2>
                <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                  If you have any questions about these Terms, please contact us at <a href="mailto:support@devconnect.bt" className="text-primary font-medium hover:underline">support@devconnect.bt</a>.
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
