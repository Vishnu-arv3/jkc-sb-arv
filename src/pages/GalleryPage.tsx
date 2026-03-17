import { useEffect, useState } from "react";
import { Film, Download, Share2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import AppLayout from "@/components/AppLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const GalleryPage = () => {
  const { user } = useAuth();
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data } = await supabase
        .from("videos")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      setVideos(data ?? []);
      setLoading(false);
    };
    load();
  }, [user]);

  const deleteVideo = async (id: string) => {
    const { error } = await supabase.from("videos").delete().eq("id", id);
    if (error) { toast.error("Failed to delete"); return; }
    setVideos((v) => v.filter((x) => x.id !== id));
    toast.success("Video deleted");
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
            {videos.map((video) => (
              <div key={video.id} className="group overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
                <div className="relative aspect-video bg-muted">
                  <div className="flex h-full items-center justify-center">
                    <Film className="h-8 w-8 text-muted-foreground" />
                  </div>
                  {video.status === "completed" && video.duration && (
                    <div className="absolute bottom-2 right-2 rounded bg-foreground/80 px-1.5 py-0.5 text-xs text-background">
                      {video.duration}
                    </div>
                  )}
                  {video.status === "processing" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-foreground/30">
                      <span className="rounded-md bg-warning px-3 py-1 text-xs font-medium text-warning-foreground">Processing...</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-display text-sm font-semibold text-foreground">{video.title}</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">{new Date(video.created_at).toLocaleDateString()}</p>
                  {video.status === "completed" && (
                    <div className="mt-3 flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Download className="mr-1 h-3.5 w-3.5" /> Download
                      </Button>
                      <Button variant="ghost" size="icon" className="h-9 w-9">
                        <Share2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-9 w-9 text-destructive" onClick={() => deleteVideo(video.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default GalleryPage;
