import { useRef } from "react";
import { BarChart3, ArrowLeft, Printer, ExternalLink, Info, Sun, Moon } from "lucide-react";
import DocumentLayout from "@/components/DocumentLayout";
import { Link } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";

const SupportingAnalysisPage = () => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();

  const handlePrint = () => {
    const iframe = document.querySelector('iframe');
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.print();
    }
  };

  return (
    <DocumentLayout title="Supporting Analysis">
      <div className="min-h-screen bg-background flex flex-col transition-colors duration-500">
        
        {/* Unified Header */}
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl px-6 py-4 animate-in slide-in-from-top-4 duration-700">
          <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Link to="/dashboard" className="group flex h-10 w-10 items-center justify-center rounded-full bg-muted/50 text-foreground transition-all hover:scale-110">
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              </Link>
              <div className="h-8 w-px bg-border mx-1 hidden sm:block" />
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-white shadow-lg shadow-secondary/20">
                  <BarChart3 size={20} />
                </div>
                <div>
                   <h1 className="text-sm font-bold text-foreground tracking-tight">Market Research & Technical Feasibility</h1>
                   <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Strategic Analysis v1.4</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-1.5 p-1 bg-muted/50 rounded-2xl">
                <button onClick={handlePrint} className="p-2.5 hover:bg-background rounded-xl transition-all text-muted-foreground hover:text-primary active:scale-95" title="Print Document">
                  <Printer size={20} />
                </button>
                <button onClick={() => window.open("/supporting analysis document.html", "_blank")} className="p-2.5 hover:bg-background rounded-xl transition-all text-muted-foreground hover:text-primary active:scale-95" title="Open Original">
                  <ExternalLink size={20} />
                </button>
              </div>

              <div className="w-px h-6 bg-border mx-1 hidden sm:block" />
              
              {/* Theme Toggle Button - Integrated in Header */}
              <button 
                onClick={toggleTheme}
                className="flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-foreground/10"
              >
                {theme === "light" ? <Moon size={16} fill="currentColor" /> : <Sun size={16} fill="currentColor" />}
                <span className="hidden xs:inline">{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
              </button>
            </div>
          </div>
        </header>

        {/* Immersive Document Content (No outer border) */}
        <main className="flex-1 w-full bg-zinc-100 dark:bg-zinc-950/50 p-4 sm:p-12 flex justify-center transition-colors duration-500">
          <div className="w-full max-w-5xl bg-white shadow-[0_20px_70px_rgba(0,0,0,0.15)] rounded-sm overflow-hidden animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300 fill-mode-both">
            <iframe 
              src="/supporting analysis document.html" 
              className="min-h-[2200px] w-full border-0 bg-white"
              title="Supporting Analysis Fullscreen Viewer"
            />
          </div>
        </main>

        {/* Clean Footer */}
        <footer className="w-full px-8 py-4 bg-background border-t border-border flex items-center justify-between text-[10px] text-muted-foreground font-bold uppercase tracking-[0.3em] transition-colors duration-500">
           <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
              <span>Confidential Business Data</span>
           </div>
           <p className="hidden md:block">JKCEMENT STRATEGIC ANALYSIS • 2026</p>
        </footer>
      </div>
    </DocumentLayout>
  );
};

export default SupportingAnalysisPage;
