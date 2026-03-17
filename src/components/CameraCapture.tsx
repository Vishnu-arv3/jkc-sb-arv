import { useRef, useState, useCallback, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CameraCaptureProps {
  onCapture: (dataUrl: string) => void;
  onClose: () => void;
}

const CameraCapture = ({ onCapture, onClose }: CameraCaptureProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch {
      setError("Camera access denied. Please allow camera permissions.");
    }
  }, []);

  useEffect(() => {
    startCamera();
    return () => {
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const capture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    stream?.getTracks().forEach((t) => t.stop());
    onCapture(dataUrl);
  };

  const handleClose = () => {
    stream?.getTracks().forEach((t) => t.stop());
    onClose();
  };

  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <button
        onClick={handleClose}
        className="absolute right-3 top-3 z-10 rounded-full bg-foreground/80 p-1.5 text-background transition-colors hover:bg-foreground"
      >
        <X className="h-4 w-4" />
      </button>

      {error ? (
        <div className="flex h-80 items-center justify-center p-8 text-center">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      ) : (
        <>
          <div className="relative flex items-center justify-center bg-foreground/5">
            {/* Oval guide overlay */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="h-56 w-44 rounded-full border-2 border-dashed border-primary/50" />
            </div>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="max-h-80 w-full object-cover"
              style={{ transform: "scaleX(-1)" }}
            />
          </div>
          <p className="py-2 text-center text-xs text-muted-foreground">
            Position your face in the oval
          </p>
          <div className="p-4 pt-0">
            <Button variant="hero" className="w-full" onClick={capture}>
              Take Selfie
            </Button>
          </div>
        </>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraCapture;
