import { Monitor, Tv } from "lucide-react";

interface QualitySelectorProps {
  value: "sd" | "hd";
  onChange: (q: "sd" | "hd") => void;
}

const options = [
  { key: "sd" as const, label: "Standard (SD)", desc: "480p • Faster (~2 min)", icon: Monitor },
  { key: "hd" as const, label: "High Definition (HD)", desc: "1080p • Best quality (~4 min)", icon: Tv },
];

const QualitySelector = ({ value, onChange }: QualitySelectorProps) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-foreground">Video Quality</label>
    <div className="grid grid-cols-2 gap-3">
      {options.map(({ key, label, desc, icon: Icon }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`rounded-xl border-2 p-4 text-left transition-all ${
            value === key
              ? "border-primary bg-primary/5 shadow-sm"
              : "border-border bg-card hover:border-muted-foreground/30"
          }`}
        >
          <Icon className={`mb-2 h-5 w-5 ${value === key ? "text-primary" : "text-muted-foreground"}`} />
          <p className={`text-sm font-semibold ${value === key ? "text-foreground" : "text-muted-foreground"}`}>
            {label}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">{desc}</p>
        </button>
      ))}
    </div>
  </div>
);

export default QualitySelector;
