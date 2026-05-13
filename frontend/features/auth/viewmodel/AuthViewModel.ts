"use client";

import { useCallback, useState } from "react";
import { useAuthStore } from "./authStore";
import { signIn, signOut, getSession } from "next-auth/react";
import { toast } from "sonner";
import { signupAPI } from "../repositories";

export function useAuthViewModel() {
  const user = useAuthStore((state) => state.user);
  const authenticated = useAuthStore((state) => state.authenticated);
  const setSession = useAuthStore((state) => state.setSession);
  const clearSession = useAuthStore((state) => state.clearSession);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchSession = useCallback(async () => {
    try {
      const session = await getSession();
      if (session && session.user) {
        setSession(session.user as any);
      } else {
        clearSession();
      }
    } catch (error) {
      console.error("Failed to fetch session:", error);
      clearSession();
    }
  }, [setSession, clearSession]);

  const login = useCallback(
    async (email: string, password: string) => {
      setIsSubmitting(true);

      try {
        const res = await signIn("credentials", { email, password, redirect: false });
        if (res?.error) {
          throw new Error(res.error);
        }

        toast.success("Login successful!");
        return true;
      } catch {
        // console.error("Login error:", error);
        toast.error("Login failed! Please check your credentials and try again.");
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [setSession],
  );

  const signup = useCallback(
    async (name: string, email: string, password: string, confirmPassword: string) => {
      if (confirmPassword !== undefined && password !== confirmPassword) {
        toast.error("Passwords do not match");
        return false;
      }

      setIsSubmitting(true);

      try {
        const response = await signupAPI({ name, email, password });
        toast.success("Account created successfully!");
        return true;
      } catch (error: any) {
        // console.error("Signup error:", error);
        toast.error(error.message || "Signup failed");
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [setSession],
  );

  const googleLogin = useCallback(async () => {
    setIsSubmitting(true);

    try {
      await signIn("google", { redirectTo: "/auth/login" });
      // return true;
    } catch {
      // console.error("Google login error:", error);
      toast.error("Google login failed");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [setSession]);

  const googleSignup = useCallback(async () => {
    setIsSubmitting(true);

    try {
      const res = await signIn("google", { redirectTo: "/auth/signup" });
      // return true;
    } catch {
      // console.error("Google signup error:", error);
      toast.error("Google signup failed");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [setSession]);

  const logout = useCallback(() => {
    signOut({ redirect: false });
    clearSession();
    toast.success("Logged out successfully");
  }, [clearSession]);

  const openProfile = useCallback(() => setProfileOpen(true), []);
  const closeProfile = useCallback(() => setProfileOpen(false), []);

  return {
    user,
    authenticated,
    profileOpen,
    isSubmitting,
    fetchSession,
    login,
    signup,
    googleLogin,
    googleSignup,
    logout,
    openProfile,
    closeProfile,
  };
}

