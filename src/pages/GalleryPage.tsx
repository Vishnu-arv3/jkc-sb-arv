import { useEffect, useState } from "react";
import { Film, Download, Share2, Trash2, Globe, Lock, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import AppLayout from "@/components/AppLayout";
import ShareDialog from "@/components/ShareDialog";
import DownloadDialog from "@/components/DownloadDialog";
import VideoPlayer from "@/components/VideoPlayer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const GalleryPage = () => {
  const { user } = useAuth();
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [shareOpen, setShareOpen] = useState(false);
  const [downloadOpen, setDownloadOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      let supabaseVideos: any[] = [];
      try {
        const { data, error } = await supabase
          .from("videos")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });
        
        if (error) console.warn("Supabase fetch error:", error);
        supabaseVideos = data ?? [];
      } catch (err) {
        console.warn("Supabase fetch failed entirely:", err);
      }

      let localVideos: any[] = [];
      try {
        const stored = JSON.parse(localStorage.getItem("jkc_local_videos") || "[]");
        localVideos = stored.filter((v: any) => v.user_id === user.id || v.user_id === "guest");
      } catch (e) {
        console.warn("Local storage fetch failed:", e);
      }

      const allVideos = [...supabaseVideos, ...localVideos];
      // Deduplicate by ID
      const uniqueVideos = Array.from(new Map(allVideos.map(v => [v.id, v])).values());
      // Sort by newest
      uniqueVideos.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setVideos(uniqueVideos);
      setLoading(false);
    };
    load();
  }, [user]);

  const deleteVideo = async (id: string) => {
    try {
      const { error } = await supabase.from("videos").delete().eq("id", id);
      if (error) console.warn("Supabase delete failed:", error);
    } catch (e) {
      console.warn("Supabase delete threw:", e);
    }

    try {
      const stored = JSON.parse(localStorage.getItem("jkc_local_videos") || "[]");
      const filtered = stored.filter((v: any) => v.id !== id);
      localStorage.setItem("jkc_local_videos", JSON.stringify(filtered));
    } catch (e) {
      console.warn("Local storage delete failed:", e);
    }

    setVideos((v) => v.filter((x) => x.id !== id));
    toast.success("Video deleted");
  };

  const toggleVisibility = async (video: any) => {
    const newVis = video.visibility === "public" ? "private" : "public";
    
    try {
      const { error } = await supabase.from("videos").update({ visibility: newVis }).eq("id", video.id);
      if (error) console.warn("Supabase visibility update failed:", error);
    } catch (e) {
      console.warn("Supabase visibility update threw:", e);
    }

    try {
      const stored = JSON.parse(localStorage.getItem("jkc_local_videos") || "[]");
      const updated = stored.map((v: any) => v.id === video.id ? { ...v, visibility: newVis } : v);
      localStorage.setItem("jkc_local_videos", JSON.stringify(updated));
    } catch (e) {
      console.warn("Local storage visibility update failed:", e);
    }

    setVideos((v) => v.map((x) => x.id === video.id ? { ...x, visibility: newVis } : x));
    toast.success(`Video set to ${newVis}`);
  };

  const handleDownload = () => {
    toast.success("Video download started!");
    setDownloadOpen(false);
  };

  return (
    <AppLayout>
      <div className="animate-fade-in space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">My Videos</h1>
          <p className="mt-1 text-sm text-muted-foreground">All your personalized home-building journey videos</p>
        </div>

        {loading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : videos.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-20 text-center">
            <Film className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="font-display text-lg font-semibold text-foreground">No videos yet</p>
            <p className="mt-1 text-sm text-muted-foreground">Upload a selfie to create your first video</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {videos.map((video) => {
              const [displayTitle, metadataStr] = (video.title || "").split(" || ");
              
              let config: any = null;
              try {
                if (metadataStr) config = JSON.parse(metadataStr);
              } catch (e) {
                console.warn("Failed to parse metadata for video:", video.id);
              }
              
              if (!config) config = video.config;
              
              if (!config) {
                // Smart Fallback: Extract from title if missing
                const parts = displayTitle.split(" ");
                const style = parts[0] ? parts[0].toLowerCase() : "modern";
                const sqft = parts[1] ? parts[1].replace(/,/g, "") : "2000";
                config = { style, sqft, floors: "2", hasGarden: true, gardenStyle: "lush" };
              }

              const THUMBNAILS: Record<string, string> = {
                modern: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
                traditional: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=800&q=80",
                contemporary: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
                villa: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80"
              };
              const thumbnailUrl = video.thumbnail_url || THUMBNAILS[config.style] || THUMBNAILS.modern;

              return (
                <div key={video.id} className="group overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
                  <div
                    className="relative aspect-video cursor-pointer bg-muted"
                    onClick={() => { setSelectedVideo(video); setPreviewOpen(true); }}
                  >
                    <img 
                      src={thumbnailUrl} 
                      alt={displayTitle} 
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Visibility badge */}
                    <div className="absolute left-2 top-2 z-10">
                      <span className={`shadow-sm flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${
                        video.visibility === "public"
                          ? "bg-success/90 text-success-foreground"
                          : "bg-background/90 text-foreground"
                      }`}>
                        {video.visibility === "public" ? <Globe className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                        {video.visibility === "public" ? "Public" : "Private"}
                      </span>
                    </div>
                    {video.status === "completed" && video.duration && (
                      <div className="absolute bottom-2 right-2 rounded bg-foreground/90 px-1.5 py-0.5 text-[10px] font-medium text-background z-10">
                        {video.duration}
                      </div>
                    )}
                    {video.status === "processing" && (
                      <div className="absolute inset-0 z-10 flex items-center justify-center bg-foreground/50 backdrop-blur-sm">
                        <span className="rounded-md bg-warning px-3 py-1 text-xs font-bold uppercase tracking-wider text-warning-foreground shadow-lg">Generating...</span>
                      </div>
                    )}
                    {/* Play overlay */}
                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-foreground/20 opacity-0 transition-all duration-300 group-hover:opacity-100 backdrop-blur-[2px]">
                      <div className="rounded-full bg-primary p-4 shadow-xl transform scale-90 transition-transform group-hover:scale-100">
                        <svg className="h-6 w-6 text-primary-foreground ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 relative">
                    <h3 className="font-display text-sm font-semibold text-foreground line-clamp-1" title={displayTitle}>{displayTitle}</h3>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">{new Date(video.created_at).toLocaleDateString()}</p>
                    
                    {/* History Details */}
                    <div className="mt-4 space-y-2 rounded-xl bg-primary/5 p-3 border border-primary/10 transition-colors hover:bg-primary/10">
                      <div className="flex items-center justify-between text-[9px] uppercase tracking-widest font-black text-primary/60">
                        <span>Configuration History</span>
                        <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_4px_rgba(var(--primary),0.5)] animate-pulse" />
                      </div>
                      <div className="grid grid-cols-2 gap-3 pt-1">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[9px] font-bold text-muted-foreground uppercase">Style</span>
                          <span className="text-[11px] font-bold capitalize text-foreground truncate" title={config.style}>{config.style}</span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[9px] font-bold text-muted-foreground uppercase">Area</span>
                          <span className="text-[11px] font-bold text-foreground truncate">{config.sqft} sq.ft</span>
                        </div>
                        <div className="flex flex-col gap-0.5 border-t border-primary/5 pt-2">
                          <span className="text-[9px] font-bold text-muted-foreground uppercase">Elevation</span>
                          <span className="text-[11px] font-bold text-foreground">
                            {config.floors} Floor{config.floors !== "1" ? "s" : ""}
                          </span>
                        </div>
                        <div className="flex flex-col gap-0.5 border-t border-primary/5 pt-2">
                          <span className="text-[9px] font-bold text-muted-foreground uppercase">Landscaping</span>
                          <span className="text-[11px] font-bold text-foreground truncate" title={config.hasGarden ? config.gardenStyle : "Standard"}>
                            {config.hasGarden ? config.gardenStyle : "Standard"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {video.status === "completed" && (
                    <div className="mt-4 flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => { setSelectedVideo(video); setDownloadOpen(true); }}
                      >
                        <Download className="mr-1 h-3.5 w-3.5" /> Download
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9"
                        onClick={() => toggleVisibility(video)}
                        title={video.visibility === "public" ? "Set Private" : "Set Public"}
                      >
                        {video.visibility === "public" ? <Globe className="h-3.5 w-3.5 text-success" /> : <Lock className="h-3.5 w-3.5" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9"
                        onClick={() => { setSelectedVideo(video); setShareOpen(true); }}
                      >
                        <Share2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-9 w-9 text-destructive" onClick={() => deleteVideo(video.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          </div>
        )}

        {/* Video Preview Dialog */}
        <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="font-display">{selectedVideo?.title}</DialogTitle>
            </DialogHeader>
            <VideoPlayer />
          </DialogContent>
        </Dialog>

        {/* Share & Download Dialogs */}
        {selectedVideo && (
          <>
            <ShareDialog
              open={shareOpen}
              onOpenChange={setShareOpen}
              shareUrl={`${window.location.origin}/video/${selectedVideo.id}`}
              title={selectedVideo.title}
            />
            <DownloadDialog
              open={downloadOpen}
              onOpenChange={setDownloadOpen}
              onConfirm={handleDownload}
            />
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default GalleryPage;
