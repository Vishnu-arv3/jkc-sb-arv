import { HelpCircle, MessageCircle, FileText, ExternalLink } from "lucide-react";
import AppLayout from "@/components/AppLayout";

const faqs = [
  { q: "How does the video generation work?", a: "Upload a selfie, and our AI analyzes your face, then places you into a personalized home-building journey video showing stages from foundation to finished home." },
  { q: "How long does video generation take?", a: "Typically 2-5 minutes depending on server load. You'll see real-time progress updates during generation." },
  { q: "Is my photo data secure?", a: "Yes. Your selfie is encrypted during processing and automatically deleted after your video is generated. We never store biometric data." },
  { q: "What photo format should I use?", a: "JPG or PNG, with a clear front-facing photo. Good lighting and a plain background work best." },
  { q: "Can I download and share my video?", a: "Absolutely. Every generated video can be downloaded in HD or shared directly via a link." },
];

const HelpPage = () => {
  return (
    <AppLayout>
      <div className="animate-fade-in space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Help & Support</h1>
          <p className="mt-1 text-sm text-muted-foreground">Find answers and get assistance</p>
        </div>

        <div className="mx-auto max-w-2xl space-y-6">
          {/* Quick Links */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { icon: MessageCircle, label: "Contact Support", desc: "Get in touch" },
              { icon: FileText, label: "Documentation", desc: "Read guides" },
              { icon: ExternalLink, label: "JKCement.com", desc: "Visit website" },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex cursor-pointer flex-col items-center rounded-xl border border-border bg-card p-5 text-center shadow-sm transition-shadow hover:shadow-md">
                <Icon className="mb-2 h-6 w-6 text-primary" />
                <p className="text-sm font-semibold text-foreground">{label}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>

          {/* FAQs */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-bold text-foreground">
              <HelpCircle className="h-5 w-5" /> Frequently Asked Questions
            </h2>
            <div className="divide-y divide-border">
              {faqs.map((faq, i) => (
                <div key={i} className="py-4 first:pt-0 last:pb-0">
                  <p className="text-sm font-semibold text-foreground">{faq.q}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default HelpPage;
