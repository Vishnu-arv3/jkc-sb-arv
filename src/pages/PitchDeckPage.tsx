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
        <div className="flex-1 w-full bg-card/50 backdrop-blur-sm rounded-[3rem] border border-border/50 shadow-[0_40px_100px_rgba(0,0,0,0.4)] overflow-hidden relative animate-in zoom-in-95 duration-1000 fill-mode-both">
          {/* Environment-Aware Viewer: PDF for Local (Offline/No-Tunnel), PPTX for Production */}
          <iframe 
            src={isLocalhost ? "/Pitch_Deck-Presentation.pdf" : embedUrl} 
            className="h-full w-full border-0 bg-white"
            title="Pitch Deck Presentation"
            allowFullScreen
            loading="lazy"
          />

          {/* Local environment helper overlay (Subtle) */}
          {isLocalhost && (
            <div className="absolute bottom-12 right-12 z-40 animate-in slide-in-from-bottom-4 duration-1000">
               <div className="group relative">
                  <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 backdrop-blur-xl shadow-2xl">
                    <div className="w-8 h-8 bg-amber-500/20 rounded-xl flex items-center justify-center text-amber-500">
                       <Info size={16} />
                    </div>
                    <div className="flex flex-col gap-0.5">
                       <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">Local Preview Mode</span>
                       <span className="text-xs font-medium text-foreground/80">Viewing PDF version for localhost stability</span>
                    </div>
                  </div>
                  
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full right-0 mb-4 w-64 p-4 rounded-2xl bg-card border border-border shadow-2xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all pointer-events-none">
                     <p className="text-[10px] leading-relaxed text-muted-foreground">
                        Microsoft's Office Viewer requires a public URL. Locally, we've automatically switched to the **PDF fallback** to ensure you can see your presentation. The PPTX viewer will activate once deployed to Vercel.
                     </p>
                  </div>
               </div>
            </div>
          )}
          
          {/* Subtle branding footer inside viewer */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none opacity-30 flex items-center gap-3 z-30">
            <div className="h-px w-8 bg-muted-foreground" />
            <span className="text-[8px] font-black uppercase tracking-[0.4em] text-muted-foreground">JKCement Strategic Presentation (Office Live)</span>
            <div className="h-px w-8 bg-muted-foreground" />
          </div>
        </div>

        {/* Ambient Sound Indicator */}
        {!isMuted && (
          <div className="absolute bottom-6 right-8 flex items-center gap-2 pointer-events-none opacity-40 animate-pulse">
            <Volume2 size={12} className="text-primary" />
             <span className="text-[9px] font-bold uppercase tracking-widest text-primary">Interactive Sound Active</span>
          </div>
        )}
      </div>
    </DocumentLayout>
  );
};

export default PitchDeckPage;
