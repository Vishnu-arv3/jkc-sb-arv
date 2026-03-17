import { useState, useRef, useCallback } from "react";
import { Upload as UploadIcon, Camera, X, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import AppLayout from "@/components/AppLayout";

const stages = [
  { label: "Analyzing Face", desc: "Detecting facial features..." },
  { label: "Building Foundation", desc: "Preparing the construction site..." },
  { label: "Constructing Walls", desc: "Raising the structure..." },
  { label: "Interior Design", desc: "Adding finishing touches..." },
  { label: "Rendering Video", desc: "Compositing final output..." },
];

const UploadPage = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [currentStage, setCurrentStage] = useState(0);
  const [completed, setCompleted] = useState(false);
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

  const handleGenerate = () => {
    setProcessing(true);
    setCurrentStage(0);
    setCompleted(false);

    // Simulate stages
    let stage = 0;
    const interval = setInterval(() => {
      stage++;
      if (stage >= stages.length) {
        clearInterval(interval);
        setTimeout(() => {
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
    setProcessing(false);
    setCurrentStage(0);
    setCompleted(false);
  };

  return (
    <AppLayout>
      <div className="animate-fade-in space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Create Personalized Video</h1>
          <p className="mt-1 text-sm text-muted-foreground">Upload your selfie to begin your home-building journey</p>
        </div>

        <div className="mx-auto max-w-2xl">
          {/* Upload Zone */}
          {!preview && !processing && !completed && (
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileRef.current?.click()}
              className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-card p-16 text-center transition-colors hover:border-primary/50 hover:bg-muted/50"
            >
              <div className="mb-4 rounded-full bg-primary/10 p-4">
                <Camera className="h-8 w-8 text-primary" />
              </div>
              <p className="font-display text-lg font-semibold text-foreground">Upload Your Selfie</p>
              <p className="mt-1 text-sm text-muted-foreground">Drag & drop or click to browse</p>
              <p className="mt-3 text-xs text-muted-foreground">JPG, PNG • Max 10MB • Clear face visible</p>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              />
            </div>
          )}

          {/* Preview */}
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
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={reset}>
                  Choose Another
                </Button>
                <Button variant="hero" className="flex-1" onClick={handleGenerate}>
                  <UploadIcon className="mr-2 h-4 w-4" />
                  Generate Video
                </Button>
              </div>
            </div>
          )}

          {/* Processing */}
          {processing && (
            <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
              <div className="mb-6 text-center">
                <Loader2 className="mx-auto mb-3 h-8 w-8 animate-spin text-primary" />
                <p className="font-display text-lg font-bold text-foreground">Building Your Video</p>
                <p className="mt-1 text-sm text-muted-foreground">This may take 2-5 minutes</p>
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
              {/* Progress bar */}
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
              <div className="rounded-xl border border-border bg-card p-8 text-center shadow-sm">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
                  <CheckCircle2 className="h-8 w-8 text-success" />
                </div>
                <h2 className="font-display text-xl font-bold text-foreground">Video Ready!</h2>
                <p className="mt-1 text-sm text-muted-foreground">Your personalized home-building journey video has been generated.</p>

                {/* Placeholder video */}
                <div className="mx-auto mt-6 aspect-video max-w-lg overflow-hidden rounded-lg bg-muted">
                  <div className="flex h-full items-center justify-center">
                    <p className="text-sm text-muted-foreground">🎬 Video Preview</p>
                  </div>
                </div>

                <div className="mt-6 flex justify-center gap-3">
                  <Button variant="hero">Download Video</Button>
                  <Button variant="outline">Share</Button>
                </div>
              </div>
              <Button variant="ghost" className="w-full" onClick={reset}>
                Create Another Video
              </Button>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default UploadPage;
