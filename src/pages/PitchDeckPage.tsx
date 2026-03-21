import { useState, useEffect, useRef } from "react";
import { FileText, Volume2, VolumeX, Presentation, ArrowLeft, Info } from "lucide-react";
import DocumentLayout from "@/components/DocumentLayout";
import { Link } from "react-router-dom";

const PitchDeckPage = () => {
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio("https://www.soundjay.com/misc/sounds/page-flip-01a.mp3");
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const playPageTurn = () => {
    if (audioRef.current && !isMuted) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => console.log("Audio play failed:", e));
    }
  };

  // PPTX Viewer URL (Note: Office Viewer requires a public URL)
  const pptUrl = `${window.location.origin}/Pitch_Deck-Presentation.pptx`;
  const embedUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(pptUrl)}`;
  const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "/Pitch_Deck-Presentation.pptx";
    link.download = "Pitch_Deck-Presentation.pptx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DocumentLayout title="Pitch Deck Presentation">
      <div className="relative h-screen w-screen overflow-hidden bg-background flex flex-col pt-24 pb-12 px-8">
        
        {/* Animated Background Gradients */}
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 animate-pulse pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-secondary/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 animate-pulse pointer-events-none" />

        {/* Floating Top Header Area */}
        <div className="absolute top-8 left-8 z-50 flex items-center gap-6 animate-in fade-in slide-in-from-left-8 duration-700">
          <Link to="/dashboard" className="group flex h-12 w-12 items-center justify-center rounded-full bg-card/80 text-foreground backdrop-blur-md border border-border transition-all hover:scale-110 shadow-xl">
            <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
          </Link>
          <div className="flex flex-col">
             <div className="flex items-center gap-2 mb-0.5">
                <Presentation className="h-4 w-4 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Presentation Mode</span>
             </div>
             <h1 className="text-lg font-bold tracking-tight text-foreground">JKCement Strategic Pitch Deck</h1>
          </div>
        </div>

        {/* Floating Controls Area (Right) */}
        <div className="absolute top-8 right-8 z-50 flex items-center gap-3 animate-in fade-in slide-in-from-right-8 duration-700">
          <button 
            onClick={handleDownload}
            className="group flex items-center gap-2 px-6 py-3 rounded-2xl bg-muted/50 hover:bg-muted text-foreground/80 backdrop-blur-md border border-border transition-all hover:scale-105 active:scale-95"
            title="Download PPTX File"
          >
            <FileText size={18} />
            <span className="text-xs font-bold uppercase tracking-widest hidden sm:inline">Download PPTX</span>
          </button>

          <button 
            onClick={() => {
              setIsMuted(!isMuted);
              playPageTurn();
            }}
            className="group flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:scale-110 hover:rotate-3 active:scale-95"
            title={isMuted ? "Unmute Sound" : "Mute Sound"}
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
        </div>

        {/* Main Content Viewer */}
        <div className="flex-1 w-full bg-card/50 backdrop-blur-sm rounded-[3rem] border border-border/50 shadow-[0_40px_100px_rgba(0,0,0,0.4)] overflow-hidden relative animate-in zoom-in-95 duration-1000 fill-mode-both group">
          
          {/* Immersive PDF Viewer (Primary Experience) */}
          <iframe 
            src="/Pitch_Deck-Presentation.pdf#toolbar=0&navpanes=0&scrollbar=0" 
            className="h-full w-full border-0 bg-zinc-900 invert dark:invert-0 transition-opacity duration-1000"
            title="Strategic Pitch Deck"
            allowFullScreen
            loading="lazy"
          />

          {/* Premium Branding Overlay */}
          <div className="absolute inset-0 pointer-events-none border-[12px] border-card/20 rounded-[3rem] z-20" />
          
          {/* Subtle Environment/Quality Indicator */}
          <div className="absolute bottom-10 right-10 z-40 animate-in fade-in slide-in-from-right-4 duration-1000">
             <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-primary/10 border border-primary/20 backdrop-blur-2xl shadow-2xl">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(var(--primary),0.8)]" />
                <div className="flex flex-col">
                   <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">Ultra HD Render</span>
                   <span className="text-[10px] font-medium text-foreground/70">Strategic Presentation PDF</span>
                </div>
             </div>
          </div>

          {/* Hover Controls Hint */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 text-center">
             <div className="px-6 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white/50">
                Scroll to explore slides
             </div>
          </div>
          
          {/* Subtle branding footer inside viewer */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none opacity-20 flex items-center gap-3 z-30">
            <div className="h-px w-8 bg-muted-foreground" />
            <span className="text-[8px] font-black uppercase tracking-[0.4em] text-muted-foreground">JKCement Strategic Vision 2026</span>
            <div className="h-px w-8 bg-muted-foreground" />
          </div>
        </div>

        {/* Deployment Instruction (Hidden from production) */}
        {window.location.hostname === "localhost" && (
           <div className="mt-8 p-4 rounded-2xl bg-muted/30 border border-border/50 text-center animate-in fade-in slide-in-from-bottom-2 duration-700">
              <p className="text-[10px] text-muted-foreground italic">
                <span className="font-bold text-foreground">Note for Deployment:</span> As this PDF is 109MB, ensure you host it on <span className="text-primary font-bold">Supabase Storage</span> or use <span className="text-primary font-bold">Git LFS</span> for Vercel to display it correctly in production.
              </p>
           </div>
        )}
      </div>
    </DocumentLayout>
  );
};

export default PitchDeckPage;
