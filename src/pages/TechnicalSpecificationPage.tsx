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
  ArrowRight,
  ArrowLeft
} from "lucide-react";
import { Link } from "react-router-dom";
import jkLogo from "@/assets/jkcement_logo.png";
import DocumentLayout from "@/components/DocumentLayout";

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
    <DocumentLayout title="Technical Specification">
      <div className="min-h-screen font-body selection:bg-primary/20 relative bg-background text-foreground overflow-x-hidden">
        {/* Ambient Grid Background */}
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '40px 40px' }} />

        <Link to="/dashboard" className="absolute top-8 left-8 group flex h-12 w-12 items-center justify-center rounded-full bg-card/80 text-foreground backdrop-blur-md border border-border transition-all hover:scale-110 z-50 shadow-2xl">
          <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
        </Link>

        {/* Enhanced Hero Section */}
        <section className="relative py-32 overflow-hidden pt-20">
          <div className="absolute inset-0 z-0">
            <div className="absolute top-0 -left-20 w-[500px] h-[500px] bg-primary/10 rounded-full mix-blend-screen filter blur-[120px] opacity-50 animate-blob" />
            <div className="absolute top-0 -right-20 w-[500px] h-[500px] bg-secondary/10 rounded-full mix-blend-screen filter blur-[120px] opacity-50 animate-blob animation-delay-2000" />
          </div>

          <div className="container relative z-10 mx-auto px-4 text-center">
            <div className="animate-in fade-in slide-in-from-bottom-12 duration-1000">
              <img src={jkLogo} alt="JKCement" className="h-14 mx-auto mb-10 animate-float drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]" />
              <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 text-[10px] font-black tracking-[0.25em] uppercase bg-primary/20 text-primary rounded-full border border-primary/30 backdrop-blur-md">
                <Zap size={10} fill="currentColor" />
                Next-Gen Personalized Video Pipeline
              </div>
              <h1 className="text-6xl md:text-8xl font-black font-display text-foreground tracking-tighter mb-8 leading-[0.9]">
                Technical <br /><span className="text-primary italic">Specification</span>
              </h1>
              <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground leading-relaxed font-medium">
                The ultimate technical framework for the AI-driven <br className="hidden md:block" /> customer journey at JKCement Studio.
              </p>
            </div>
          </div>
        </section>

        {/* Overview */}
        <section id="overview" ref={setRef("overview")} className={`py-24 transition-all duration-1000 transform ${isVisible["overview"] ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}>
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="glass-card p-10 rounded-[2.5rem] border-primary/10 backdrop-blur-2xl shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-primary/10 transition-colors" />
                <h3 className="text-3xl font-bold mb-8 flex items-center gap-4">
                  <FileVideo className="text-primary h-10 w-10 p-2 bg-primary/10 rounded-xl" />
                  Project Vision
                </h3>
                <p className="text-muted-foreground text-lg leading-relaxed mb-10 font-medium">
                  JKCement is revolutionizing customer engagement by enabling homeowners to visualize themselves within the construction process. By leveraging high-performance AI inference, we deliver a 1080p cinematic journey in minutes.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    "Single-Selfie Realism",
                    "5-Stage Fluid Narrative",
                    "Secure Cloud Integration",
                    "Cinema-Grade Output"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 bg-muted/30 rounded-2xl border border-border/50">
                      <CheckCircle2 className="text-primary h-5 w-5 shrink-0" />
                      <span className="text-xs font-bold uppercase tracking-wider">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-[3rem] blur-2xl opacity-50" />
                <div className="relative bg-card/60 backdrop-blur-xl rounded-[2.5rem] p-10 border border-border/50 shadow-2xl">
                  <div className="space-y-8">
                    <div className="flex justify-between items-center text-[10px] font-black tracking-widest text-primary">
                      <span className="flex items-center gap-2"><Lock size={12} /> FINAL SPECIFICATION v1.0</span>
                      <span>RELEASE: MARCH 2026</span>
                    </div>
                    <div className="h-px bg-border/50 w-full" />
                    <div className="grid grid-cols-2 gap-6">
                      {[
                        { label: "Infrastructure", value: "Supabase Core" },
                        { label: "Rendering", value: "AWS EC2 G4dn" },
                        { label: "AI Engine", value: "InsightFace v2" },
                        { label: "Frontend", value: "React 18 / TS" }
                      ].map((stat, i) => (
                        <div key={i} className="space-y-1">
                          <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">{stat.label}</p>
                          <p className="text-lg font-bold text-foreground">{stat.value}</p>
                        </div>
                      ))}
                    </div>
                    <div className="h-px bg-border/50 w-full" />
                    <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                      <div className="p-3 bg-primary/10 rounded-xl text-primary font-bold">99.9%</div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest">Uptime Target</p>
                        <p className="text-[10px] text-muted-foreground">Global CDN Edge Delivery</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* System Architecture */}
        <section id="architecture" ref={setRef("architecture")} className={`py-32 bg-muted/10 relative transition-all duration-1000 transform ${isVisible["architecture"] ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}>
          <div className="container mx-auto px-4">
            <SectionTitle subtitle="A robust, horizontally scalable ecosystem for mass personalization.">
              System Architecture
            </SectionTitle>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: Monitor, title: "Interface layer", desc: "React + Vite SPA with high-fidelity UI/UX animations and real-time state management.", color: "text-blue-500" },
                { icon: Database, title: "Data Storage", desc: "Supabase PostgreSQL with RLS and high-bandwidth S3-compatible storage buckets.", color: "text-green-500" },
                { icon: Cpu, title: "GPU Compute", desc: "Distributed FastAPI workers on AWS G4dn instances featuring NVIDIA T4 Tensor Cores.", color: "text-purple-500" },
                { icon: Cloud, title: "Edge Delivery", desc: "Optimized video streaming via global CDN for near-zero latency playback globally.", color: "text-orange-500" }
              ].map((node, i) => (
                <div key={i} className="glass-card p-8 rounded-3xl border-border/50 group hover:-translate-y-2 transition-all duration-500 bg-card/40">
                  <div className={`w-14 h-14 bg-background border border-border rounded-2xl flex items-center justify-center mb-8 shadow-inner group-hover:scale-110 transition-transform ${node.color}`}>
                    <node.icon size={28} />
                  </div>
                  <h4 className="text-xl font-bold mb-4 tracking-tight">{node.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed font-medium">{node.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AI Pipeline */}
        <section id="ai" ref={setRef("ai")} className={`py-32 transition-all duration-1000 transform ${isVisible["ai"] ? "translate-x-0 opacity-100" : "-translate-x-20 opacity-0"}`}>
          <div className="container mx-auto px-4">
            <SectionTitle subtitle="Utilizing deep learning for hyper-realistic and consistent face integration.">
              AI Rendering Pipeline
            </SectionTitle>
            <p className="mb-12" />
            <div className="max-w-5xl mx-auto grid gap-10">
              {[
                { step: "01", name: "Face Detection", tech: "InsightFace/MediaPipe", desc: "Advanced localization of 68+ facial landmarks and validation for resolution, blur, and lighting conditions before processing." },
                { step: "02", name: "Feature Embedding", tech: "ArcFace Vectors", desc: "Digitizing unique facial identities into a high-dimensional 512-D vector space, ensuring accurate identity preservation." },
                { step: "03", name: "Face Synthesis", tech: "SimSwap / DeepFaceLab", desc: "Frame-by-frame neural-infusion of the user face onto master cinematics with proprietary temporal smoothing for flicker-free results." },
                { step: "04", name: "Image Restoration", tech: "GFPGAN / Real-ESRGAN", desc: "Post-processing each frame with generative adversarial networks to restore fine details in eyes and skin textures." }
              ].map((step, i) => (
                <div key={i} className="flex flex-col md:flex-row gap-8 group items-start">
                  <div className="text-6xl font-black text-primary/10 group-hover:text-primary transition-all duration-700 select-none">{step.step}</div>
                  <div className="bg-card/40 backdrop-blur-md border border-border/60 p-8 rounded-[2rem] flex-grow shadow-lg hover:shadow-primary/5 hover:border-primary/20 transition-all duration-500">
                    <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
                      <h4 className="text-2xl font-bold font-display tracking-tight">{step.name}</h4>
                      <span className="text-[10px] font-black px-3 py-1 bg-primary/10 text-primary rounded-lg uppercase tracking-widest">{step.tech}</span>
                    </div>
                    <p className="text-muted-foreground text-base leading-relaxed font-medium">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Video Stages */}
        <section id="stages" ref={setRef("stages")} className={`py-32 bg-secondary/5 transition-all duration-1000 transform ${isVisible["stages"] ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}>
          <div className="container mx-auto px-4 text-center">
            <SectionTitle subtitle="A cinematic journey through the five pillars of home construction.">
              The Narrative Arc
            </SectionTitle>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 max-w-6xl mx-auto">
              {[
                { name: "Plot Selection", emoji: "📐" },
                { name: "Building Foundation", emoji: "🧱" },
                { name: "Construction", emoji: "🏗️" },
                { name: "Interior Magic", emoji: "🎨" },
                { name: "The Dream Home", emoji: "🏠" }
              ].map((stage, i) => (
                <div key={i} className="bg-card/60 backdrop-blur-sm p-8 rounded-[2.5rem] border border-border/50 hover:border-primary/40 hover:scale-105 transition-all group shadow-xl">
                  <div className="text-4xl mb-6 group-hover:scale-125 transition-transform duration-500">{stage.emoji}</div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-2">Stage 0{i + 1}</p>
                  <p className="font-bold text-base tracking-tight">{stage.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Security & Efficiency */}
        <section id="security" ref={setRef("security")} className={`py-32 transition-all duration-1000 transform ${isVisible["security"] ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}>
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-10">
              {[
                {
                  icon: ShieldCheck,
                  title: "Privacy First",
                  color: "text-green-500",
                  desc: "Biometric data is strictly processed in RAM and never touches permanent storage. We utilize session-based processing to ensure 100% GDPR compliance."
                },
                {
                  icon: Zap,
                  title: "Inference Speed",
                  color: "text-primary",
                  desc: "Parallelized CUDA kernels and optimized model ONNX exports allow for a full 50-second 1080p video render in less than 90 seconds."
                },
                {
                  icon: Lock,
                  title: "Data Sovereignty",
                  color: "text-secondary",
                  desc: "All assets are secured via Supabase RLS policies and JWT authentication, ensuring only the owner can access their personalized content."
                }
              ].map((feat, i) => (
                <div key={i} className="glass-card p-10 rounded-[2.5rem] bg-card/30 border-border/50 hover:bg-card transition-colors">
                  <feat.icon className={`${feat.color} h-12 w-12 mb-8`} />
                  <h3 className="text-2xl font-bold mb-5 tracking-tight">{feat.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                    {feat.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Credit Section */}
        <section className="py-40 relative overflow-hidden bg-zinc-950">
          <div className="absolute inset-0 opacity-20 pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #3b82f6 1px, transparent 0)', backgroundSize: '60px 60px' }} />

          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="max-w-4xl mx-auto space-y-16">
              <div className="space-y-6">
                <p className="text-primary font-black tracking-[0.5em] uppercase text-xs animate-pulse">Official Project Submission</p>
                <h2 className="text-5xl md:text-7xl font-display font-black leading-none text-white tracking-tighter">
                  Redefining home building with <br /><span className="italic text-primary">personal</span> perspective.
                </h2>
              </div>

              <div className="h-px bg-white/10 w-48 mx-auto" />

              <div className="space-y-10">
                <p className="text-white/40 text-xs font-black tracking-[0.4em] uppercase">Architected & Developed By</p>
                <div className="relative inline-block">
                  <div className="absolute -inset-10 bg-primary/20 blur-[100px] animate-glow rounded-full" />
                  <h3 className="relative text-7xl md:text-9xl font-display font-black tracking-tighter text-white animate-float leading-none">
                    Vishnu Kumar
                  </h3>
                </div>
              </div>

              <div className="pt-20">
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="group flex items-center gap-3 mx-auto text-xs font-black uppercase tracking-[0.3em] text-white/60 hover:text-primary transition-all duration-500"
                >
                  Back to Top <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </section>

      </div>
    </DocumentLayout>
  );
};

export default TechnicalSpecificationPage;
