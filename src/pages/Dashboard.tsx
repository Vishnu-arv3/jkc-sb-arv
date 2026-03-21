import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, Film, TrendingUp, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import AppLayout from "@/components/AppLayout";
import TutorialOverlay from "@/components/TutorialOverlay";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [videoCount, setVideoCount] = useState(0);
  const [recentVideos, setRecentVideos] = useState<any[]>([]);
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data, count } = await supabase
        .from("videos")
        .select("*", { count: "exact" })
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);
      setVideoCount(count ?? 0);
      setRecentVideos(data ?? []);

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("has_seen_tutorial")
        .eq("user_id", user.id)
        .maybeSingle(); // Use maybeSingle to avoid error if missing
        
      if (profileError) {
        console.warn("Error fetching tutorial status:", profileError);
      }
      
      // Show tutorial if no profile exists yet OR if they haven't seen it
      if (!profileData || profileData.has_seen_tutorial === false) {
        setShowTutorial(true);
      }
    };
    load();
  }, [user]);
 
  const dismissTutorial = async () => {
    setShowTutorial(false);
    if (user) {
      // Use upsert to create profile if it doesn't exist
      await supabase
        .from("profiles")
        .upsert({ 
          user_id: user.id, 
          has_seen_tutorial: true,
          display_name: user.user_metadata?.full_name || user.email?.split("@")[0]
        }, { onConflict: 'user_id' });
    }
  };

  const stats = [
    { label: "Videos Created", value: String(videoCount), icon: Film, color: "text-primary" },
    { label: "Total Views", value: "—", icon: TrendingUp, color: "text-secondary" },
    { label: "Avg. Generation", value: "~3m", icon: Clock, color: "text-warning" },
    { label: "Uploads", value: String(videoCount), icon: Upload, color: "text-muted-foreground" },
  ];

  return (
    <AppLayout>
      {showTutorial && <TutorialOverlay onComplete={dismissTutorial} />}

      <div className="animate-fade-in space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              Welcome back, {profile?.display_name || user?.email?.split("@")[0] || "User"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">Create personalized home-building journey videos</p>
          </div>
          <Button variant="hero" size="lg" onClick={() => navigate("/upload")}>
            <Upload className="mr-2 h-4 w-4" />
            Create New Video
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground sm:text-sm">{label}</p>
                  <p className="mt-1 font-display text-2xl font-bold text-foreground">{value}</p>
                </div>
                <div className={`rounded-xl bg-muted p-2.5 ${color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-8 shadow-sm">
          <div className="relative z-10">
            <h2 className="font-display text-xl font-bold text-foreground">Start Your Home-Building Journey</h2>
            <p className="mt-2 max-w-lg text-sm text-muted-foreground">
              Upload your selfie and watch as AI creates a personalized video of your dream home being built from foundation to finish.
            </p>
            <Button variant="hero" className="mt-4" onClick={() => navigate("/upload")}>
              Upload Selfie & Generate
            </Button>
          </div>
          <div className="absolute -right-4 -top-4 h-32 w-32 rounded-full bg-primary/8" />
          <div className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-secondary/8" />
        </div>

        {/* Recent Videos */}
        <div>
          <h2 className="mb-4 font-display text-lg font-bold text-foreground">Recent Videos</h2>
          {recentVideos.length === 0 ? (
            <p className="text-sm text-muted-foreground">No videos yet. Create your first one!</p>
          ) : (
            <div className="space-y-3">
              {recentVideos.map((video) => (
                <div key={video.id} className="flex items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-20 items-center justify-center rounded-xl bg-muted">
                      <Film className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{video.title}</p>
                      <p className="text-xs text-muted-foreground">{new Date(video.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className={`rounded-lg px-2.5 py-1 text-xs font-medium ${
                    video.status === "completed" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                  }`}>
                    {video.status === "completed" ? "Completed" : "Processing"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
