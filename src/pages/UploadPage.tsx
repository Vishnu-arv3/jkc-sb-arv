import { useState, useRef, useCallback } from "react";
import { Upload as UploadIcon, Camera, X, CheckCircle2, Loader2, ImageIcon, ChevronLeft, ChevronRight, Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import AppLayout from "@/components/AppLayout";
import CameraCapture from "@/components/CameraCapture";
import QualitySelector from "@/components/QualitySelector";
import DreamHomeConfig, { DreamHomeOptions } from "@/components/DreamHomeConfig";
import ShareDialog from "@/components/ShareDialog";
import DownloadDialog from "@/components/DownloadDialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const stages = [
  { label: "Uploading Selfie", desc: "Securely processing your photo..." },
  { label: "Analyzing Preferences", desc: "Designing your dream home layout..." },
  { label: "Generating Exterior", desc: "Creating exterior visualizations..." },
  { label: "Designing Interiors", desc: "Crafting interior room designs..." },
  { label: "Final Composition", desc: "Compositing your personalized video..." },
];

type FlowStep = "upload" | "config" | "processing" | "completed";

const UploadPage = () => {
  const { user } = useAuth();
  const [preview, setPreview] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [flowStep, setFlowStep] = useState<FlowStep>("upload");
  const [currentStage, setCurrentStage] = useState(0);
  const [quality, setQuality] = useState<"sd" | "hd">("hd");
  const [shareOpen, setShareOpen] = useState(false);
  const [downloadOpen, setDownloadOpen] = useState(false);
  const [generatedVideoId, setGeneratedVideoId] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<{ view: string; imageUrl: string }[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [homeConfig, setHomeConfig] = useState<DreamHomeOptions | null>(null);
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

  const handleProceedToConfig = () => {
    setFlowStep("config");
  };

  const handleGenerate = async (config: DreamHomeOptions) => {
    setHomeConfig(config);
    setFlowStep("processing");
    setCurrentStage(0);
    setGeneratedImages([]);

    // Save video record to DB
    let videoId: string | null = null;
    if (user) {
      const title = `${config.style.charAt(0).toUpperCase() + config.style.slice(1)} ${config.sqft.toLocaleString()} sq.ft Dream Home`;
      const { data } = await supabase
        .from("videos")
        .insert({ user_id: user.id, title, status: "processing" })
        .select("id")
        .single();
      videoId = data?.id ?? null;
      setGeneratedVideoId(videoId);
    }

    // Simulate stage progression while calling AI
    let stage = 0;
    const stageInterval = setInterval(() => {
      stage++;
      if (stage < stages.length) {
        setCurrentStage(stage);
      }
    }, 3000);

    try {
      // Call the edge function to generate images
      const { data, error } = await supabase.functions.invoke("generate-dream-home", {
        body: {
          config,
          selfieBase64: preview,
        },
      });

      clearInterval(stageInterval);

      if (error) {
        toast.error("Failed to generate dream home. Please try again.");
        console.error("Generation error:", error);
        setFlowStep("config");
        return;
      }

      if (data?.error) {
        toast.error(data.error);
        setFlowStep("config");
        return;
      }

      const images = data?.images || [];
      setGeneratedImages(images);

      // Update DB record
      if (videoId && user) {
        await supabase
          .from("videos")
          .update({
            status: "completed",
            duration: `${images.length * 5}s`,
          })
          .eq("id", videoId);
      }

      // Complete all stages
      setCurrentStage(stages.length - 1);
      setTimeout(() => {
        setFlowStep("completed");
        toast.success("Your dream home video is ready!");
      }, 1000);
    } catch (err) {
      clearInterval(stageInterval);
      console.error("Generation error:", err);
      toast.error("Something went wrong. Please try again.");
      setFlowStep("config");
    }
  };

  const reset = () => {
    setPreview(null);
    setShowCamera(false);
    setFlowStep("upload");
    setCurrentStage(0);
    setGeneratedVideoId(null);
    setGeneratedImages([]);
    setCurrentImageIndex(0);
    setHomeConfig(null);
  };

  const handleDownload = () => {
    toast.success("Video download started!");
    setDownloadOpen(false);
  };

  const shareUrl = generatedVideoId
    ? `${window.location.origin}/video/${generatedVideoId}`
    : window.location.href;

  const viewLabels: Record<string, string> = {
    exterior_front: "Front Exterior",
    exterior_aerial: "Aerial View",
    living_room: "Living Room",
    bedroom: "Master Bedroom",
    kitchen: "Kitchen",
    bathroom: "Bathroom",
  };

  return (
    <AppLayout>
      <div className="animate-fade-in space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Create Your Dream Home</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {flowStep === "upload" && "Upload or take a selfie to begin"}
            {flowStep === "config" && "Customize your dream home design"}
            {flowStep === "processing" && "Generating your personalized visualization"}
            {flowStep === "completed" && "Your dream home is ready!"}
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2">
          {["Upload Photo", "Configure Home", "Generate", "View Results"].map((step, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                i < ["upload", "config", "processing", "completed"].indexOf(flowStep)
                  ? "bg-success text-success-foreground"
                  : i === ["upload", "config", "processing", "completed"].indexOf(flowStep)
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}>
                {i < ["upload", "config", "processing", "completed"].indexOf(flowStep) ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  i + 1
                )}
              </div>
              <span className={`hidden text-xs sm:inline ${
                i <= ["upload", "config", "processing", "completed"].indexOf(flowStep) ? "text-foreground" : "text-muted-foreground"
              }`}>
                {step}
              </span>
              {i < 3 && <div className="h-px w-4 bg-border sm:w-8" />}
            </div>
          ))}
        </div>

        <div className="mx-auto max-w-2xl">
          {/* Step 1: Upload */}
          {flowStep === "upload" && !preview && !showCamera && (
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
                <div className="rounded-full bg-secondary/10 p-4">
                  <ImageIcon className="h-8 w-8 text-secondary" />
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
          {flowStep === "upload" && showCamera && !preview && (
            <CameraCapture
              onCapture={(dataUrl) => { setPreview(dataUrl); setShowCamera(false); }}
              onClose={() => setShowCamera(false)}
            />
          )}

          {/* Preview after upload */}
          {flowStep === "upload" && preview && (
            <div className="space-y-4">
              <div className="relative overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                <img src={preview} alt="Selfie preview" className="mx-auto max-h-80 object-contain p-4" />
                <button
                  onClick={() => { setPreview(null); }}
                  className="absolute right-3 top-3 rounded-full bg-foreground/80 p-1.5 text-background transition-colors hover:bg-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <QualitySelector value={quality} onChange={setQuality} />

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setPreview(null)}>
                  Choose Another
                </Button>
                <Button variant="hero" className="flex-1" onClick={handleProceedToConfig}>
                  Next: Design Your Home →
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Dream Home Config */}
          {flowStep === "config" && (
            <DreamHomeConfig
              onSubmit={handleGenerate}
              onBack={() => setFlowStep("upload")}
            />
          )}

          {/* Step 3: Processing */}
          {flowStep === "processing" && (
            <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
              <div className="mb-6 text-center">
                <Loader2 className="mx-auto mb-3 h-8 w-8 animate-spin text-primary" />
                <p className="font-display text-lg font-bold text-foreground">
                  Building Your Dream Home
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  AI is generating {homeConfig?.views.length || 0} views of your {homeConfig?.sqft.toLocaleString()} sq.ft {homeConfig?.style} home
                </p>
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

          {/* Step 4: Completed - Image Gallery */}
          {flowStep === "completed" && (
            <div className="space-y-4">
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <div className="mb-4 text-center">
                  <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-success/10">
                    <CheckCircle2 className="h-7 w-7 text-success" />
                  </div>
                  <h2 className="font-display text-xl font-bold text-foreground">Your Dream Home is Ready!</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {homeConfig?.style && `${homeConfig.style.charAt(0).toUpperCase() + homeConfig.style.slice(1)} `}
                    {homeConfig?.sqft.toLocaleString()} sq.ft • {homeConfig?.floors} floor{(homeConfig?.floors || 0) > 1 ? "s" : ""}
                    {homeConfig?.hasGarden ? ` • ${homeConfig.gardenStyle} garden` : ""}
                  </p>
                </div>

                {/* Selfie + Generated Images Gallery */}
                <div className="space-y-4">
                  {/* User selfie thumbnail */}
                  {preview && (
                    <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
                      <img src={preview} alt="Your selfie" className="h-12 w-12 rounded-full object-cover" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Your Personalized Journey</p>
                        <p className="text-xs text-muted-foreground">Built with JK Cement</p>
                      </div>
                    </div>
                  )}

                  {/* Generated Image Viewer */}
                  {generatedImages.length > 0 ? (
                    <div className="relative overflow-hidden rounded-xl bg-muted">
                      <div className="aspect-video flex items-center justify-center">
                        {generatedImages[currentImageIndex]?.imageUrl ? (
                          <img
                            src={generatedImages[currentImageIndex].imageUrl}
                            alt={viewLabels[generatedImages[currentImageIndex].view] || "Dream Home"}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground">
                              🏠 {viewLabels[generatedImages[currentImageIndex]?.view] || "Dream Home View"}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">AI-generated visualization</p>
                          </div>
                        )}
                      </div>

                      {/* Navigation arrows */}
                      {generatedImages.length > 1 && (
                        <>
                          <button
                            onClick={() => setCurrentImageIndex((i) => (i > 0 ? i - 1 : generatedImages.length - 1))}
                            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-foreground/60 p-2 text-background hover:bg-foreground/80"
                          >
                            <ChevronLeft className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => setCurrentImageIndex((i) => (i < generatedImages.length - 1 ? i + 1 : 0))}
                            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-foreground/60 p-2 text-background hover:bg-foreground/80"
                          >
                            <ChevronRight className="h-5 w-5" />
                          </button>
                        </>
                      )}

                      {/* View label */}
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-foreground/70 px-4 py-1.5">
                        <p className="text-xs font-medium text-background">
                          {viewLabels[generatedImages[currentImageIndex]?.view] || "View"} • {currentImageIndex + 1}/{generatedImages.length}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex aspect-video items-center justify-center rounded-xl bg-muted">
                      <p className="text-sm text-muted-foreground">🏠 Dream Home Preview</p>
                    </div>
                  )}

                  {/* Thumbnail strip */}
                  {generatedImages.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {generatedImages.map((img, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentImageIndex(i)}
                          className={`flex-shrink-0 rounded-lg border-2 p-1 transition-all ${
                            i === currentImageIndex ? "border-primary" : "border-transparent hover:border-border"
                          }`}
                        >
                          {img.imageUrl ? (
                            <img
                              src={img.imageUrl}
                              alt={viewLabels[img.view]}
                              className="h-14 w-20 rounded object-cover"
                            />
                          ) : (
                            <div className="flex h-14 w-20 items-center justify-center rounded bg-muted">
                              <span className="text-xs text-muted-foreground">{viewLabels[img.view]?.split(" ")[0]}</span>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-4 flex justify-center gap-3">
                  <Button variant="hero" onClick={() => setDownloadOpen(true)}>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  <Button variant="outline" onClick={() => setShareOpen(true)}>
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                </div>
              </div>
              <Button variant="ghost" className="w-full" onClick={reset}>
                Create Another Dream Home
              </Button>

              <ShareDialog open={shareOpen} onOpenChange={setShareOpen} shareUrl={shareUrl} />
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
