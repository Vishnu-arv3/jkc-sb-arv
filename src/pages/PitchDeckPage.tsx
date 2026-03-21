import { useState, useEffect, useRef } from "react";
import { FileText, Volume2, VolumeX, Presentation, ArrowLeft } from "lucide-react";
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

  const displayUrl = "/Pitch_Deck-Presentation.pdf";

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = displayUrl;
    link.download = "Pitch_Deck-Presentation.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DocumentLayout title="Pitch Deck Presentation">
      <div className="relative h-screen w-screen overflow-hidden bg-zinc-950 flex flex-col">
        
        {/* Simplified Header */}
        <div className="z-50 flex items-center justify-between px-8 py-6 bg-black/40 backdrop-blur-md border-b border-white/5 animate-in fade-in duration-700">
          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="group flex h-10 w-10 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white transition-all hover:scale-110">
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            </Link>
            <div className="flex flex-col">
               <h1 className="text-sm font-bold tracking-tight text-white/90">JKCement Strategic Pitch Deck</h1>
               <span className="text-[10px] font-medium text-white/40 uppercase tracking-widest leading-none mt-1">Presentation Mode</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={handleDownload}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 border border-white/10 transition-all text-xs font-bold uppercase tracking-widest shadow-xl"
            >
              <FileText size={16} />
              <span className="hidden sm:inline">Download PDF</span>
            </button>

            <button 
              onClick={() => setIsMuted(!isMuted)}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white/50 transition-all hover:text-primary active:scale-95"
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
          </div>
        </div>

        {/* Responsive "Single Screen" Viewer */}
        <div className="flex-1 w-full h-full relative group bg-zinc-900">
          <iframe 
            src={`${displayUrl}#toolbar=0&navpanes=0&view=Fit`} 
            className="h-full w-full border-0 transition-opacity duration-1000"
            title="Strategic Pitch Deck"
            allowFullScreen
          />
          
          {/* Minimalist Branding Footer Overlay */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none opacity-20 flex items-center gap-4 z-30">
            <div className="h-[1px] w-8 bg-white/20" />
            <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white/40">JKCement Vision 2026</span>
            <div className="h-[1px] w-8 bg-white/20" />
          </div>
        </div>

        {/* Ultra HD Quality Badge (Subtle) */}
        <div className="absolute bottom-8 right-8 pointer-events-none opacity-40">
           <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black/40 border border-white/5 backdrop-blur-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[8px] font-bold uppercase tracking-widest text-white/60">HD Render Active</span>
           </div>
        </div>
      </div>
    </DocumentLayout>
  );
};

export default PitchDeckPage;
