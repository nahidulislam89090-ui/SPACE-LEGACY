import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Award,
  Heart,
  Lock,
  LogOut,
  Pencil,
  RotateCcw,
  Settings2,
  Shield,
  Star,
  Trash2,
  Trophy,
  Check,
  X,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useProgress } from "@/lib/progress";
import { useFavorites } from "@/lib/favorites";
import { useSettings, useSyncSettingsToCloud, type Theme } from "@/lib/settings";
import { BADGE_DEFS, LEVEL_ORDER, type BadgeId, type ExplorerLevel } from "@/lib/badges";
import { hardware, type Zone, zoneLabels } from "@/content/hardware";
import { AvatarPicker, AvatarDisplay } from "@/components/space/AvatarPicker";
import { ProgressRing } from "@/components/space/ProgressRing";
import { StatusBadge } from "@/components/space/bits";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Explorer Profile — SPACE LEGACY" },
      {
        name: "description",
        content:
          "Your explorer profile: progress, badges, favorites and settings in the SPACE LEGACY museum.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ProfilePage,
});

// ─── Level colours (reuse from badges) ───────────────────────────────────────
const levelStyle: Record<ExplorerLevel, string> = {
  Cadet: "border-status-resting/60 bg-status-resting/15 text-status-resting",
  Explorer: "border-primary/60 bg-primary/15 text-primary",
  Archivist: "border-accent/60 bg-accent/15 text-accent",
};

// ─── Profile Guard ───────────────────────────────────────────────────────────
function ProfilePage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate({
        to: "/login",
        search: { redirect: "/profile", message: "Log in to see your explorer profile" },
        replace: true,
      });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center animate-rise">
          <div className="mx-auto h-16 w-16 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
          <p className="mt-4 text-muted-foreground">Loading your profile…</p>
        </div>
      </div>
    );
  }

  if (!user) return null;
  return <ProfileContent />;
}

// ─── Profile Content ─────────────────────────────────────────────────────────
function ProfileContent() {
  const { user, avatar, createdAt, setAvatar } = useAuth();
  const {
    scores,
    badges,
    displayName,
    explorerLevel: level,
    totalScore,
    lettersRead,
    setDisplayName,
    resetProgress,
  } = useProgress();

  // ── Inline name editing ──
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(displayName);
  const [nameError, setNameError] = useState("");

  const startEdit = () => {
    setDraft(displayName);
    setNameError("");
    setEditing(true);
  };
  const cancelEdit = () => {
    setEditing(false);
    setNameError("");
  };
  const saveName = () => {
    const trimmed = draft.trim().replace(/<[^>]*>/g, ""); // strip HTML
    if (trimmed.length < 2 || trimmed.length > 30) {
      setNameError("Name must be 2–30 characters.");
      return;
    }
    setDisplayName(trimmed);
    setDraft(trimmed);
    setEditing(false);
    setNameError("");
    toast.success("Name saved!");
  };

  // ── Level progress ──
  const earnedCount = badges.size;
  const totalBadges = BADGE_DEFS.length;
  const levelIdx = LEVEL_ORDER.indexOf(level);
  const nextLevel = levelIdx < LEVEL_ORDER.length - 1 ? LEVEL_ORDER[levelIdx + 1] : null;

  // level progress: percentage toward next level based on badge fraction
  const levelProgress =
    level === "Archivist" ? 100 : Math.round((earnedCount / totalBadges) * 100);

  // member since
  const memberSince = createdAt
    ? new Date(createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      {/* ═══ Profile Header ═══ */}
      <header className="animate-rise rounded-3xl border bg-card p-6 sm:p-8">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          {/* Avatar */}
          <AvatarDisplay avatarKey={avatar} size="xl" />

          {/* Info */}
          <div className="flex-1 text-center sm:text-left">
            {/* Display name */}
            <div className="flex items-center justify-center gap-2 sm:justify-start">
              {editing ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveName();
                      if (e.key === "Escape") cancelEdit();
                    }}
                    maxLength={30}
                    autoFocus
                    className="rounded-xl border border-border bg-background px-3 py-1.5 font-display text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-ring"
                    aria-label="Edit display name"
                  />
                  <Button size="icon" variant="ghost" onClick={saveName} aria-label="Save name">
                    <Check className="h-4 w-4 text-status-talking" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={cancelEdit} aria-label="Cancel editing">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <>
                  <h1 className="font-display text-3xl font-bold">
                    {displayName || "Space Explorer"}
                  </h1>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={startEdit}
                    aria-label="Edit display name"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
            {nameError && (
              <p role="alert" className="mt-1 text-sm font-bold text-destructive">
                {nameError}
              </p>
            )}

            {/* Level badge + progress */}
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <span
                className={cn(
                  "rounded-full border px-3 py-1 text-sm font-bold",
                  levelStyle[level]
                )}
              >
                {level}
              </span>
              {nextLevel && (
                <span className="text-xs text-muted-foreground">
                  → {nextLevel}
                </span>
              )}
            </div>
            <div className="mt-2 max-w-xs">
              <Progress
                value={levelProgress}
                className="h-2"
                aria-label={`${levelProgress}% toward ${nextLevel ?? "max level"}`}
              />
            </div>

            {/* Stats */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground sm:justify-start">
              <span className="flex items-center gap-1.5">
                <Star className="h-4 w-4 text-accent" aria-hidden />
                <strong className="text-foreground">{totalScore}</strong> total score
              </span>
              <span className="flex items-center gap-1.5">
                <Trophy className="h-4 w-4 text-accent" aria-hidden />
                <strong className="text-foreground">{earnedCount}</strong>/{totalBadges} badges
              </span>
              <span>Member since {memberSince}</span>
            </div>
          </div>
        </div>
      </header>

      {/* ═══ Tabs ═══ */}
      <Tabs defaultValue="progress" className="mt-8">
        <TabsList className="flex w-full flex-wrap justify-start gap-1 bg-transparent">
          <TabsTrigger value="progress" className="rounded-full px-4 font-bold data-[state=active]:bg-primary/15 data-[state=active]:text-primary">
            My Progress
          </TabsTrigger>
          <TabsTrigger value="badges" className="rounded-full px-4 font-bold data-[state=active]:bg-primary/15 data-[state=active]:text-primary">
            My Badges
          </TabsTrigger>
          <TabsTrigger value="certificate" className="rounded-full px-4 font-bold data-[state=active]:bg-primary/15 data-[state=active]:text-primary">
            My Certificate
          </TabsTrigger>
          <TabsTrigger value="favorites" className="rounded-full px-4 font-bold data-[state=active]:bg-primary/15 data-[state=active]:text-primary">
            Favorites
          </TabsTrigger>
          <TabsTrigger value="settings" className="rounded-full px-4 font-bold data-[state=active]:bg-primary/15 data-[state=active]:text-primary">
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="progress" className="mt-6">
          <ProgressTab />
        </TabsContent>
        <TabsContent value="badges" className="mt-6">
          <BadgesTab />
        </TabsContent>
        <TabsContent value="certificate" className="mt-6">
          <CertificateTab />
        </TabsContent>
        <TabsContent value="favorites" className="mt-6">
          <FavoritesTab />
        </TabsContent>
        <TabsContent value="settings" className="mt-6">
          <SettingsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ─── My Progress Tab ─────────────────────────────────────────────────────────
function ProgressTab() {
  const { scores, badges, lettersRead } = useProgress();

  const zones: { zone: Zone; label: string; colorClass: string }[] = [
    { zone: "moon", label: "Moon", colorClass: "text-zone-moon" },
    { zone: "mars", label: "Mars", colorClass: "text-zone-mars" },
    { zone: "deep", label: "Deep Space", colorClass: "text-zone-deep" },
  ];

  return (
    <div className="space-y-6">
      {/* Zone rings */}
      <section className="rounded-3xl border bg-card p-6 sm:p-8" aria-labelledby="zone-progress-title">
        <h2 id="zone-progress-title" className="font-display text-xl font-semibold">
          Zone Progress
        </h2>
        <div className="mt-6 grid gap-8 sm:grid-cols-3">
          {zones.map(({ zone, label, colorClass }) => {
            const items = hardware.filter((h) => h.zone === zone);
            const visited = items.filter((h) => (scores[h.slug] ?? 0) > 0).length;
            const quizzed = items.filter(
              (h) => (scores[h.slug] ?? 0) >= Math.ceil(h.quiz.length / 2)
            ).length;
            const pct = items.length > 0 ? Math.round((quizzed / items.length) * 100) : 0;
            return (
              <div key={zone} className="flex flex-col items-center gap-3 text-center">
                <ProgressRing value={pct} size={80} label={`${label} progress`} colorClass={colorClass} />
                <div>
                  <p className="font-display text-lg font-semibold">{label}</p>
                  <p className="text-sm text-muted-foreground">
                    {visited}/{items.length} visited · {quizzed}/{items.length} quizzes passed
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Detailed stats */}
      <section className="rounded-3xl border bg-card p-6 sm:p-8" aria-labelledby="detailed-stats-title">
        <h2 id="detailed-stats-title" className="font-display text-xl font-semibold">
          Detailed Stats
        </h2>
        <div className="mt-4 space-y-3">
          {/* Quiz scores per hardware */}
          <div className="grid gap-2 sm:grid-cols-2">
            {hardware.map((h) => {
              const score = scores[h.slug] ?? 0;
              const total = h.quiz.length;
              const passed = score >= Math.ceil(total / 2);
              return (
                <div
                  key={h.slug}
                  className="flex items-center justify-between rounded-xl border px-3 py-2 text-sm"
                >
                  <Link
                    to="/hardware/$slug"
                    params={{ slug: h.slug }}
                    className="truncate font-bold hover:text-primary"
                  >
                    {h.name}
                  </Link>
                  <span
                    className={cn(
                      "ml-2 shrink-0 rounded-full px-2 py-0.5 text-xs font-bold",
                      passed
                        ? "bg-status-talking/15 text-status-talking"
                        : score > 0
                          ? "bg-accent/15 text-accent"
                          : "bg-muted text-muted-foreground"
                    )}
                  >
                    {score > 0 ? `${score}/${total}` : "—"}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Science explainers & timeline */}
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="flex items-center justify-between rounded-xl border px-3 py-2 text-sm">
              <span className="font-bold">Letters read</span>
              <span className="text-muted-foreground">{lettersRead.size} read</span>
            </div>
            <div className="flex items-center justify-between rounded-xl border px-3 py-2 text-sm">
              <span className="font-bold">Timeline explored</span>
              <span className="text-muted-foreground">
                {badges.has("time-traveler") ? "✅ Yes" : "Not yet"}
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── My Badges Tab ───────────────────────────────────────────────────────────
function BadgesTab() {
  const { badges } = useProgress();

  const earned = BADGE_DEFS.filter((b) => badges.has(b.id));
  const locked = BADGE_DEFS.filter((b) => !badges.has(b.id));
  const nextToEarn = locked[0];

  return (
    <div className="space-y-6">
      {/* Earned shelf */}
      <section className="rounded-3xl border bg-card p-6 sm:p-8" aria-labelledby="earned-badges-title">
        <h2 id="earned-badges-title" className="font-display text-xl font-semibold">
          Earned Badges ({earned.length})
        </h2>
        {earned.length === 0 ? (
          <p className="mt-4 text-muted-foreground">
            No badges yet. Start exploring to earn your first one! 🚀
          </p>
        ) : (
          <div className="mt-4 flex flex-wrap gap-3">
            {earned.map((b) => (
              <div
                key={b.id}
                className="flex items-center gap-2 rounded-2xl border border-accent/40 bg-accent/10 px-3 py-2"
              >
                <span className="text-2xl" aria-hidden>
                  {b.emoji}
                </span>
                <div>
                  <p className="text-sm font-bold">{b.name}</p>
                  <p className="text-xs text-muted-foreground">{b.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Next to earn */}
      {nextToEarn && (
        <section className="rounded-3xl border-2 border-dashed border-accent/40 bg-accent/5 p-6 sm:p-8">
          <h2 className="font-display text-lg font-semibold">Next badge to earn</h2>
          <div className="mt-3 flex items-center gap-3">
            <span className="text-3xl" aria-hidden>
              {nextToEarn.emoji}
            </span>
            <div>
              <p className="font-bold">{nextToEarn.name}</p>
              <p className="text-sm text-muted-foreground">{nextToEarn.description}</p>
            </div>
          </div>
        </section>
      )}

      <Link
        to="/badges"
        className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-2 text-sm font-bold text-primary hover:bg-primary/20"
      >
        <Award className="h-4 w-4" /> View all badges
      </Link>
    </div>
  );
}

// ─── My Certificate Tab ──────────────────────────────────────────────────────
function CertificateTab() {
  const { badges, displayName } = useProgress();
  const archivistUnlocked = badges.has("space-archivist");
  const earnedCount = [...badges].filter((b) => b !== "space-archivist").length;

  return (
    <section className="rounded-3xl border bg-card p-6 sm:p-8">
      <h2 className="font-display text-xl font-semibold">Space Archivist Certificate</h2>

      {!archivistUnlocked ? (
        <div className="mt-4 rounded-2xl border border-dashed border-border bg-muted/30 p-8 text-center">
          <Lock className="mx-auto h-10 w-10 text-muted-foreground" aria-hidden />
          <p className="mt-3 font-display text-xl">
            Earn all 9 main badges to unlock your certificate.
          </p>
          <p className="mt-1 text-muted-foreground">
            You have {earnedCount} of 9. Keep going!
          </p>
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          <div className="rounded-2xl border-2 border-accent bg-accent/10 p-6 text-center">
            <p className="text-4xl" aria-hidden>
              🏆
            </p>
            <p className="mt-2 font-display text-2xl font-bold">Certificate unlocked!</p>
            <p className="mt-1 text-muted-foreground">
              Your name: <strong>{displayName || "Space Explorer"}</strong>
            </p>
          </div>
          <Link
            to="/badges"
            className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-2 text-sm font-bold text-accent hover:bg-accent/20"
          >
            <Award className="h-4 w-4" /> View & print certificate
          </Link>
        </div>
      )}
    </section>
  );
}

// ─── Favorites Tab ───────────────────────────────────────────────────────────
function FavoritesTab() {
  const { favorites } = useFavorites();
  const favItems = favorites
    .map((slug) => hardware.find((h) => h.slug === slug))
    .filter(Boolean) as typeof hardware;

  if (favItems.length === 0) {
    return (
      <div className="rounded-3xl border bg-card p-8 text-center">
        <Heart className="mx-auto h-10 w-10 text-muted-foreground" aria-hidden />
        <p className="mt-3 font-display text-xl">No favorites yet</p>
        <p className="mt-1 text-muted-foreground">
          Tap the heart on any machine to save it here! 💛
        </p>
        <Link
          to="/map"
          className="mt-4 inline-block rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:bg-primary/90"
        >
          Explore the map
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {favItems.map((item) => (
        <Link
          key={item.slug}
          to="/hardware/$slug"
          params={{ slug: item.slug }}
          className="group overflow-hidden rounded-2xl border bg-card transition-all hover:-translate-y-1 hover:shadow-lg"
        >
          <img
            src={item.image}
            alt={item.imageAlt}
            className="aspect-[2/1] w-full object-cover"
          />
          <div className="p-4">
            <div className="flex items-center gap-2">
              <StatusBadge status={item.status} />
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-bold">
                {zoneLabels[item.zone]}
              </span>
            </div>
            <p className="mt-2 font-display text-lg font-semibold group-hover:text-primary">
              {item.name}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}

// ─── Settings Tab ────────────────────────────────────────────────────────────
function SettingsTab() {
  const { user, avatar, setAvatar, signOut, deleteAccount } = useAuth();
  const {
    displayName,
    setDisplayName,
    resetProgress,
  } = useProgress();
  const settings = useSettings();
  const syncSettingsToCloud = useSyncSettingsToCloud();
  const navigate = useNavigate();

  // Inline name editing
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(displayName);
  const [nameError, setNameError] = useState("");

  const saveName = () => {
    const trimmed = nameDraft.trim().replace(/<[^>]*>/g, "");
    if (trimmed.length < 2 || trimmed.length > 30) {
      setNameError("Name must be 2–30 characters.");
      return;
    }
    setDisplayName(trimmed);
    setNameDraft(trimmed);
    setEditingName(false);
    setNameError("");
    toast.success("Name updated!");
  };

  const handleTheme = (t: Theme) => {
    settings.setTheme(t);
    setTimeout(syncSettingsToCloud, 100);
  };

  const handleToggle = (key: "reduceMotion" | "largeText" | "readAloud", v: boolean) => {
    if (key === "reduceMotion") settings.setReduceMotion(v);
    else if (key === "largeText") settings.setLargeText(v);
    else settings.setReadAloud(v);
    setTimeout(syncSettingsToCloud, 100);
  };

  return (
    <div className="space-y-6">
      {/* Display name & avatar */}
      <section className="rounded-3xl border bg-card p-6 sm:p-8" aria-labelledby="settings-profile-title">
        <h2 id="settings-profile-title" className="font-display text-xl font-semibold">
          Profile
        </h2>

        {/* Name */}
        <div className="mt-4">
          <Label htmlFor="settings-name" className="font-bold">Display name</Label>
          {editingName ? (
            <div className="mt-1 flex items-center gap-2">
              <input
                id="settings-name"
                type="text"
                value={nameDraft}
                onChange={(e) => setNameDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveName();
                  if (e.key === "Escape") { setEditingName(false); setNameError(""); }
                }}
                maxLength={30}
                autoFocus
                className="flex-1 rounded-xl border border-border bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
                aria-label="Display name"
              />
              <Button size="sm" onClick={saveName}>Save</Button>
              <Button size="sm" variant="ghost" onClick={() => { setEditingName(false); setNameError(""); }}>Cancel</Button>
            </div>
          ) : (
            <div className="mt-1 flex items-center gap-2">
              <span className="font-bold">{displayName || "Space Explorer"}</span>
              <Button size="sm" variant="ghost" onClick={() => { setEditingName(true); setNameDraft(displayName); }}>
                <Pencil className="mr-1 h-3 w-3" /> Edit
              </Button>
            </div>
          )}
          {nameError && (
            <p role="alert" className="mt-1 text-sm font-bold text-destructive">{nameError}</p>
          )}
        </div>

        {/* Avatar */}
        <div className="mt-6">
          <p className="font-bold">Avatar</p>
          <div className="mt-2 max-w-sm">
            <AvatarPicker value={avatar} onChange={setAvatar} size="sm" />
          </div>
        </div>
      </section>

      {/* Preferences */}
      <section className="rounded-3xl border bg-card p-6 sm:p-8" aria-labelledby="settings-prefs-title">
        <h2 id="settings-prefs-title" className="flex items-center gap-2 font-display text-xl font-semibold">
          <Settings2 className="h-5 w-5 text-primary" aria-hidden /> Preferences
        </h2>

        <div className="mt-4 space-y-4">
          <div>
            <p className="mb-2 font-bold">Theme</p>
            <div className="flex gap-2">
              {(["dark", "light", "system"] as Theme[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => handleTheme(t)}
                  className={cn(
                    "rounded-full border px-4 py-1.5 text-sm font-bold capitalize transition-all",
                    settings.theme === t
                      ? "border-primary bg-primary/15 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/40"
                  )}
                  aria-pressed={settings.theme === t}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="pref-text-size">Bigger text</Label>
            <Switch
              id="pref-text-size"
              checked={settings.largeText}
              onCheckedChange={(v) => handleToggle("largeText", v)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="pref-motion">Less motion</Label>
            <Switch
              id="pref-motion"
              checked={settings.reduceMotion}
              onCheckedChange={(v) => handleToggle("reduceMotion", v)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="pref-read-aloud">Read-aloud on by default</Label>
            <Switch
              id="pref-read-aloud"
              checked={settings.readAloud}
              onCheckedChange={(v) => handleToggle("readAloud", v)}
            />
          </div>
        </div>
      </section>

      {/* Privacy note */}
      <div className="flex items-start gap-2 rounded-2xl border border-primary/30 bg-primary/5 px-4 py-3 text-sm">
        <Shield className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
        <p className="text-muted-foreground">
          <strong className="text-foreground">Privacy:</strong> We only save your name, avatar, and progress. No age, school, or photo is collected.
        </p>
      </div>

      {/* Danger zone */}
      <section className="rounded-3xl border border-destructive/30 bg-destructive/5 p-6 sm:p-8" aria-labelledby="danger-zone-title">
        <h2 id="danger-zone-title" className="font-display text-xl font-semibold text-destructive">
          Danger Zone
        </h2>

        <div className="mt-4 space-y-3">
          {/* Reset progress */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                <RotateCcw className="mr-2 h-4 w-4" /> Reset all progress
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reset your progress?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will delete all your badges, quiz scores, and certificate name.
                  <br /><br />
                  <strong>This cannot be undone.</strong>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => { resetProgress(); toast.success("Progress reset."); }}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Yes, reset everything
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Delete account */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete my account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete your account?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete your profile, progress, badges and favorites.
                  <br /><br />
                  <strong>This action cannot be undone.</strong> You'll need to create a new account to start over.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={async () => {
                    resetProgress();
                    await deleteAccount();
                    toast.success("Account deleted.");
                    navigate({ to: "/", replace: true });
                  }}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Yes, delete my account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </section>

      {/* Log out */}
      <Button
        variant="outline"
        className="w-full sm:w-auto"
        onClick={async () => {
          await signOut();
          navigate({ to: "/", replace: true });
        }}
      >
        <LogOut className="mr-2 h-4 w-4" /> Log out
      </Button>
    </div>
  );
}
