import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { Rocket, Eye, EyeOff, Loader2, Info, CheckCircle2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { ErrorBanner } from "@/components/space/states";

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

/** Translates raw auth error strings into friendly plain language for ages 8–14. */
function translateAuthError(raw: string, mode: Mode): string {
  const lower = raw.toLowerCase();
  // Wrong password
  if (lower.includes("incorrect password") || lower.includes("invalid login") || lower.includes("invalid credentials") || lower.includes("wrong password")) {
    return "That password didn't match. Double-check and try again!";
  }
  // Email already used
  if (lower.includes("already exists") || lower.includes("already registered") || lower.includes("user already") || lower.includes("email already")) {
    return "That email is already used by another explorer. Try logging in instead, or use a different email.";
  }
  // No account found
  if (lower.includes("no explorer account") || lower.includes("user not found") || lower.includes("invalid email")) {
    return "We couldn't find an account with that email. Check your spelling, or create a free account below!";
  }
  // Email not confirmed
  if (lower.includes("email not confirmed")) {
    return "You need to confirm your email first. Check your inbox for a link from us!";
  }
  // Network / timeout
  if (lower.includes("timeout") || lower.includes("network") || lower.includes("fetch") || lower.includes("unreachable")) {
    return "We couldn't reach the server right now — check your internet connection and try again.";
  }
  // Password too short
  if (lower.includes("at least 6") || lower.includes("password must")) {
    return raw; // already friendly
  }
  // Passwords don't match
  if (lower.includes("do not match")) {
    return raw;
  }
  // Fallback
  return raw || "Something went wrong. Please try again!";
}

function LoginPage() {
  const navigate = useNavigate();
  const { redirect: redirectTo, message: redirectMessage } = useSearch({ from: "/login" });
  const { user, signIn, signUp, quickGuestLogin, signOut } = useAuth();
  const [mode, setMode] = useState<Mode>("sign-in");

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);

  // ─── Already logged in ──────────────────────────────────────────────────────
  if (user) {
    const target = redirectTo && redirectTo !== "/login" ? redirectTo : "/profile";
    const displayName =
      user.user_metadata?.["full_name"] || user.email?.split("@")[0] || "Explorer";

    return (
      <div className="flex min-h-[80vh] items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm">
          <div className="rounded-3xl border bg-card p-8 shadow-xl animate-rise text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/15 text-3xl">
              🚀
            </div>
            <h1 className="mt-4 font-display text-2xl font-bold">
              You are logged in
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Currently signed in as{" "}
              <strong className="text-foreground">{displayName}</strong>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{user.email}</p>

            <div className="mt-6 flex flex-col gap-3">
              <Button
                type="button"
                className="w-full font-bold"
                onClick={() => navigate({ to: target as any, replace: true })}
              >
                Continue to Explorer Profile →
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full font-bold"
                onClick={async () => {
                  await signOut();
                  toast.success("Logged out successfully.");
                }}
              >
                Log out
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Helpers ────────────────────────────────────────────────────────────────
  const switchMode = (next: Mode) => {
    setMode(next);
    setError("");
    setInfo("");
    setName("");
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  // ─── Submit ─────────────────────────────────────────────────────────────────
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
    if (mode === "sign-up" && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const target = redirectTo && redirectTo !== "/login" ? redirectTo : "/profile";

      if (mode === "sign-in") {
        const res = await signIn({ email, password });
        if (!res.success) {
          setError(translateAuthError(res.error || "Unable to log in. Please check your credentials.", mode));
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
          setError(translateAuthError(res.error || "Unable to create account. Please try again.", mode));
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

  // ─── Continue as guest ──────────────────────────────────────────────────────
  const handleGuest = async () => {
    setGuestLoading(true);
    try {
      const res = await quickGuestLogin();
      if (res.success) {
        toast.success("Exploring as guest 🚀 Badges saved on this device.");
        navigate({ to: "/" as any, replace: true });
      } else {
        setError("Couldn't set up guest mode. Please check your internet and try again.");
      }
    } catch {
      setError("Something went wrong connecting. Check your internet and try again.");
    } finally {
      setGuestLoading(false);
    }
  };

  // ─── Render ─────────────────────────────────────────────────────────────────
  const isSignUp = mode === "sign-up";

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">

        {/* Redirect message banner */}
        {redirectMessage && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-primary/40 bg-primary/10 px-4 py-3 text-sm font-bold text-primary">
            <Info className="h-4 w-4 shrink-0" aria-hidden />
            {redirectMessage}
          </div>
        )}

        {/* Card */}
        <div className="rounded-3xl border bg-card shadow-xl animate-rise overflow-hidden">
          <div className="p-8 pb-6">

            {/* Header */}
            <div className="flex flex-col items-center text-center gap-3 mb-7">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15">
                <Rocket className="h-7 w-7 text-primary" aria-hidden />
              </div>
              <div>
                <h1 className="font-display font-bold text-2xl leading-tight">
                  {isSignUp ? "Join SPACE LEGACY" : "Welcome back, Explorer"}
                </h1>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {isSignUp
                    ? "Create a free account to save your badges and progress."
                    : "Log in to access your badges and certificate."}
                </p>
              </div>
            </div>

            {/* Form */}
            <form
              id="auth-form"
              onSubmit={submit}
              className="space-y-4"
              noValidate
              aria-label={isSignUp ? "Create account form" : "Sign in form"}
            >
              {/* Name (sign-up only) */}
              {isSignUp && (
                <div className="space-y-1.5">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    name="name"
                    autoComplete="name"
                    inputMode="text"
                    placeholder="Your explorer name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-12 text-base"
                    aria-label="Your name"
                  />
                </div>
              )}

              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  inputMode="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  aria-required="true"
                  className="h-12 text-base"
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    autoComplete={isSignUp ? "new-password" : "current-password"}
                    placeholder={isSignUp ? "At least 6 characters" : "Your password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    aria-required="true"
                    className="h-12 text-base pr-11"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded p-0.5"
                  >
                    {showPassword
                      ? <EyeOff className="h-4 w-4" aria-hidden />
                      : <Eye className="h-4 w-4" aria-hidden />}
                  </button>
                </div>
              </div>

              {/* Confirm password (sign-up only) */}
              {isSignUp && (
                <div className="space-y-1.5">
                  <Label htmlFor="confirm-password">Confirm password</Label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirm-password"
                      autoComplete="new-password"
                      placeholder="Repeat your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      aria-required="true"
                      className="h-12 text-base pr-11"
                    />
                    <button
                      type="button"
                      aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded p-0.5"
                    >
                      {showConfirmPassword
                        ? <EyeOff className="h-4 w-4" aria-hidden />
                        : <Eye className="h-4 w-4" aria-hidden />}
                    </button>
                  </div>
                </div>
              )}

              {/* Error */}
              {error && <ErrorBanner message={error} />}

              {/* Info (e.g. email confirmation) */}
              {info && (
                <div
                  role="status"
                  aria-live="polite"
                  className="rounded-xl border border-primary/40 bg-primary/10 px-4 py-3 text-sm font-medium text-primary flex items-start gap-2"
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" aria-hidden />
                  <span>{info}</span>
                </div>
              )}

              {/* Submit */}
              <Button
                type="submit"
                className="w-full h-12 text-base font-bold"
                disabled={loading}
                aria-busy={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                    Please wait…
                  </>
                ) : isSignUp ? (
                  "Create account"
                ) : (
                  "Log in"
                )}
              </Button>
            </form>

            {/* Mode switcher */}
            <p className="mt-5 text-center text-sm text-muted-foreground">
              {isSignUp ? (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => switchMode("sign-in")}
                    className="font-bold text-primary underline hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                  >
                    Log in
                  </button>
                </>
              ) : (
                <>
                  No account yet?{" "}
                  <button
                    type="button"
                    onClick={() => switchMode("sign-up")}
                    className="font-bold text-primary underline hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                  >
                    Create one for free
                  </button>
                </>
              )}
            </p>
          </div>

          {/* Guest section — clear secondary button, not a tiny link */}
          <div className="border-t border-border bg-muted/30 px-8 py-5 flex flex-col items-center gap-3 text-center">
            <p className="text-xs text-muted-foreground leading-snug">
              You can explore everything without an account.
              <br />
              Badges will be saved on this device only.
            </p>
            <Button
              type="button"
              variant="outline"
              className="w-full h-11 font-semibold"
              onClick={handleGuest}
              disabled={guestLoading}
              aria-busy={guestLoading}
            >
              {guestLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  Setting up…
                </>
              ) : (
                "Continue as a guest"
              )}
            </Button>
          </div>
        </div>

        {/* Privacy note */}
        <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted-foreground/70">
          <ShieldCheck className="h-3.5 w-3.5 text-status-active" aria-hidden />
          <span>Encrypted local session with cloud synchronization</span>
        </div>
      </div>
    </div>
  );
}
