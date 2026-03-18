import { useState } from "react";
import { X, Camera, Upload, Film, Share2, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  {
    icon: Camera,
    title: "Take a Selfie or Upload",
    description: "Use your camera to capture a photo or upload an existing one. Make sure your face is clearly visible and well-lit.",
  },
  {
    icon: Film,
    title: "Select Video Quality",
    description: "Choose between SD or HD quality for your personalized video. HD takes slightly longer but looks stunning.",
  },
  {
    icon: Upload,
    title: "Generate Your Video",
    description: "Our AI analyzes your photo and creates a personalized home-building journey video featuring you.",
  },
  {
    icon: Share2,
    title: "Share & Download",
    description: "Download your video, make it public, and share it on social media with #JKCement hashtags!",
  },
];

interface TutorialOverlayProps {
  onComplete: () => void;
}

const TutorialOverlay = ({ onComplete }: TutorialOverlayProps) => {
  const [step, setStep] = useState(0);
  const current = steps[step];
  const Icon = current.icon;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/60 backdrop-blur-sm">
      <div className="relative mx-4 w-full max-w-md animate-fade-in rounded-2xl border border-border bg-card p-8 shadow-2xl">
        <button onClick={onComplete} className="absolute right-4 top-4 text-muted-foreground hover:text-foreground">
          <X className="h-5 w-5" />
        </button>

        {/* Progress dots */}
        <div className="mb-6 flex justify-center gap-2">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all ${i === step ? "w-8 bg-primary" : "w-2 bg-muted"}`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <Icon className="h-8 w-8 text-primary" />
          </div>
          <h3 className="font-display text-xl font-bold text-foreground">{current.title}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{current.description}</p>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setStep(step - 1)}
            disabled={step === 0}
            className="gap-1"
          >
            <ChevronLeft className="h-4 w-4" /> Back
          </Button>

          {step < steps.length - 1 ? (
            <Button variant="hero" size="sm" onClick={() => setStep(step + 1)} className="gap-1">
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button variant="hero" size="sm" onClick={onComplete}>
              Get Started!
            </Button>
          )}
        </div>

        <button onClick={onComplete} className="mt-4 block w-full text-center text-xs text-muted-foreground hover:underline">
          Skip tutorial
        </button>
      </div>
    </div>
  );
};

export default TutorialOverlay;
