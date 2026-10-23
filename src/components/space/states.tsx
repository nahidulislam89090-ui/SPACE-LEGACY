/**
 * Shared UI-state components for SPACE LEGACY.
 * Loading skeletons, empty states, error banners, image fallbacks.
 * Ages 8-14 friendly copy throughout.
 */
import { Link } from "@tanstack/react-router";
import { AlertTriangle, Heart, Trophy, Star, Telescope, Home, Map } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useState } from "react";

// ─── Skeleton helpers ─────────────────────────────────────────────────────────

/** Full-page profile loading skeleton */
export function ProfileSkeleton() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 animate-pulse" aria-label="Loading your profile…" aria-busy="true">
      {/* Header card */}
      <div className="rounded-3xl border bg-card p-6 sm:p-8">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          <Skeleton className="h-24 w-24 rounded-full shrink-0" />
          <div className="flex-1 w-full space-y-3">
            <Skeleton className="h-8 w-48 rounded-full" />
            <Skeleton className="h-5 w-32 rounded-full" />
            <Skeleton className="h-2 w-64 rounded-full" />
            <div className="flex gap-6">
              <Skeleton className="h-4 w-24 rounded" />
              <Skeleton className="h-4 w-20 rounded" />
            </div>
          </div>
        </div>
      </div>
      {/* Tabs bar */}
      <div className="mt-6 flex gap-2">
        {[100, 90, 110, 80, 70].map((w, i) => (
          <Skeleton key={i} className="h-9 rounded-full" style={{ width: w }} />
        ))}
      </div>
      {/* Tab content cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-28 rounded-3xl" />
        ))}
      </div>
    </div>
  );
}

/** Skeleton for a grid of badge cards */
export function BadgeGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div
      className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      aria-label="Loading badges…"
      aria-busy="true"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-3xl border bg-card p-5 flex flex-col items-center gap-3 animate-pulse">
          <Skeleton className="h-16 w-16 rounded-2xl" />
          <Skeleton className="h-4 w-28 rounded" />
          <Skeleton className="h-3 w-40 rounded" />
        </div>
      ))}
    </div>
  );
}

/** Skeleton for a 2-column favorites grid */
export function FavoritesGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div
      className="grid gap-4 sm:grid-cols-2"
      aria-label="Loading favorites…"
      aria-busy="true"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-2xl border bg-card overflow-hidden animate-pulse">
          <Skeleton className="aspect-[2/1] w-full" />
          <div className="p-4 space-y-2">
            <Skeleton className="h-4 w-24 rounded" />
            <Skeleton className="h-5 w-36 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Skeleton for a quiz score list row */
export function ScoreRowSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div
      className="grid gap-2 grid-cols-1 sm:grid-cols-2"
      aria-label="Loading scores…"
      aria-busy="true"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center justify-between rounded-xl border px-3 py-2 animate-pulse">
          <Skeleton className="h-4 w-32 rounded" />
          <Skeleton className="h-5 w-12 rounded-full" />
        </div>
      ))}
    </div>
  );
}

/** Generic centered spinner for smaller loading states */
export function SpinnerOverlay({ label = "Loading…" }: { label?: string }) {
  return (
    <div
      className="flex min-h-[40vh] items-center justify-center"
      aria-label={label}
      aria-busy="true"
      role="status"
    >
      <div className="text-center animate-rise">
        <div className="mx-auto h-14 w-14 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
        <p className="mt-4 font-display text-lg text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

// ─── Empty states ─────────────────────────────────────────────────────────────

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  body: string;
  action?: React.ReactNode;
  className?: string;
}
function EmptyState({ icon, title, body, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-3xl border border-dashed border-border bg-card p-10 text-center",
        className
      )}
      role="status"
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted text-4xl">
        {icon}
      </div>
      <p className="mt-5 font-display text-xl font-semibold">{title}</p>
      <p className="mt-2 text-muted-foreground">{body}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function EmptyFavorites() {
  return (
    <EmptyState
      icon={<Heart className="h-9 w-9 text-destructive/70" aria-hidden />}
      title="No favorites yet!"
      body="Tap the heart on any machine to save it here. 💛"
      action={
        <Link
          to="/map"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Map className="h-4 w-4" aria-hidden /> Explore the map
        </Link>
      }
    />
  );
}

export function EmptyBadges() {
  return (
    <EmptyState
      icon={<Trophy className="h-9 w-9 text-accent/70" aria-hidden />}
      title="Your trophy shelf is waiting!"
      body="Complete a quiz or explore a spacecraft to earn your first badge. 🚀"
      action={
        <Link
          to="/map"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Start exploring
        </Link>
      }
    />
  );
}

export function EmptyQuizScores() {
  return (
    <EmptyState
      icon={<Star className="h-9 w-9 text-accent/70" aria-hidden />}
      title="No quiz scores yet!"
      body="Visit a spacecraft page and try the mini quiz to see your scores here. ⭐"
      action={
        <Link
          to="/map"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Go to the map
        </Link>
      }
    />
  );
}

// ─── Error banner ──────────────────────────────────────────────────────────────

/** Inline friendly error banner (auth errors etc.) */
export function ErrorBanner({
  message,
  className,
}: {
  message: string;
  className?: string;
}) {
  if (!message) return null;
  return (
    <div
      role="alert"
      aria-live="assertive"
      className={cn(
        "flex items-start gap-3 rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive",
        className
      )}
    >
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
      <span>{message}</span>
    </div>
  );
}

/** Full-page error for unexpected crashes */
export function GlobalErrorScreen({
  title = "Something went wrong in mission control! 🛸",
  body = "Our engineers have been notified. Try going back to the home base.",
  onRetry,
}: {
  title?: string;
  body?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-20">
      <div className="mx-auto max-w-md text-center animate-rise">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-destructive/10 text-5xl">
          🛸
        </div>
        <h1 className="mt-6 font-display text-2xl font-bold text-foreground">{title}</h1>
        <p className="mt-3 text-muted-foreground">{body}</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Try again
            </button>
          )}
          <a
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-bold text-foreground hover:bg-muted transition-colors"
          >
            <Home className="h-4 w-4" aria-hidden /> Back to home
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Image with fallback ───────────────────────────────────────────────────────

interface ImgWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackLabel?: string;
}

/** Renders an img; on error shows a themed placeholder with the item name. */
export function ImgWithFallback({
  src,
  alt,
  fallbackLabel,
  className,
  ...rest
}: ImgWithFallbackProps) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-2 bg-muted text-muted-foreground",
          className
        )}
        aria-label={alt}
        role="img"
      >
        <Telescope className="h-10 w-10 opacity-40" aria-hidden />
        <span className="text-xs font-bold opacity-60 px-2 text-center">
          {fallbackLabel || alt || "Image unavailable"}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setErrored(true)}
      {...rest}
    />
  );
}
