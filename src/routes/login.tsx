import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Mail, Lock, Rocket, Info, Sparkles, CheckCircle2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: (search['redirect'] as string) || "",
    message: (search['message'] as string) || "",
  }),
  head: () => ({
    meta: [
      { title: "Log in — SPACE LEGACY" },
      { name: "description", content: "Sign in to save your Explorer badges and certificate across all your devices." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: LoginPage,
});

type Mode = "sign-in" | "sign-up";

function LoginPage() {
  const navigate = useNavigate();
  const { redirect: redirectTo, message: redirectMessage } = useSearch({ from: "/login" });
  const { user, signIn, signUp, quickGuestLogin } = useAuth();
  const [mode, setMode] = useState<Mode>("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [quickLoading, setQuickLoading] = useState(false);

  // If already logged in, redirect away from login page to intended target or profile
  useEffect(() => {
    if (user) {
      const target = redirectTo && redirectTo !== "/login" ? redirectTo : "/profile";
      navigate({ to: target as any, replace: true });
    }
  }, [user, redirectTo, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");

    if (!email.trim() || !password) {
      setError("Please enter both email and password.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const target = redirectTo && redirectTo !== "/login" ? redirectTo : "/profile";

      if (mode === "sign-in") {
        const res = await signIn({ email, password });
        if (!res.success) {
          setError(res.error || "Unable to log in. Please check your credentials.");
          return;
        }
        toast.success(
          res.isLocal
            ? "Welcome back, Explorer! 🚀 (Local Profile Active)"
            : "Welcome back, Explorer! 🚀"
        );
        navigate({ to: target as any, replace: true });
      } else {
        const res = await signUp({ email, password });
        if (!res.success) {
          setError(res.error || "Unable to create account. Please try again.");
          return;
        }

        if (res.needsEmailConfirmation) {
          setInfo(
            "Confirmation link sent! Please check your inbox and verify your email, then return here to log in."
          );
          setMode("sign-in");
          return;
        }

        toast.success("Welcome, explorer! 🚀 Your account is ready.");
        navigate({ to: target as any, replace: true });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async () => {
    setQuickLoading(true);
    setError("");
    setInfo("");
    try {
      await quickGuestLogin();
      toast.success("Welcome aboard, Explorer! 🚀 Instant profile activated.");
      const target = redirectTo && redirectTo !== "/login" ? redirectTo : "/profile";
      navigate({ to: target as any, replace: true });
    } catch {
      setError("Failed to create quick profile. Please try regular login.");
    } finally {
      setQuickLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="rounded-3xl border bg-card p-8 shadow-xl animate-rise">
          {/* Redirect message */}
          {redirectMessage && (
            <div className="mb-5 flex items-center gap-2 rounded-xl border border-primary/40 bg-primary/10 px-4 py-3 text-sm font-bold text-primary">
              <Info className="h-4 w-4 shrink-0" aria-hidden />
              {redirectMessage}
            </div>
          )}

          {/* Icon */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/15">
            <Rocket className="h-8 w-8 text-primary" aria-hidden />
          </div>

          <div className="mt-5 text-center">
            <h1 className="font-display text-3xl font-bold">
              {mode === "sign-in" ? "Welcome back, Explorer!" : "Join SPACE LEGACY"}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {mode === "sign-in"
                ? "Log in to access your badges, quiz progress, and certificate."
                : "Create an account to save your explorer progress and achievements."}
            </p>
          </div>

          {/* Quick 1-Click Access Button */}
          <div className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleQuickLogin}
              disabled={quickLoading || loading}
              className="w-full border-primary/40 bg-primary/5 hover:bg-primary/15 text-primary font-bold py-5 h-auto rounded-xl flex items-center justify-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              {quickLoading ? "Launching profile…" : "1-Click Instant Explorer Access"}
            </Button>
            <p className="mt-1.5 text-center text-xs text-muted-foreground">
              Recommended for quick testing & challenges
            </p>
          </div>

          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <span className="relative bg-card px-3 text-xs uppercase tracking-wider text-muted-foreground">
              or continue with email
            </span>
          </div>

          <form onSubmit={submit} className="space-y-4" noValidate>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-9"
                  aria-required="true"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
                <Input
                  id="password"
                  type="password"
                  autoComplete={mode === "sign-up" ? "new-password" : "current-password"}
                  placeholder={mode === "sign-up" ? "At least 6 characters" : "Your password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="pl-9"
                  aria-required="true"
                />
              </div>
            </div>

            {error && (
              <p role="alert" className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-2 text-sm font-bold text-destructive">
                {error}
              </p>
            )}

            {info && (
              <div role="status" className="rounded-xl border border-primary/40 bg-primary/10 px-4 py-3 text-sm font-medium text-primary flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{info}</span>
              </div>
            )}

            <Button type="submit" className="w-full font-bold" disabled={loading || quickLoading} aria-busy={loading}>
              {loading ? "Please wait…" : mode === "sign-in" ? "Log in" : "Create account"}
            </Button>
          </form>

          {/* Mode switcher */}
          <p className="mt-5 text-center text-sm text-muted-foreground">
            {mode === "sign-in" ? (
              <>
                No account yet?{" "}
                <button
                  type="button"
                  onClick={() => { setMode("sign-up"); setError(""); setInfo(""); }}
                  className="font-bold text-primary underline hover:text-primary/80"
                >
                  Create one for free
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => { setMode("sign-in"); setError(""); setInfo(""); }}
                  className="font-bold text-primary underline hover:text-primary/80"
                >
                  Log in
                </button>
              </>
            )}
          </p>

          {/* Storage & Privacy badge */}
          <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-muted-foreground/80">
            <ShieldCheck className="h-3.5 w-3.5 text-status-active" />
            <span>Encrypted local session with cloud synchronization</span>
          </div>

          {/* Guest option */}
          <div className="mt-4 border-t border-border pt-4 text-center">
            <p className="text-xs text-muted-foreground">
              You can explore everything without an account. Badges will be saved on this device only.
            </p>
            <Link
              to="/"
              className="mt-2 inline-block text-sm font-bold text-muted-foreground underline hover:text-foreground"
            >
              Continue as a guest →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
