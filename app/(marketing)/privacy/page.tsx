import { GlobalHeader } from "@/components/common/global-header";
import { GlobalFooter } from "@/components/common/global-footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Bhutan Developer Network",
  description: "Privacy policy for the Bhutan Developer Network platform.",
};

export default function PrivacyPage() {
  const lastUpdated = "March 31, 2026";

  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-primary/5">
      <GlobalHeader />
      <main className="flex-1">
        <section className="py-16 md:py-24 lg:py-32">
          <div className="container max-w-3xl mx-auto px-4">
            <div className="space-y-4 mb-12 md:mb-16">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter">
                Privacy Policy
              </h1>
              <p className="text-muted-foreground text-sm font-medium">
                Last Updated: {lastUpdated}
              </p>
            </div>

            <div className="space-y-12">
              <section className="group">
                <h2 className="text-xl md:text-2xl font-bold tracking-tight border-b pb-3 mb-4 group-hover:border-primary/20 transition-colors">1. Introduction</h2>
                <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                  Bhutan Developer Network (BDN) respects your privacy and is committed to protecting your personal data. This policy explains how we handle your information when you use our platform.
                </p>
              </section>

              <section className="group">
                <h2 className="text-xl md:text-2xl font-bold tracking-tight border-b pb-3 mb-4 group-hover:border-primary/20 transition-colors">2. Information We Collect</h2>
                <p className="text-muted-foreground leading-relaxed text-sm md:text-base mb-4">
                  We collect information to provide better services to our users. This includes:
                </p>
                <ul className="space-y-3 text-muted-foreground text-sm md:text-base">
                  <li className="flex gap-3">
                    <span className="text-primary/40">•</span>
                    <span><strong>Profile Details:</strong> Name, professional title, skills, and portfolio links.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary/40">•</span>
                    <span><strong>Account Information:</strong> Email address provided during registration (typically via Google or GitHub).</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary/40">•</span>
                    <span><strong>Usage Data:</strong> Pages visited, features used, and interactions within the platform.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary/40">•</span>
                    <span><strong>Communications:</strong> Messages sent through our help feed and collaboration tools.</span>
                  </li>
                </ul>
              </section>

              <section className="group">
                <h2 className="text-xl md:text-2xl font-bold tracking-tight border-b pb-3 mb-4 group-hover:border-primary/20 transition-colors">3. How We Use Information</h2>
                <p className="text-muted-foreground leading-relaxed text-sm md:text-base mb-4">
                  We use the information we collect to:
                </p>
                <ul className="space-y-3 text-muted-foreground text-sm md:text-base">
                  <li className="flex gap-3">
                    <span className="text-primary/40">•</span>
                    <span>Create and manage your professional identity within the network.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary/40">•</span>
                    <span>Enable discovery and collaboration between developers.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary/40">•</span>
                    <span>Communicate with you about platform updates and opportunities.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary/40">•</span>
                    <span>Improve our services based on usage patterns and feedback.</span>
                  </li>
                </ul>
              </section>

              <section className="group">
                <h2 className="text-xl md:text-2xl font-bold tracking-tight border-b pb-3 mb-4 group-hover:border-primary/20 transition-colors">4. Data Sharing and Disclosure</h2>
                <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                  We do not sell your personal data. Your profile information is visible to other members of the network by design. We may share data with service providers who help us operate the platform (e.g., Supabase for database hosting).
                </p>
              </section>

              <section className="group">
                <h2 className="text-xl md:text-2xl font-bold tracking-tight border-b pb-3 mb-4 group-hover:border-primary/20 transition-colors">5. Data Security</h2>
                <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                  We implement industry-standard security measures to protect your data. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
                </p>
              </section>

              <section className="group">
                <h2 className="text-xl md:text-2xl font-bold tracking-tight border-b pb-3 mb-4 group-hover:border-primary/20 transition-colors">6. Your Rights</h2>
                <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                  You have the right to access, correct, or delete your personal data. Most profile information can be managed directly through your account settings. For other requests, please contact us.
                </p>
              </section>

              <section className="group">
                <h2 className="text-xl md:text-2xl font-bold tracking-tight border-b pb-3 mb-4 group-hover:border-primary/20 transition-colors">7. Cookies</h2>
                <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                  We use essential cookies to maintain your session and improve performance. By using BDN, you consent to our use of cookies.
                </p>
              </section>

              <section className="group">
                <h2 className="text-xl md:text-2xl font-bold tracking-tight border-b pb-3 mb-4 group-hover:border-primary/20 transition-colors">8. Contact Us</h2>
                <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                  If you have questions about this Privacy Policy, please email us at <a href="mailto:privacy@devconnect.bt" className="text-primary font-medium hover:underline">privacy@devconnect.bt</a>.
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
