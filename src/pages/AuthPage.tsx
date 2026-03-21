import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import jkLogo from "@/assets/jkcement_logo.png";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);
  const { login, signup, resetPassword, bypassAuth } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLogin) {
      if (password !== confirmPassword) {
        toast.error("Passwords do not match!");
        return;
      }
      if (password.length < 6) {
        toast.error("Password must be at least 6 characters long.");
        return;
      }
    }

    setLoading(true);
    try {
      if (isLogin) {
        const { error: loginError } = await login(email.trim(), password);
        if (loginError) { toast.error(loginError); return; }
        navigate("/dashboard");
      } else {
        const { error: signupError } = await signup(name, email.trim(), password);
        if (signupError) {
          if (signupError.toLowerCase().includes("rate limit") || signupError.toLowerCase().includes("too many") || signupError.toLowerCase().includes("over the email rate limit")) {
            toast.error("Too many sign-up attempts. Please wait a few minutes and try again.");
          } else {
            toast.error(signupError);
          }
          return;
        }
        
        toast.success("Account created! Redirecting to Sign In...");
        setTimeout(() => {
          setIsLogin(true);
          setPassword("");
          setConfirmPassword("");
          toast.info("Please check your email to confirm your account before signing in.", { duration: 6000 });
        }, 1500);
      }
    } finally {
      setLoading(false);
    }
  };



  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      }
    });
    if (error) toast.error("Google sign-in failed. Please try again.");
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await resetPassword(forgotEmail.trim());
      if (error) { toast.error(error); return; }
      setForgotSent(true);
      toast.success("Password reset email sent! Check your inbox.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-primary/5" />
        <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-secondary/5" />
        <div className="absolute left-1/2 top-1/4 h-48 w-48 -translate-x-1/2 rounded-full bg-primary/3" />
      </div>

      <div className="relative w-full max-w-md animate-fade-in">
        {/* Header */}
        <div className="mb-8 text-center">
          <img src={jkLogo} alt="JKCement" className="mx-auto mb-2 h-12 w-auto" />
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Video Studio</p>
          <h1 className="font-display text-2xl font-bold text-foreground">
            {isForgotPassword ? "Reset Password" : isLogin ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isForgotPassword ? "Enter your email to receive a reset link" : isLogin ? "Sign in to your Video Studio" : "Start your personalized video journey"}
          </p>
        </div>

        {/* Form */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-lg shadow-primary/5">
          {/* Forgot Password Form */}
          {isForgotPassword ? (
            forgotSent ? (
              <div className="text-center py-4 space-y-3">
                <div className="text-4xl">📧</div>
                <p className="font-semibold text-foreground">Check your email!</p>
                <p className="text-sm text-muted-foreground">We sent a password reset link to <strong>{forgotEmail}</strong></p>
                <button type="button" onClick={() => { setIsForgotPassword(false); setForgotSent(false); setForgotEmail(""); }} className="text-sm font-semibold text-secondary hover:underline">Back to Sign In</button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Email</label>
                  <Input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="rounded-xl"
                  />
                </div>
                <Button type="submit" className="w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-display font-semibold" size="lg" disabled={loading}>
                  {loading ? "Sending..." : "Send Reset Link"}
                </Button>
                <div className="text-center">
                  <button type="button" onClick={() => setIsForgotPassword(false)} className="text-sm font-semibold text-secondary hover:underline">Back to Sign In</button>
                </div>
              </form>
            )
          ) : (
            <>
          {/* Google Sign-In */}
          <Button
            type="button"
            variant="outline"
            className="mb-4 w-full gap-2 rounded-xl"
            onClick={handleGoogleSignIn}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </Button>

          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <>
              {!isLogin && (
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">Full Name</label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      required={!isLogin}
                      className="rounded-xl"
                    />
                  </div>
                )}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Email</label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Password</label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      minLength={6}
                      className="rounded-xl pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                {!isLogin && (
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">Confirm Password</label>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        required={!isLogin}
                        minLength={6}
                        className="rounded-xl pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                )}
            </>
            
            <Button type="submit" className="w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-display font-semibold" size="lg" disabled={loading}>
              {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
            </Button>
          </form>

          {isLogin && (
            <div className="mt-2 text-right">
              <button
                type="button"
                onClick={() => { setIsForgotPassword(true); setForgotSent(false); setForgotEmail(""); }}
                className="text-sm text-muted-foreground hover:text-foreground hover:underline"
              >
                Forgot password?
              </button>
            </div>
          )}

          <div className="mt-4 text-center text-sm text-muted-foreground">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="font-semibold text-secondary hover:underline"
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-border/50">
            <p className="text-center text-[10px] text-muted-foreground uppercase tracking-widest mb-3">Developer Tools</p>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => { bypassAuth(); navigate("/dashboard"); }}
              className="w-full rounded-xl border-dashed border-primary/30 text-primary hover:bg-primary/5"
            >
              Skip Confirmation (Test Mode)
            </Button>
            <p className="mt-2 text-[10px] text-center text-muted-foreground">
              Bypass email confirmation for testing the workflow.
            </p>
          </div>
          </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
