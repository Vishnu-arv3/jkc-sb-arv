import { Moon, Sun, User, Mail, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import AppLayout from "@/components/AppLayout";

const ProfilePage = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

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
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground font-display">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div>
                <h2 className="font-display text-lg font-bold text-foreground">{user?.name}</h2>
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
                <label className="mb-1.5 block text-sm font-medium text-foreground">Full Name</label>
                <Input defaultValue={user?.name} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Email</label>
                <Input defaultValue={user?.email} type="email" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Phone</label>
                <Input placeholder="+91 XXXXX XXXXX" />
              </div>
              <Button variant="hero">Save Changes</Button>
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
              <Shield className="h-4 w-4" /> Security
            </h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Current Password</label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">New Password</label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <Button variant="outline">Update Password</Button>
            </div>
          </div>

          {/* Data */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 font-display text-base font-semibold text-foreground">
              <Mail className="h-4 w-4" /> Data & Privacy
            </h3>
            <p className="text-sm text-muted-foreground">
              Your selfies are securely processed and automatically deleted after video generation. We do not store or share your biometric data.
            </p>
            <Button variant="destructive" size="sm" className="mt-4">Delete Account</Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ProfilePage;
