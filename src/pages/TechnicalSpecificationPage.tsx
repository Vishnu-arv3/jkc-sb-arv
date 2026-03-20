import { useEffect, useRef, useState } from "react";
import { 
  FileVideo, 
  Cpu, 
  Database, 
  ShieldCheck, 
  Cloud, 
  Layers, 
  Zap, 
  Users, 
  ChevronRight,
  Monitor,
  Smartphone,
  CheckCircle2,
  Lock,
  ArrowRight
} from "lucide-react";
import jkLogo from "@/assets/jkcement_logo.png";

const TechnicalSpecificationPage = () => {
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({});
  const observerRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    Object.values(observerRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const setRef = (id: string) => (el: HTMLDivElement | null) => {
    observerRefs.current[id] = el;
  };

  const SectionTitle = ({ children, subtitle }: { children: React.ReactNode, subtitle?: string }) => (
    <div className="mb-12 text-center">
      <h2 className="text-3xl font-bold font-display tracking-tight text-foreground sm:text-4xl mb-4">{children}</h2>
      {subtitle && <p className="text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>}
      <div className="h-1 w-20 bg-primary mx-auto mt-6 rounded-full" />
    </div>
  );

  return (
    <div className="min-h-screen bg-background font-body selection:bg-primary/20">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
          <div className="absolute top-0 -right-4 w-72 h-72 bg-secondary/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-accent/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
        </div>

        <div className="container relative z-10 mx-auto px-4 text-center">
          <div className="animate-fade-in">
            <img src={jkLogo} alt="JKCement" className="h-16 mx-auto mb-8 animate-float" />
            <span className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wide uppercase bg-primary/10 text-primary rounded-full border border-primary/20">
              Personalized Video Feature
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold font-display text-foreground tracking-tight mb-6">
              Technical <span className="text-primary">Specification</span>
            </h1>
            <p className="max-w-2xl mx-auto text-xl text-muted-foreground leading-relaxed">
              A comprehensive blueprint for the AI-powered home-building journey experience.
            </p>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section id="overview" ref={setRef("overview")} className={`py-20 transition-all duration-1000 transform ${isVisible["overview"] ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="glass-card p-8 rounded-3xl">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <FileVideo className="text-primary h-8 w-8 text-secondary" />
                Project Vision
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                JKCement aims to create an emotionally resonant experience by placing customers directly into the narrative of building their dream home. Utilizing state-of-the-art AI Face-Swap technology, we bridge the gap between imagination and reality.
              </p>
              <ul className="space-y-4">
                {[
                  "Personalized video based on a single selfie",
                  "Realistic 5-stage home construction journey",
                  "Seamless integration into JKCement's digital ecosystem",
                  "High-fidelity output at 1080p resolution"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-medium">
                    <CheckCircle2 className="text-success h-5 w-5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative bg-card rounded-2xl p-8 border border-border">
                <div className="space-y-6">
                  <div className="flex justify-between items-center text-sm font-mono opacity-50">
                    <span>STATUS: DRAFT 1.0</span>
                    <span>CREATED: MARCH 2026</span>
                  </div>
                  <div className="h-px bg-border w-full" />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-muted/50">
                      <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Architecture</p>
                      <p className="font-bold">Resend/Supabase</p>
                    </div>
                    <div className="p-4 rounded-xl bg-muted/50">
                      <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Compute</p>
                      <p className="font-bold">AWS G4dn GPU</p>
                    </div>
                    <div className="p-4 rounded-xl bg-muted/50">
                      <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">AI Stack</p>
                      <p className="font-bold">SimSwap/Insight</p>
                    </div>
                    <div className="p-4 rounded-xl bg-muted/50">
                      <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Frontend</p>
                      <p className="font-bold">Vite/React/TS</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* System Architecture */}
      <section id="architecture" ref={setRef("architecture")} className={`py-20 bg-muted/30 transition-all duration-1000 transform ${isVisible["architecture"] ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}>
        <div className="container mx-auto px-4">
          <SectionTitle subtitle="A robust, horizontally scalable pipeline for mass personalization.">
            System Architecture
          </SectionTitle>
          
          <div className="grid md:grid-cols-4 gap-6 relative">
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-border to-transparent -translate-y-1/2 z-0" />
            
            {[
              { icon: Monitor, title: "Frontend layer", desc: "React + Vite SPA with high-end UI/UX animations", color: "bg-blue-500" },
              { icon: Database, title: "Data Storage", desc: "Supabase PG + Storage Buckets for private access", color: "bg-green-500" },
              { icon: Cpu, title: "GPU Compute", desc: "FastAPI workers on AWS instances with NVIDIA T4", color: "bg-purple-500" },
              { icon: Cloud, title: "CDN Delivery", desc: "Distributed video streaming for instant access", color: "bg-orange-500" }
            ].map((node, i) => (
              <div key={i} className="relative z-10 glass-card p-6 rounded-2xl group hover:-translate-y-2 transition-all cursor-default">
                <div className={`w-12 h-12 ${node.color} text-white rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-${node.color.split('-')[1]}/20`}>
                  <node.icon size={24} />
                </div>
                <h4 className="font-bold mb-3">{node.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{node.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Pipeline */}
      <section id="ai" ref={setRef("ai")} className={`py-20 transition-all duration-1000 transform ${isVisible["ai"] ? "translate-x-0 opacity-100" : "-translate-x-20 opacity-0"}`}>
        <div className="container mx-auto px-4">
          <SectionTitle subtitle="Using deep learning to create hyper-realistic face integration.">
            AI Rendering Pipeline
          </SectionTitle>

          <div className="max-w-4xl mx-auto space-y-8">
            {[
              { step: "01", name: "Face Detection", tech: "InsightFace/MediaPipe", desc: "Localizing facial markers and performing quality validation (blur, lighting, profile angle)." },
              { step: "02", name: "Feature Embedding", tech: "ArcFace Vectors", desc: "Extracting unique facial characteristics into a compact 512-D vector space." },
              { step: "03", name: "Frame Swapping", tech: "SimSwap / DeepFaceLab", desc: "Neural synthesis of the target face onto pre-rendered character frames with temporal consistency." },
              { step: "04", name: "Enhancement", tech: "GFPGAN / Real-ESRGAN", desc: "Restoring skin textures and eye details for a premium, high-definition look." }
            ].map((step, i) => (
              <div key={i} className="flex gap-6 group items-start">
                <div className="text-4xl font-extrabold text-primary/20 group-hover:text-primary/100 transition-colors shrink-0">{step.step}</div>
                <div className="bg-card border border-border p-6 rounded-2xl flex-grow shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-xl font-bold font-display">{step.name}</h4>
                    <span className="text-xs font-mono px-2 py-1 bg-muted rounded uppercase">{step.tech}</span>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Stages */}
      <section id="stages" ref={setRef("stages")} className={`py-20 bg-secondary/5 transition-all duration-1000 transform ${isVisible["stages"] ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}>
        <div className="container mx-auto px-4 text-center">
          <SectionTitle subtitle="A seamless narrative journey from ground zero to a completed masterpiece.">
            The Journey Stages
          </SectionTitle>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { name: "Plot Survey", emoji: "📐" },
              { name: "Foundation", emoji: "🧱" },
              { name: "Rising Walls", emoji: "🏗️" },
              { name: "Interior Finishing", emoji: "🎨" },
              { name: "The Dream Home", emoji: "🏠" }
            ].map((stage, i) => (
              <div key={i} className="bg-card p-4 rounded-2xl border border-border hover:border-primary/50 transition-colors shadow-sm">
                <div className="text-3xl mb-3">{stage.emoji}</div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Stage {i+1}</p>
                <p className="font-semibold text-sm">{stage.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security & Infra */}
      <section id="security" ref={setRef("security")} className={`py-20 transition-all duration-1000 transform ${isVisible["security"] ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}>
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-card p-8 rounded-3xl border-success/20">
              <ShieldCheck className="text-success h-10 w-10 mb-6" />
              <h3 className="text-xl font-bold mb-4">Privacy & GDPR</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Biometric data is never stored. Face vectors are ephemeral and processed in-memory during rendering, then discarded. Full encryption at rest and in transit.
              </p>
            </div>
            <div className="glass-card p-8 rounded-3xl border-primary/20">
              <Zap className="text-primary h-10 w-10 mb-6" />
              <h3 className="text-xl font-bold mb-4">High Performance</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                NVIDIA T4 Tensor Core GPUs allow for parallel frame rendering, reducing total video assembly time to under 120 seconds for a full 52-second clip.
              </p>
            </div>
            <div className="glass-card p-8 rounded-3xl border-secondary/20">
              <Lock className="text-secondary h-10 w-10 mb-6" />
              <h3 className="text-xl font-bold mb-4">Secure Access</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Supabase Row-Level Security (RLS) ensures that only the authenticated user who uploaded the selfie can view the resulting personalized video.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Credit Section */}
      <section className="py-32 bg-foreground text-card overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-12">
            <div className="space-y-4">
              <p className="text-primary font-bold tracking-[0.3em] uppercase animate-pulse">Assignment Submission</p>
              <h2 className="text-4xl md:text-5xl font-display font-black leading-tight">
                Empowering homeowners with <br/><span className="italic">personalized</span> narratives.
              </h2>
            </div>
            
            <div className="h-px bg-white/10 w-32 mx-auto" />
            
            <div className="space-y-8">
              <p className="text-white/60 font-medium">DESIGNED AND ARCHITECTED BY</p>
              <div className="relative inline-block px-12 py-6">
                <div className="absolute inset-0 bg-primary/20 blur-3xl animate-glow rounded-full" />
                <h3 className="relative text-5xl md:text-7xl font-display font-black tracking-tighter shimmer-text animate-float">
                  Vishnu Kumar A R
                </h3>
              </div>
            </div>

            <div className="pt-12">
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="group flex items-center gap-2 mx-auto text-sm font-bold uppercase tracking-widest hover:text-white transition-colors"
              >
                Return to top <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border/50 text-center text-xs text-muted-foreground tracking-widest uppercase">
        JKCEMENT Video Studio • Technical Documentation • v1.0.0
      </footer>

      {/* In-page Navigation Indicator */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex items-center gap-2 px-6 py-3 bg-card/80 backdrop-blur-md border border-border rounded-full shadow-2xl z-50">
        {['overview', 'architecture', 'ai', 'stages', 'security'].map((section) => (
          <a
            key={section}
            href={`#${section}`}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-[10px] font-bold uppercase tracking-tighter px-3 py-1 hover:text-primary transition-colors border-r last:border-0 border-border"
          >
            {section}
          </a>
        ))}
      </div>
    </div>
  );
};

export default TechnicalSpecificationPage;
