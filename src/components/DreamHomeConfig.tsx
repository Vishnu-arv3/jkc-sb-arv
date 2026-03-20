import { useState } from "react";
import { Home, Trees, Building2, Sofa, PaintBucket, Fence } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface DreamHomeOptions {
  sqft: number;
  floors: number;
  style: string;
  views: string[];
  hasGarden: boolean;
  gardenStyle: string;
}

interface DreamHomeConfigProps {
  onSubmit: (config: DreamHomeOptions) => void;
  onBack: () => void;
}

const sqftOptions = [
  { value: 1000, label: "1,000 sq.ft", desc: "Compact & cozy" },
  { value: 2000, label: "2,000 sq.ft", desc: "Family-sized" },
  { value: 3500, label: "3,500 sq.ft", desc: "Spacious luxury" },
  { value: 5000, label: "5,000+ sq.ft", desc: "Grand estate" },
];

const floorOptions = [
  { value: 1, label: "1 Floor", desc: "Single storey" },
  { value: 2, label: "2 Floors", desc: "Double storey" },
  { value: 3, label: "3 Floors", desc: "Triple storey" },
];

const styleOptions = [
  { value: "modern", label: "Modern Minimalist", icon: Building2 },
  { value: "traditional", label: "Traditional Indian", icon: Home },
  { value: "contemporary", label: "Contemporary", icon: PaintBucket },
  { value: "villa", label: "Luxury Villa", icon: Sofa },
];

const viewOptions = [
  { value: "exterior_front", label: "Front Exterior" },
  { value: "exterior_aerial", label: "Aerial View" },
  { value: "living_room", label: "Living Room" },
  { value: "bedroom", label: "Master Bedroom" },
  { value: "kitchen", label: "Kitchen" },
  { value: "bathroom", label: "Bathroom" },
];

const gardenStyles = [
  { value: "minimal", label: "Minimal Lawn" },
  { value: "lush", label: "Lush Tropical" },
  { value: "zen", label: "Zen Garden" },
  { value: "rooftop", label: "Rooftop Garden" },
];

const DreamHomeConfig = ({ onSubmit, onBack }: DreamHomeConfigProps) => {
  const [config, setConfig] = useState<DreamHomeOptions>({
    sqft: 2000,
    floors: 2,
    style: "modern",
    views: ["exterior_front", "living_room"],
    hasGarden: true,
    gardenStyle: "lush",
  });

  const toggleView = (v: string) => {
    setConfig((prev) => ({
      ...prev,
      views: prev.views.includes(v)
        ? prev.views.filter((x) => x !== v)
        : prev.views.length < 4
        ? [...prev.views, v]
        : prev.views,
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-lg font-bold text-foreground">Design Your Dream Home</h2>
        <p className="text-sm text-muted-foreground">Customize your home and we'll generate a personalized video</p>
      </div>

      {/* Square Footage */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Home Size</label>
        <div className="grid grid-cols-2 gap-2">
          {sqftOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setConfig((p) => ({ ...p, sqft: opt.value }))}
              className={`rounded-xl border-2 p-3 text-left transition-all ${
                config.sqft === opt.value
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border bg-card hover:border-muted-foreground/30"
              }`}
            >
              <p className={`text-sm font-semibold ${config.sqft === opt.value ? "text-foreground" : "text-muted-foreground"}`}>
                {opt.label}
              </p>
              <p className="text-xs text-muted-foreground">{opt.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Floors */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Number of Floors</label>
        <div className="grid grid-cols-3 gap-2">
          {floorOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setConfig((p) => ({ ...p, floors: opt.value }))}
              className={`rounded-xl border-2 p-3 text-center transition-all ${
                config.floors === opt.value
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border bg-card hover:border-muted-foreground/30"
              }`}
            >
              <p className={`text-sm font-semibold ${config.floors === opt.value ? "text-foreground" : "text-muted-foreground"}`}>
                {opt.label}
              </p>
              <p className="text-xs text-muted-foreground">{opt.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Design Style */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Design Style</label>
        <div className="grid grid-cols-2 gap-2">
          {styleOptions.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setConfig((p) => ({ ...p, style: value }))}
              className={`flex items-center gap-3 rounded-xl border-2 p-3 text-left transition-all ${
                config.style === value
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border bg-card hover:border-muted-foreground/30"
              }`}
            >
              <Icon className={`h-5 w-5 ${config.style === value ? "text-primary" : "text-muted-foreground"}`} />
              <p className={`text-sm font-semibold ${config.style === value ? "text-foreground" : "text-muted-foreground"}`}>
                {label}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Views to Generate */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Views to Generate (select up to 4)</label>
        <div className="grid grid-cols-3 gap-2">
          {viewOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => toggleView(opt.value)}
              className={`rounded-xl border-2 p-2.5 text-center transition-all ${
                config.views.includes(opt.value)
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border bg-card hover:border-muted-foreground/30"
              }`}
            >
              <p className={`text-xs font-semibold ${config.views.includes(opt.value) ? "text-foreground" : "text-muted-foreground"}`}>
                {opt.label}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Garden */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-foreground">Include Garden</label>
          <button
            onClick={() => setConfig((p) => ({ ...p, hasGarden: !p.hasGarden }))}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              config.hasGarden ? "bg-primary" : "bg-muted"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                config.hasGarden ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
        {config.hasGarden && (
          <div className="grid grid-cols-2 gap-2">
            {gardenStyles.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setConfig((p) => ({ ...p, gardenStyle: opt.value }))}
                className={`flex items-center gap-2 rounded-xl border-2 p-2.5 text-left transition-all ${
                  config.gardenStyle === opt.value
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border bg-card hover:border-muted-foreground/30"
                }`}
              >
                {opt.value === "rooftop" ? (
                  <Fence className={`h-4 w-4 ${config.gardenStyle === opt.value ? "text-primary" : "text-muted-foreground"}`} />
                ) : (
                  <Trees className={`h-4 w-4 ${config.gardenStyle === opt.value ? "text-primary" : "text-muted-foreground"}`} />
                )}
                <p className={`text-xs font-semibold ${config.gardenStyle === opt.value ? "text-foreground" : "text-muted-foreground"}`}>
                  {opt.label}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button variant="outline" className="flex-1" onClick={onBack}>
          Back
        </Button>
        <Button
          variant="hero"
          className="flex-1"
          onClick={() => onSubmit(config)}
          disabled={config.views.length === 0}
        >
          Generate Dream Home Video
        </Button>
      </div>
    </div>
  );
};

export default DreamHomeConfig;
