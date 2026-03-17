import { Film, Download, Share2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import AppLayout from "@/components/AppLayout";

const videos = [
  { id: 1, title: "Dream Home Journey", date: "Mar 15, 2026", duration: "1:32", status: "completed" as const },
  { id: 2, title: "Foundation to Finish", date: "Mar 12, 2026", duration: "1:45", status: "completed" as const },
  { id: 3, title: "My Home Story", date: "Mar 10, 2026", duration: "—", status: "processing" as const },
];

const GalleryPage = () => {
  return (
    <AppLayout>
      <div className="animate-fade-in space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">My Videos</h1>
          <p className="mt-1 text-sm text-muted-foreground">All your personalized home-building journey videos</p>
        </div>

        {videos.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-20 text-center">
            <Film className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="font-display text-lg font-semibold text-foreground">No videos yet</p>
            <p className="mt-1 text-sm text-muted-foreground">Upload a selfie to create your first video</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {videos.map((video) => (
              <div key={video.id} className="group overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
                {/* Thumbnail */}
                <div className="relative aspect-video bg-muted">
                  <div className="flex h-full items-center justify-center">
                    <Film className="h-8 w-8 text-muted-foreground" />
                  </div>
                  {video.status === "completed" && (
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
                {/* Info */}
                <div className="p-4">
                  <h3 className="font-display text-sm font-semibold text-foreground">{video.title}</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">{video.date}</p>
                  {video.status === "completed" && (
                    <div className="mt-3 flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Download className="mr-1 h-3.5 w-3.5" /> Download
                      </Button>
                      <Button variant="ghost" size="icon" className="h-9 w-9">
                        <Share2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-9 w-9 text-destructive">
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
