import { useState, useEffect, createContext, useContext } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: { display_name: string | null; phone: string | null; avatar_url: string | null } | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  signup: (name: string, email: string, password: string) => Promise<{ error: string | null }>;
  bypassAuth: () => void;
  verifyOtp: (email: string, token: string) => Promise<{ error: string | null }>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  profile: null,
  isAuthenticated: false,
  loading: true,
  login: async () => ({ error: null }),
  signup: async () => ({ error: null }),
  bypassAuth: () => {},
  verifyOtp: async () => ({ error: null }),
  resetPassword: async () => ({ error: null }),
  logout: async () => {},
  refreshProfile: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<AuthContextType["profile"]>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string, currentUser?: User | null) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("display_name, phone, avatar_url")
        .eq("user_id", userId)
        .single();
      
      if (error && error.code !== "PGRST116") { // Ignore "no rows returned" error
        console.error("Error fetching profile:", error);
      }

      const metadataName = currentUser?.user_metadata?.full_name;
      
      if (data) {
        setProfile({
          display_name: data.display_name || metadataName || null,
          phone: data.phone || null,
          avatar_url: data.avatar_url || null
        });
      } else if (metadataName) {
        setProfile({
          display_name: metadataName,
          phone: null,
          avatar_url: null
        });
      }
    } catch (err) {
      console.error("Profile fetch exception:", err);
    }
  };

  const bypassAuth = () => {
    const mockUser: User = {
      id: "00000000-0000-0000-0000-000000000000",
      email: "guest@jkcement.com",
      user_metadata: { full_name: "Guest User" },
      aud: "authenticated",
      role: "authenticated",
      created_at: new Date().toISOString(),
    } as any;
    const mockSession: Session = {
      access_token: "mock",
      refresh_token: "mock",
      expires_in: 3600,
      token_type: "bearer",
      user: mockUser,
    } as any;
    
    setSession(mockSession);
    setUser(mockUser);
    setProfile({
      display_name: "Guest User",
      phone: null,
      avatar_url: null
    });
    setLoading(false);
    localStorage.setItem("sb-mock-auth", "true");
  };

  useEffect(() => {
    if (localStorage.getItem("sb-mock-auth") === "true") {
      bypassAuth();
      return;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, sess) => {
      if (localStorage.getItem("sb-mock-auth") === "true") return;
      
      setSession(sess);
      const newUser = sess?.user ?? null;
      setUser(newUser);
      if (newUser) {
        setTimeout(() => fetchProfile(newUser.id, newUser), 0);
      } else {
        setProfile(null);
      }
    });

    supabase.auth.getSession().then(({ data: { session: sess } }) => {
      if (localStorage.getItem("sb-mock-auth") === "true") return;
      
      setSession(sess);
      const newUser = sess?.user ?? null;
      setUser(newUser);
      if (newUser) fetchProfile(newUser.id, newUser);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    localStorage.removeItem("sb-mock-auth");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  };

  const signup = async (name: string, email: string, password: string) => {
    localStorage.removeItem("sb-mock-auth");
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { 
        data: { full_name: name }, 
        emailRedirectTo: window.location.origin 
      },
    });

    // If an email confirmation error occurs, the user may still have been created.
    // Attempt to sign them in directly.
    if (error) {
      const isEmailError = error.message.toLowerCase().includes("email") || 
                           error.message.toLowerCase().includes("confirmation") ||
                           error.status === 500;
      if (isEmailError) {
        console.warn("Email confirmation error detected, attempting auto-sign-in...");
        const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
        if (!loginError) {
          return { error: null }; // Auto-sign-in succeeded
        }
        // If auto-login also failed, return a helpful message
        return { error: "Account created! Please check your email to confirm, or use Test Mode below." };
      }
      return { error: error.message };
    }

    // If signup succeeded but user is unconfirmed (no session), try auto-login
    if (data?.user && !data.session) {
      const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
      if (!loginError) {
        return { error: null };
      }
      return { error: "Account created! Please check your email to confirm, or use Test Mode below." };
    }

    return { error: null };
  };

  const verifyOtp = async (email: string, token: string) => {
    localStorage.removeItem("sb-mock-auth");
    const { error } = await supabase.auth.verifyOtp({ email, token, type: 'signup' });
    return { error: error?.message ?? null };
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { error: error?.message ?? null };
  };

  const logout = async () => {
    localStorage.removeItem("sb-mock-auth");
    await supabase.auth.signOut();
  };

  const refreshProfile = async () => {
    if (user && localStorage.getItem("sb-mock-auth") !== "true") {
      await fetchProfile(user.id, user);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, profile, isAuthenticated: !!user, loading, login, signup, bypassAuth, verifyOtp, resetPassword, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
