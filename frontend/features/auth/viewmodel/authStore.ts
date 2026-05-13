import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../models/types";

type AuthState = {
  user: User | null;
  authenticated: boolean;
  setSession: (user: User) => void;
  clearSession: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      authenticated: false,
      setSession: (user) => set({ user, authenticated: true }),
      clearSession: () => set({ user: null, authenticated: false }),
    }),
    {
      name: "auth-store",
      partialize: (state) => ({
        user: state.user,
        authenticated: state.authenticated
      }),
    },
  ),
);
