import { useState } from "react";
import { Moon, Sun, User, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import AppLayout from "@/components/AppLayout";

const ProfilePage = () => {
  const { user, profile, refreshProfile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [displayName, setDisplayName] = useState(profile?.display_name || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [saving, setSaving] = useState(false);

  const saveProfile = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ display_name: displayName, phone })
      .eq("user_id", user.id);
    setSaving(false);
    if (error) { toast.error("Failed to save"); return; }
    toast.success("Profile updated");
    await refreshProfile();
  };

  return (
    <AppLayout>
      <div className="animate-fade-in space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Profile Settings</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage your account and preferences</p>
        </div>

        <div className="mx-auto max-w-2xl space-y-6">
          {/* Avatar & Info */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-5">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary font-display text-xl font-bold text-primary-foreground">
                {(profile?.display_name || user?.email || "U").charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="font-display text-lg font-bold text-foreground">{profile?.display_name || user?.email?.split("@")[0]}</h2>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Personal Info */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 font-display text-base font-semibold text-foreground">
              <User className="h-4 w-4" /> Personal Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Display Name</label>
                <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Email</label>
                <Input value={user?.email || ""} disabled />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Phone</label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 XXXXX XXXXX" />
              </div>
              <Button variant="hero" onClick={saveProfile} disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>

          {/* Appearance */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 font-display text-base font-semibold text-foreground">
              <Sun className="h-4 w-4" /> Appearance
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Dark Mode</p>
                <p className="text-xs text-muted-foreground">Switch between light and dark themes</p>
              </div>
              <button
                onClick={toggleTheme}
                className="relative flex h-10 w-20 items-center rounded-full bg-muted p-1 transition-colors"
              >
                <div className={`flex h-8 w-8 items-center justify-center rounded-full bg-card shadow-sm transition-transform duration-200 ${theme === "dark" ? "translate-x-10" : "translate-x-0"}`}>
                  {theme === "dark" ? <Moon className="h-4 w-4 text-foreground" /> : <Sun className="h-4 w-4 text-foreground" />}
                </div>
              </button>
            </div>
          </div>

          {/* Security */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 font-display text-base font-semibold text-foreground">
              <Shield className="h-4 w-4" /> Data & Privacy
            </h3>
            <p className="text-sm text-muted-foreground">
              Your selfies are securely processed and automatically deleted after video generation. We do not store or share your biometric data.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ProfilePage;
