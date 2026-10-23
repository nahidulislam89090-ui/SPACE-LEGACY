import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Map } from "lucide-react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SettingsProvider, settingsBootScript } from "@/lib/settings";
import { AuthProvider } from "@/lib/auth";
import { ProgressProvider } from "@/lib/progress";
import { FavoritesProvider } from "@/lib/favorites";
import { SiteHeader, SiteFooter } from "@/components/space/SiteHeader";
import { Toaster } from "@/components/ui/sonner";
import { GlobalErrorScreen } from "@/components/space/states";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-background px-4">
      <div className="mx-auto max-w-md text-center animate-rise">
        {/* Floating rocket drifting across */}
        <div className="relative mx-auto mb-6 flex h-32 w-32 items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-primary/10" />
          <span className="text-6xl" aria-hidden>🚀</span>
          {/* Little stars */}
          <span className="absolute top-2 right-4 text-xl" aria-hidden>✨</span>
          <span className="absolute bottom-3 left-2 text-lg" aria-hidden>⭐</span>
        </div>
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent">Lost in space</p>
        <h1 className="mt-3 font-display text-3xl font-bold text-foreground">
          This machine drifted off the map
        </h1>
        <p className="mt-3 text-muted-foreground">
          The page you're looking for floated away into deep space.
          Let's get you back on course!
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            🏠 Home base
          </Link>
          <Link
            to="/map"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-bold text-foreground hover:bg-muted transition-colors"
          >
            <Map className="h-4 w-4" aria-hidden /> Mission map
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <GlobalErrorScreen
      title="Something went wrong in mission control! 🛸"
      body="Our engineers have been notified. Try again or head back to the home base."
      onRetry={() => {
        router.invalidate();
        reset();
      }}
    />
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "SPACE LEGACY — NASA's machines left in space" },
      { name: "description", content: "An interactive storybook museum about NASA hardware left on the Moon, Mars and in deep space." },
      { name: "theme-color", content: "#141826" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&family=Fredoka:wght@500;600;700&display=swap" },
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: settingsBootScript }} />
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <SettingsProvider>
        <AuthProvider>
          <ProgressProvider>
            <FavoritesProvider>
              <div className="starfield flex min-h-screen flex-col">
                <SiteHeader />
                <main id="main" className="relative z-10 flex-1">
                  <Outlet />
                </main>
                <SiteFooter />
              </div>
              <Toaster />
            </FavoritesProvider>
          </ProgressProvider>
        </AuthProvider>
      </SettingsProvider>
    </QueryClientProvider>
  );
}
