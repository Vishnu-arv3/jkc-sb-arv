import { useState, useEffect, useRef } from "react";
import { FileText, Volume2, VolumeX, Presentation, ArrowLeft, Info } from "lucide-react";
import DocumentLayout from "@/components/DocumentLayout";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const PitchDeckPage = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [cloudUrl, setCloudUrl] = useState<string | null>(localStorage.getItem('jkc_pitch_deck_cloud_url'));
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

  const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  const displayUrl = cloudUrl || "/Pitch_Deck-Presentation.pdf";

  const handleUpload = async () => {
    try {
      setIsUploading(true);
      const response = await fetch("/Pitch_Deck-Presentation.pdf");
      if (!response.ok) throw new Error("Local PDF file not found in /public folder.");
      const blob = await response.blob();
      
      const fileName = `pitch-deck-production.pdf`;
      const { data, error } = await supabase.storage
        .from('documents')
        .upload(fileName, blob, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        if (error.message.includes("Bucket not found")) {
          alert("CRITICAL: Storage bucket 'documents' not found in your Supabase project.\n\nTo fix:\n1. Go to Supabase Dashboard > Storage\n2. Create a new bucket named 'documents'\n3. Set it to 'Public'\n4. Click 'Sync' again here!");
          return;
        }
        throw error;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(fileName);

      setCloudUrl(publicUrl);
      localStorage.setItem('jkc_pitch_deck_cloud_url', publicUrl);
      alert("SUCCESS! 🚀\n\nYour 104MB Pitch Deck is now hosted in the cloud. Your Vercel app will display it perfectly without any size limits!");
    } catch (error: any) {
      console.error("Upload failed:", error);
      alert("Sync failed: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

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
      <div className="relative min-h-screen w-screen overflow-x-hidden bg-zinc-950 flex flex-col pt-24 pb-20 px-4 sm:px-8">
        
        {/* Cinematic Background Gradients */}
        <div className="fixed top-0 right-0 w-1/2 h-1/2 bg-primary/20 rounded-full blur-[160px] -translate-y-1/2 translate-x-1/2 animate-pulse pointer-events-none" />
        <div className="fixed bottom-0 left-0 w-1/2 h-1/2 bg-emerald-500/10 rounded-full blur-[160px] translate-y-1/2 -translate-x-1/2 animate-pulse pointer-events-none" />

        {/* Floating Top Header Area */}
        <div className="absolute top-8 left-8 z-50 flex items-center gap-6 animate-in fade-in slide-in-from-left-8 duration-1000">
          <Link to="/dashboard" className="group flex h-12 w-12 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white backdrop-blur-xl transition-all hover:scale-110 shadow-2xl hover:bg-white/10">
            <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
          </Link>
          <div className="flex flex-col">
             <div className="flex items-center gap-2 mb-0.5">
                <div className="h-1 w-3 bg-primary rounded-full animate-width" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Presentation Mode</span>
             </div>
             <h1 className="text-xl font-bold tracking-tight text-white/90">JKCement Strategic Pitch Deck</h1>
          </div>
        </div>

        {/* Floating Controls Area (Right) */}
        <div className="absolute top-8 right-8 z-50 flex items-center gap-3 animate-in fade-in slide-in-from-right-8 duration-1000">
          {isLocalhost && !cloudUrl && (
             <button 
               onClick={handleUpload}
               disabled={isUploading}
               className="group flex items-center gap-2 px-6 py-4 rounded-2xl bg-primary text-primary-foreground shadow-[0_0_30px_rgba(var(--primary),0.3)] hover:shadow-primary/50 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
             >
               <Info size={18} className={isUploading ? "animate-spin" : "animate-bounce"} />
               <div className="flex flex-col items-start translate-y-0.5">
                  <span className="text-[10px] font-black uppercase tracking-widest leading-none">{isUploading ? "Syncing..." : "Fix Vercel View"}</span>
                  <span className="text-[8px] opacity-70 font-medium">Click to Cloud-Sync (104MB)</span>
               </div>
             </button>
          )}

          <button 
            onClick={handleDownload}
            className="group flex items-center gap-2 px-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white/80 backdrop-blur-xl border border-white/10 transition-all hover:scale-105"
          >
            <FileText size={18} />
            <span className="text-xs font-bold uppercase tracking-widest hidden sm:inline">Download PDF</span>
          </button>

          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="group flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-white/50 backdrop-blur-md transition-all hover:scale-110 hover:text-primary shadow-xl"
          >
            {isMuted ? <VolumeX size={22} /> : <Volume2 size={22} />}
          </button>
        </div>

        {/* Main Content Viewer - Landscape Aspect Container */}
        <div className="flex-1 w-full max-w-7xl mx-auto flex items-center justify-center py-4 relative">
           <div className="w-full aspect-[16/9] lg:aspect-[16/10] bg-zinc-900 rounded-[2.5rem] border border-white/5 shadow-[0_80px_160px_rgba(0,0,0,0.8)] overflow-hidden relative animate-in zoom-in-95 duration-1000 fill-mode-both group">
              
              <iframe 
                src={`${displayUrl}#toolbar=0&navpanes=0&scrollbar=0&view=Fit`} 
                className="h-full w-full border-0 bg-zinc-900 transition-opacity duration-1000"
                title="Strategic Pitch Deck"
                allowFullScreen
              />

              {/* Landscape Branding Overlays */}
              <div className="absolute inset-0 pointer-events-none border-[1px] border-white/10 rounded-[2.5rem] z-20" />
              
              <div className="absolute bottom-10 right-10 z-40 bg-black/60 backdrop-blur-2xl px-6 py-4 rounded-2xl border border-white/10 shadow-2xl">
                 <div className="flex items-center gap-4">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_12px_#10b981]" />
                    <div className="flex flex-col">
                       <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500">Ultra HD Single-Slide</span>
                       <span className="text-[11px] font-bold text-white/60 tracking-tight">Presentation Engine 2.0</span>
                    </div>
                 </div>
              </div>

              {/* Interaction Overlay - Presentation Feeling */}
              <div className="absolute inset-0 flex items-center justify-between px-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10">
                 <div className="px-6 py-3 rounded-full bg-white/5 backdrop-blur-3xl border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] text-white/30">
                    ESC to Exit
                 </div>
                 <div className="flex flex-col items-center gap-4">
                    <div className="h-10 w-[1px] bg-gradient-to-b from-transparent via-white/20 to-transparent" />
                    <div className="px-8 py-3 rounded-full bg-primary/20 backdrop-blur-3xl border border-primary/30 text-[11px] font-black uppercase tracking-[0.4em] text-primary shadow-[0_0_40px_rgba(var(--primary),0.2)]">
                       Scroll for Next Cinematic Slide
                    </div>
                    <div className="h-10 w-[1px] bg-gradient-to-b from-transparent via-white/20 to-transparent" />
                 </div>
                 <div className="px-6 py-3 rounded-full bg-white/5 backdrop-blur-3xl border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] text-white/30">
                    {cloudUrl ? "Sync Active" : "Local Mode"}
                 </div>
              </div>
              
              {/* Subtle branding footer inside viewer */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none opacity-20 flex items-center gap-6 z-30">
                <div className="h-[1px] w-12 bg-white/20" />
                <span className="text-[9px] font-black uppercase tracking-[0.6em] text-white/40">Strategic Digital Transformation Vision 2026</span>
                <div className="h-[1px] w-12 bg-white/20" />
              </div>
           </div>
        </div>

        {/* Global Landscape Instruction */}
        <div className="mt-8 text-center animate-in fade-in slide-in-from-bottom-2 duration-1000 opacity-40">
           <p className="text-[11px] uppercase tracking-[0.5em] font-black text-white italic">
              Experience the future in full-screen landscape
           </p>
        </div>
      </div>
    </DocumentLayout>
  );
};
export default PitchDeckPage;
