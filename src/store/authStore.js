import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      userRole: null, // "lister" | "viewer" | null

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      setUserRole: (role) => set({ userRole: role }),
      
      updateUserProfile: (profileData) => set((state) => ({
        user: {
          ...state.user,
          ...profileData,
        }
      })),
      
      logout: () => set({
        user: null,
        isAuthenticated: false,
        userRole: null,
        error: null,
      }),

      clearError: () => set({ error: null }),
    }),
    {
      name: "feedify-auth-store",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        userRole: state.userRole,
      }),
    }
  )
);
