import { useState, useRef, useCallback, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward } from "lucide-react";

interface VideoPlayerProps {
  src?: string;
  poster?: string;
}

const VideoPlayer = ({ src, poster }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    if (playing) videoRef.current.pause();
    else videoRef.current.play();
    setPlaying(!playing);
  }, [playing]);

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
    setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = pct * videoRef.current.duration;
  };

  const skip = (seconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(0, Math.min(videoRef.current.currentTime + seconds, videoRef.current.duration));
  };

  const fullscreen = () => videoRef.current?.requestFullscreen();

  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onLoaded = () => setDuration(v.duration);
    const onEnded = () => setPlaying(false);
    v.addEventListener("loadedmetadata", onLoaded);
    v.addEventListener("ended", onEnded);
    return () => {
      v.removeEventListener("loadedmetadata", onLoaded);
      v.removeEventListener("ended", onEnded);
    };
  }, []);

  const demoMode = !src;

  return (
    <div className="group relative overflow-hidden rounded-xl bg-foreground/5">
      {demoMode ? (
        <div className="flex aspect-video items-center justify-center bg-muted">
          <p className="text-sm text-muted-foreground">🎬 Demo Video Preview</p>
        </div>
      ) : (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          onTimeUpdate={handleTimeUpdate}
          className="aspect-video w-full object-contain"
          muted={muted}
        />
      )}

      {/* Controls overlay */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/80 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
        {/* Progress bar */}
        <div className="mb-3 cursor-pointer" onClick={!demoMode ? handleSeek : undefined}>
          <div className="h-1.5 w-full rounded-full bg-background/30">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${demoMode ? 35 : progress}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={() => skip(-10)} className="text-background/80 hover:text-background" disabled={demoMode}>
              <SkipBack className="h-4 w-4" />
            </button>
            <button
              onClick={demoMode ? undefined : togglePlay}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground"
            >
              {playing ? <Pause className="h-4 w-4" /> : <Play className="ml-0.5 h-4 w-4" />}
            </button>
            <button onClick={() => skip(10)} className="text-background/80 hover:text-background" disabled={demoMode}>
              <SkipForward className="h-4 w-4" />
            </button>
            <button onClick={() => setMuted(!muted)} className="ml-1 text-background/80 hover:text-background">
              {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
            <span className="ml-2 text-xs text-background/70">
              {demoMode ? "0:00 / 2:30" : `${fmt(currentTime)} / ${fmt(duration || 0)}`}
            </span>
          </div>
          <button onClick={!demoMode ? fullscreen : undefined} className="text-background/80 hover:text-background">
            <Maximize className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
