import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, Moon, Sun, Settings2, LogOut, UserRound, Award } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/lib/settings";
import { useAuth } from "@/lib/auth";
import { getAvatar } from "@/lib/avatars";

const links = [
  { to: "/map", label: "Map" },
  { to: "/timeline", label: "Timeline" },
  { to: "/where-now", label: "Where now?" },
  { to: "/science", label: "Science" },
  { to: "/badges", label: "Badges" },
  { to: "/teachers", label: "Teachers" },
] as const;

export function ThemeToggle() {
  const { theme, setTheme } = useSettings();
  const next = theme === "dark" ? "light" : "dark";
  return (
    <Button variant="ghost" size="icon" className="h-11 w-11 rounded-full" onClick={() => setTheme(next)} aria-label={`Switch to ${next} mode`}>
      {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
}

function SettingsMenu() {
  const s = useSettings();
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-11 w-11 rounded-full" aria-label="Reading and motion settings">
          <Settings2 className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-64 space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="dark-mode">Dark mode</Label>
          <Switch id="dark-mode" checked={s.theme === "dark"} onCheckedChange={(v) => s.setTheme(v ? "dark" : "light")} />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="big-text">Bigger text</Label>
          <Switch id="big-text" checked={s.largeText} onCheckedChange={s.setLargeText} />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="less-motion">Less motion</Label>
          <Switch id="less-motion" checked={s.reduceMotion} onCheckedChange={s.setReduceMotion} />
        </div>
      </PopoverContent>
    </Popover>
  );
}

function AccountButton() {
  const { user, avatar, signOut } = useAuth();
  const navigate = useNavigate();
  const avatarDef = getAvatar(avatar ?? "astronaut");

  if (!user) {
    return (
      <Button asChild size="sm" className="h-11 rounded-full px-5 font-bold">
        <Link to="/login" search={{ redirect: "", message: "" }}>Log in</Link>
      </Button>
    );
  }
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-11 w-11 rounded-full text-lg"
          aria-label="Your account"
        >
          <span aria-hidden>{avatarDef.emoji}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-56 p-2">
        <p className="truncate px-2 pb-2 text-xs text-muted-foreground">{user.email}</p>
        <Link
          to="/profile"
          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold hover:bg-muted"
        >
          <UserRound className="h-4 w-4" aria-hidden /> Profile
        </Link>
        <Link
          to="/badges"
          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold hover:bg-muted"
        >
          <Award className="h-4 w-4" aria-hidden /> Badges
        </Link>
        <div className="my-1 border-t border-border" />
        <button
          type="button"
          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-muted-foreground hover:bg-muted hover:text-foreground"
          onClick={async () => {
            await signOut();
            navigate({ to: "/", replace: true });
          }}
        >
          <LogOut className="h-4 w-4" aria-hidden /> Log out
        </button>
      </PopoverContent>
    </Popover>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:rounded focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground">Skip to content</a>
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-2 px-4">
        <Link to="/" className="mr-auto font-display text-xl font-bold tracking-wide">
          SPACE <span className="text-primary">LEGACY</span>
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="rounded-full px-3 py-2 text-sm font-bold text-muted-foreground hover:bg-muted hover:text-foreground" activeProps={{ className: "bg-muted text-foreground" }}>
              {l.label}
            </Link>
          ))}
        </nav>
        <ThemeToggle />
        <SettingsMenu />
        <AccountButton />
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-11 w-11 lg:hidden" aria-label="Open menu"><Menu className="h-5 w-5" /></Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetTitle className="font-display">Explore</SheetTitle>
            <nav className="mt-6 flex flex-col gap-1" aria-label="Mobile">
              {links.map((l) => (
                <Link key={l.to} to={l.to} className="rounded-xl px-4 py-3 text-lg font-bold hover:bg-muted">{l.label}</Link>
              ))}
              <Link to="/credits" className="rounded-xl px-4 py-3 text-lg font-bold hover:bg-muted">Credits</Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="relative z-10 mt-20 border-t border-border/60 py-8 text-center text-sm text-muted-foreground">
      <p>Made for the NASA Space Apps Challenge. Not an official NASA site. <Link to="/credits" className="underline hover:text-foreground">Sources & credits</Link></p>
    </footer>
  );
}
