import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Lock, Rocket, Info, CheckCircle2, ShieldCheck } from "lucide-react";
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
  const { user, signIn, signUp } = useAuth();
  const [mode, setMode] = useState<Mode>("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);


  const { signOut } = useAuth();

  if (user) {
    const target = redirectTo && redirectTo !== "/login" ? redirectTo : "/profile";
    const displayName =
      user.user_metadata?.full_name || user.email?.split("@")[0] || "Explorer";

    return (
      <div className="flex min-h-[80vh] items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
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

            <div className="mt-6 border-t border-border pt-4">
              <Link
                to="/"
                className="inline-block text-sm font-bold text-muted-foreground underline hover:text-foreground"
              >
                Continue as guest →
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

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

          <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
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

            <Button type="submit" className="w-full font-bold" disabled={loading} aria-busy={loading}>
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
