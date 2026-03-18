import { useState, useRef, useCallback } from "react";
import { Upload as UploadIcon, Camera, X, CheckCircle2, Loader2, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import AppLayout from "@/components/AppLayout";
import CameraCapture from "@/components/CameraCapture";
import QualitySelector from "@/components/QualitySelector";
import VideoPlayer from "@/components/VideoPlayer";
import ShareDialog from "@/components/ShareDialog";
import DownloadDialog from "@/components/DownloadDialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const stages = [
  { label: "Analyzing Face", desc: "Detecting facial features..." },
  { label: "Building Foundation", desc: "Preparing the construction site..." },
  { label: "Constructing Walls", desc: "Raising the structure..." },
  { label: "Interior Design", desc: "Adding finishing touches..." },
  { label: "Rendering Video", desc: "Compositing final output..." },
];

const UploadPage = () => {
  const { user } = useAuth();
  const [preview, setPreview] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [currentStage, setCurrentStage] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [quality, setQuality] = useState<"sd" | "hd">("hd");
  const [shareOpen, setShareOpen] = useState(false);
  const [downloadOpen, setDownloadOpen] = useState(false);
  const [generatedVideoId, setGeneratedVideoId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleGenerate = async () => {
    setProcessing(true);
    setCurrentStage(0);
    setCompleted(false);

    // Save video record to DB
    let videoId: string | null = null;
    if (user) {
      const { data } = await supabase
        .from("videos")
        .insert({ user_id: user.id, title: "My Home Journey", status: "processing" })
        .select("id")
        .single();
      videoId = data?.id ?? null;
      setGeneratedVideoId(videoId);
    }

    let stage = 0;
    const interval = setInterval(async () => {
      stage++;
      if (stage >= stages.length) {
        clearInterval(interval);
        setTimeout(async () => {
          // Mark completed in DB
          if (videoId && user) {
            await supabase
              .from("videos")
              .update({ status: "completed", duration: quality === "hd" ? "2:30" : "2:00" })
              .eq("id", videoId);
          }
          setProcessing(false);
          setCompleted(true);
        }, 1500);
      } else {
        setCurrentStage(stage);
      }
    }, 2500);
  };

  const reset = () => {
    setPreview(null);
    setShowCamera(false);
    setProcessing(false);
    setCurrentStage(0);
    setCompleted(false);
    setGeneratedVideoId(null);
  };

  const handleDownload = () => {
    toast.success("Video download started!");
    setDownloadOpen(false);
  };

  const shareUrl = generatedVideoId
    ? `${window.location.origin}/video/${generatedVideoId}`
    : window.location.href;

  return (
    <AppLayout>
      <div className="animate-fade-in space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Create Personalized Video</h1>
          <p className="mt-1 text-sm text-muted-foreground">Upload or take a selfie to begin your home-building journey</p>
        </div>

        <div className="mx-auto max-w-2xl">
          {/* Upload / Camera selection zone */}
          {!preview && !showCamera && !processing && !completed && (
            <div className="space-y-4">
              <button
                onClick={() => setShowCamera(true)}
                className="flex w-full cursor-pointer items-center gap-4 rounded-xl border-2 border-dashed border-border bg-card p-8 text-left transition-colors hover:border-primary/50 hover:bg-muted/50"
              >
                <div className="rounded-full bg-primary/10 p-4">
                  <Camera className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <p className="font-display text-lg font-semibold text-foreground">Take a Selfie</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">Use your camera to capture a photo</p>
                </div>
              </button>

              <button
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileRef.current?.click()}
                className="flex w-full cursor-pointer items-center gap-4 rounded-xl border-2 border-dashed border-border bg-card p-8 text-left transition-colors hover:border-primary/50 hover:bg-muted/50"
              >
                <div className="rounded-full bg-accent/10 p-4">
                  <ImageIcon className="h-8 w-8 text-accent" />
                </div>
                <div>
                  <p className="font-display text-lg font-semibold text-foreground">Upload Photo</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">Drag & drop or click to browse • JPG, PNG • Max 10MB</p>
                </div>
              </button>

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              />

              <div className="flex items-start gap-2 rounded-lg bg-muted p-3">
                <span className="text-sm">🔒</span>
                <p className="text-xs text-muted-foreground">
                  Your photo is encrypted and securely processed. It will be automatically deleted after video generation.
                </p>
              </div>
            </div>
          )}

          {/* Camera view */}
          {showCamera && !preview && (
            <CameraCapture
              onCapture={(dataUrl) => { setPreview(dataUrl); setShowCamera(false); }}
              onClose={() => setShowCamera(false)}
            />
          )}

          {/* Preview + Quality */}
          {preview && !processing && !completed && (
            <div className="space-y-4">
              <div className="relative overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                <img src={preview} alt="Selfie preview" className="mx-auto max-h-80 object-contain p-4" />
                <button
                  onClick={reset}
                  className="absolute right-3 top-3 rounded-full bg-foreground/80 p-1.5 text-background transition-colors hover:bg-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <QualitySelector value={quality} onChange={setQuality} />

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={reset}>
                  Choose Another
                </Button>
                <Button variant="hero" className="flex-1" onClick={handleGenerate}>
                  <UploadIcon className="mr-2 h-4 w-4" />
                  Generate {quality.toUpperCase()} Video
                </Button>
              </div>
            </div>
          )}

          {/* Processing */}
          {processing && (
            <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
              <div className="mb-6 text-center">
                <Loader2 className="mx-auto mb-3 h-8 w-8 animate-spin text-primary" />
                <p className="font-display text-lg font-bold text-foreground">Building Your {quality.toUpperCase()} Video</p>
                <p className="mt-1 text-sm text-muted-foreground">This may take {quality === "hd" ? "3-5" : "2-3"} minutes</p>
              </div>
              <div className="space-y-3">
                {stages.map((stage, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                      i < currentStage ? "bg-success text-success-foreground"
                        : i === currentStage ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {i < currentStage ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${i <= currentStage ? "text-foreground" : "text-muted-foreground"}`}>
                        {stage.label}
                      </p>
                      {i === currentStage && (
                        <p className="text-xs text-muted-foreground">{stage.desc}</p>
                      )}
                    </div>
                    {i < currentStage && <CheckCircle2 className="h-4 w-4 text-success" />}
                  </div>
                ))}
              </div>
              <div className="mt-6 h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${((currentStage + 1) / stages.length) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Completed */}
          {completed && (
            <div className="space-y-4">
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <div className="mb-4 text-center">
                  <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-success/10">
                    <CheckCircle2 className="h-7 w-7 text-success" />
                  </div>
                  <h2 className="font-display text-xl font-bold text-foreground">Video Ready!</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Your personalized {quality.toUpperCase()} home-building journey video has been generated.</p>
                </div>

                <VideoPlayer />

                <div className="mt-4 flex justify-center gap-3">
                  <Button variant="hero" onClick={() => setDownloadOpen(true)}>
                    Download Video
                  </Button>
                  <Button variant="outline" onClick={() => setShareOpen(true)}>
                    Share
                  </Button>
                </div>
              </div>
              <Button variant="ghost" className="w-full" onClick={reset}>
                Create Another Video
              </Button>

              <ShareDialog
                open={shareOpen}
                onOpenChange={setShareOpen}
                shareUrl={shareUrl}
              />
              <DownloadDialog
                open={downloadOpen}
                onOpenChange={setDownloadOpen}
                onConfirm={handleDownload}
                quality={quality.toUpperCase()}
              />
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default UploadPage;
