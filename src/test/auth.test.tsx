import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import React, { type ReactNode } from "react";
import { AuthProvider, useAuth } from "@/lib/auth";
import { ProgressProvider, useProgress } from "@/lib/progress";
import { FavoritesProvider, useFavorites } from "@/lib/favorites";

describe("AuthProvider authentication and isolation tests", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <AuthProvider>
      <ProgressProvider>
        <FavoritesProvider>{children}</FavoritesProvider>
      </ProgressProvider>
    </AuthProvider>
  );

  it("does not auto-login unknown emails on sign in", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      const res = await result.current.signIn({
        email: "nonexistent@example.com",
        password: "somepassword",
      });
      expect(res.success).toBe(false);
      expect(res.error).toContain("No explorer account found");
    });

    expect(result.current.user).toBeNull();
    expect(window.localStorage.getItem("space-legacy-auth-session")).toBeNull();
  });

  it("performs 1-click quick guest login and persists session", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      const res = await result.current.quickGuestLogin("Commander John");
      expect(res.success).toBe(true);
      expect(res.isLocal).toBe(true);
    });

    expect(result.current.user).not.toBeNull();
    expect(result.current.user?.email).toContain("commanderjohn");
    expect(result.current.isLocalMode).toBe(true);

    const stored = window.localStorage.getItem("space-legacy-auth-session");
    expect(stored).not.toBeNull();
    expect(JSON.parse(stored!).email).toContain("commanderjohn");
  });

  it("registers and signs in with local credentials", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      const res = await result.current.signUp({
        email: "astronaut@example.com",
        password: "securepassword123",
      });
      expect(res.success).toBe(true);
    });

    expect(result.current.user?.email).toBe("astronaut@example.com");

    // Sign out
    await act(async () => {
      await result.current.signOut();
    });

    expect(result.current.user).toBeNull();
    expect(window.localStorage.getItem("space-legacy-auth-session")).toBeNull();

    // Sign in with correct password
    await act(async () => {
      const loginRes = await result.current.signIn({
        email: "astronaut@example.com",
        password: "securepassword123",
      });
      expect(loginRes.success).toBe(true);
      expect(loginRes.isLocal).toBe(true);
    });

    expect(result.current.user?.email).toBe("astronaut@example.com");

    // Sign out and try wrong password
    await act(async () => {
      await result.current.signOut();
    });

    await act(async () => {
      const failRes = await result.current.signIn({
        email: "astronaut@example.com",
        password: "wrongpassword",
      });
      expect(failRes.success).toBe(false);
      expect(failRes.error).toBe("Incorrect password for this explorer account.");
    });

    expect(result.current.user).toBeNull();
  });

  it("isolates data between test1 and test2 accounts", async () => {
    const { result } = renderHook(
      () => ({
        auth: useAuth(),
        progress: useProgress(),
        favorites: useFavorites(),
      }),
      { wrapper }
    );

    // Register test1
    await act(async () => {
      await result.current.auth.signUp({
        email: "test1@example.com",
        password: "password123",
      });
    });

    // test1 updates their display name and favorites
    act(() => {
      result.current.progress.setDisplayName("Test One Commander");
      result.current.favorites.toggleFav("curiosity");
    });

    expect(result.current.progress.displayName).toBe("Test One Commander");
    expect(result.current.favorites.isFav("curiosity")).toBe(true);

    // test1 signs out
    await act(async () => {
      await result.current.auth.signOut();
    });

    expect(result.current.auth.user).toBeNull();

    // Register test2
    await act(async () => {
      await result.current.auth.signUp({
        email: "test2@example.com",
        password: "password123",
      });
    });

    // test2 must have fresh/clean state and not see test1's data
    expect(result.current.progress.displayName).not.toBe("Test One Commander");
    expect(result.current.favorites.isFav("curiosity")).toBe(false);
  });
});
