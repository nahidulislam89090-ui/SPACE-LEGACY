import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { AvatarKey } from "./avatars";
import { safeGet, safeSet, safeRemove } from "./safeStorage";

export interface LocalAccount {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  avatar: AvatarKey;
}

const LOCAL_SESSION_KEY = "space-legacy-auth-session";
const LOCAL_ACCOUNTS_KEY = "space-legacy-local-accounts";

function makeLocalUser(id: string, email: string, createdAt: string): User {
  return {
    id,
    app_metadata: { provider: "local" },
    user_metadata: { email, full_name: email.split("@")[0] },
    aud: "authenticated",
    confirmation_sent_at: createdAt,
    recovery_sent_at: null,
    email_change_sent_at: null,
    new_email: null,
    invited_at: null,
    action_link: null,
    email,
    phone: "",
    created_at: createdAt,
    confirmed_at: createdAt,
    email_confirmed_at: createdAt,
    phone_confirmed_at: null,
    last_sign_in_at: new Date().toISOString(),
    role: "authenticated",
    updated_at: new Date().toISOString(),
    identities: [],
    factors: [],
  } as unknown as User;
}

async function hashPassword(password: string): Promise<string> {
  if (typeof crypto !== "undefined" && crypto?.subtle) {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(password + "_space_legacy_salt");
      const hash = await crypto.subtle.digest("SHA-256", data);
      return Array.from(new Uint8Array(hash))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    } catch {
      // Fallback
    }
  }
  return btoa(password);
}

function getLocalAccounts(): Record<string, LocalAccount> {
  try {
    const raw = safeGet(LOCAL_ACCOUNTS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveLocalAccounts(accs: Record<string, LocalAccount>) {
  safeSet(LOCAL_ACCOUNTS_KEY, JSON.stringify(accs));
}

function getStoredLocalSession(): User | null {
  try {
    const raw = safeGet(LOCAL_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

interface AuthResponse {
  success: boolean;
  error?: string;
  session?: boolean;
  isLocal?: boolean;
  needsEmailConfirmation?: boolean;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  avatar: AvatarKey;
  createdAt: string | null;
  isLocalMode: boolean;
  signIn: (credentials: { email: string; password: string }) => Promise<AuthResponse>;
  signUp: (credentials: { email: string; password: string }) => Promise<AuthResponse>;
  quickGuestLogin: (displayName?: string) => Promise<AuthResponse>;
  signOut: () => Promise<void>;
  setAvatar: (key: AvatarKey) => void;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthState>({
  user: null,
  loading: true,
  avatar: "astronaut",
  createdAt: null,
  isLocalMode: false,
  signIn: async () => ({ success: false }),
  signUp: async () => ({ success: false }),
  quickGuestLogin: async () => ({ success: false }),
  signOut: async () => {},
  setAvatar: () => {},
  deleteAccount: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [avatar, setAvatarState] = useState<AvatarKey>("astronaut");
  const [createdAt, setCreatedAt] = useState<string | null>(null);
  const [isLocalMode, setIsLocalMode] = useState(false);

  // Initialize session on mount
  useEffect(() => {
    let isMounted = true;

    // Check stored local session first
    const localUser = getStoredLocalSession();
    if (localUser) {
      setUser(localUser);
      setIsLocalMode(true);
      setLoading(false);
    }

    // Supabase auth state change subscription
    let sub: { unsubscribe: () => void } | undefined;
    try {
      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        if (!isMounted) return;
        if (session?.user) {
          setUser(session.user);
          setIsLocalMode(false);
          safeRemove(LOCAL_SESSION_KEY);
        } else if (!localUser) {
          setUser(null);
          setIsLocalMode(false);
        }
        setLoading(false);
      });
      sub = data.subscription;
    } catch {
      // Ignore if Supabase client throws
    }

    // Supabase getUser check with short timeout to prevent blocking on dead endpoints
    const timeout = new Promise<{ data: { user: null } }>((resolve) =>
      setTimeout(() => resolve({ data: { user: null } }), 2000)
    );

    Promise.race([
      supabase.auth.getUser().catch(() => ({ data: { user: null } })),
      timeout,
    ])
      .then(({ data }) => {
        if (!isMounted) return;
        if (data?.user) {
          setUser(data.user);
          setIsLocalMode(false);
          safeRemove(LOCAL_SESSION_KEY);
        }
        setLoading(false);
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
      sub?.unsubscribe();
    };
  }, []);

  // Sync avatar and created_at whenever user changes
  useEffect(() => {
    if (!user) {
      setAvatarState("astronaut");
      setCreatedAt(null);
      return;
    }
    setCreatedAt(user.created_at ?? null);

    // Retrieve saved avatar from safeStorage
    const cachedAvatar = safeGet(`space-legacy-avatar-${user.id}`);
    if (cachedAvatar) {
      setAvatarState(cachedAvatar as AvatarKey);
    }

    // If online Supabase is available, sync avatar
    (async () => {
      try {
        const { data } = await supabase
          .from("explorer_profiles")
          .select("avatar")
          .eq("user_id", user.id)
          .maybeSingle();
        if (data?.avatar) {
          setAvatarState(data.avatar as AvatarKey);
          safeSet(`space-legacy-avatar-${user.id}`, data.avatar);
        }
      } catch {
        // Offline / local fallback
      }
    })();
  }, [user]);

  const signIn = useCallback(
    async ({ email, password }: { email: string; password: string }): Promise<AuthResponse> => {
      const cleanEmail = email.trim().toLowerCase();

      // 1. Attempt Supabase login first with a 3.5s timeout
      try {
        const timeoutPromise = new Promise<{ data: any; error: any }>((_, reject) =>
          setTimeout(() => reject(new Error("NETWORK_TIMEOUT")), 3500)
        );

        const { data, error } = await Promise.race([
          supabase.auth.signInWithPassword({ email: cleanEmail, password }),
          timeoutPromise,
        ]);

        if (!error && data?.session?.user) {
          setUser(data.session.user);
          setIsLocalMode(false);
          safeRemove(LOCAL_SESSION_KEY);
          return { success: true, isLocal: false };
        }

        // If it's a legitimate auth failure from an active Supabase server (like wrong password or email unconfirmed)
        if (
          error &&
          error.status !== 530 &&
          !error.message?.includes("<none>") &&
          error.name !== "AuthRetryableFetchError"
        ) {
          return { success: false, error: error.message };
        }
      } catch (err) {
        console.warn("[Auth] Supabase endpoint unreachable, checking local accounts.", err);
      }

      // 2. Check local accounts
      const accounts = getLocalAccounts();
      const existing = accounts[cleanEmail];
      const hashed = await hashPassword(password);

      if (existing) {
        if (existing.passwordHash === hashed) {
          const localUser = makeLocalUser(existing.id, cleanEmail, existing.createdAt);
          safeSet(LOCAL_SESSION_KEY, JSON.stringify(localUser));
          setUser(localUser);
          setIsLocalMode(true);
          if (existing.avatar) setAvatarState(existing.avatar);
          return { success: true, isLocal: true };
        } else {
          return { success: false, error: "Incorrect password for this explorer account." };
        }
      }

      // If user typed credentials when Supabase is offline/530 and no local account exists yet:
      // Auto-register and sign in as local explorer!
      const newId = "local-" + Math.random().toString(36).slice(2, 10);
      const now = new Date().toISOString();
      accounts[cleanEmail] = {
        id: newId,
        email: cleanEmail,
        passwordHash: hashed,
        createdAt: now,
        avatar: "astronaut",
      };
      saveLocalAccounts(accounts);
      const localUser = makeLocalUser(newId, cleanEmail, now);
      safeSet(LOCAL_SESSION_KEY, JSON.stringify(localUser));
      setUser(localUser);
      setIsLocalMode(true);
      return { success: true, isLocal: true };
    },
    []
  );

  const signUp = useCallback(
    async ({ email, password }: { email: string; password: string }): Promise<AuthResponse> => {
      const cleanEmail = email.trim().toLowerCase();

      // 1. Try Supabase signUp with 3.5s timeout
      try {
        const timeoutPromise = new Promise<{ data: any; error: any }>((_, reject) =>
          setTimeout(() => reject(new Error("NETWORK_TIMEOUT")), 3500)
        );

        const { data, error } = await Promise.race([
          supabase.auth.signUp({ email: cleanEmail, password }),
          timeoutPromise,
        ]);

        if (!error) {
          if (data?.session?.user) {
            setUser(data.session.user);
            setIsLocalMode(false);
            safeRemove(LOCAL_SESSION_KEY);
            return { success: true, session: true, isLocal: false };
          }
          if (data?.user) {
            // Live Supabase requiring email confirmation
            return {
              success: true,
              session: false,
              needsEmailConfirmation: true,
              isLocal: false,
            };
          }
        }

        if (
          error &&
          error.status !== 530 &&
          !error.message?.includes("<none>") &&
          error.name !== "AuthRetryableFetchError"
        ) {
          return { success: false, error: error.message };
        }
      } catch (err) {
        console.warn("[Auth] Supabase endpoint unreachable, registering local account.", err);
      }

      // 2. Create local explorer account
      const accounts = getLocalAccounts();
      const hashed = await hashPassword(password);
      const newId = "local-" + Math.random().toString(36).slice(2, 10);
      const now = new Date().toISOString();

      accounts[cleanEmail] = {
        id: newId,
        email: cleanEmail,
        passwordHash: hashed,
        createdAt: now,
        avatar: "astronaut",
      };
      saveLocalAccounts(accounts);

      const localUser = makeLocalUser(newId, cleanEmail, now);
      safeSet(LOCAL_SESSION_KEY, JSON.stringify(localUser));
      setUser(localUser);
      setIsLocalMode(true);
      return { success: true, session: true, isLocal: true };
    },
    []
  );

  const quickGuestLogin = useCallback(async (displayName?: string): Promise<AuthResponse> => {
    const id = "guest-" + Math.random().toString(36).slice(2, 9);
    const suffix = Math.floor(1000 + Math.random() * 9000);
    const name = displayName?.trim() || `Explorer-${suffix}`;
    const cleanEmail = `${name.toLowerCase().replace(/[^a-z0-9]/g, "")}@spacelegacy.local`;
    const now = new Date().toISOString();
    const localUser = makeLocalUser(id, cleanEmail, now);

    safeSet(LOCAL_SESSION_KEY, JSON.stringify(localUser));
    setUser(localUser);
    setIsLocalMode(true);
    return { success: true, isLocal: true };
  }, []);

  const signOut = useCallback(async () => {
    safeRemove(LOCAL_SESSION_KEY);
    try {
      await supabase.auth.signOut();
    } catch {
      // Ignore offline error
    }
    setUser(null);
    setIsLocalMode(false);
    setAvatarState("astronaut");
    setCreatedAt(null);
  }, []);

  const setAvatar = useCallback(
    (key: AvatarKey) => {
      setAvatarState(key);
      if (user) {
        safeSet(`space-legacy-avatar-${user.id}`, key);
        const accounts = getLocalAccounts();
        const accountKey = user.email?.toLowerCase();
        const account = accountKey ? accounts[accountKey] : undefined;
        if (account) {
          account.avatar = key;
          saveLocalAccounts(accounts);
        }
        try {
          void supabase.from("explorer_profiles").update({ avatar: key }).eq("user_id", user.id);
        } catch {
          // Ignore offline error
        }
      }
    },
    [user]
  );

  const deleteAccount = useCallback(async () => {
    if (!user) return;
    safeRemove(`space-legacy-avatar-${user.id}`);
    safeRemove(LOCAL_SESSION_KEY);
    const accounts = getLocalAccounts();
    if (user.email && accounts[user.email.toLowerCase()]) {
      delete accounts[user.email.toLowerCase()];
      saveLocalAccounts(accounts);
    }
    try {
      await supabase.from("explorer_profiles").delete().eq("user_id", user.id);
    } catch {
      // Ignore
    }
    try {
      await supabase.auth.signOut();
    } catch {
      // Ignore
    }
    setUser(null);
    setIsLocalMode(false);
    setAvatarState("astronaut");
    setCreatedAt(null);
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        avatar,
        createdAt,
        isLocalMode,
        signIn,
        signUp,
        quickGuestLogin,
        signOut,
        setAvatar,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
