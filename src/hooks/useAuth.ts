"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/constants";
import { User } from "@/types";
import toast from "react-hot-toast";

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;

  login: (email: string, password: string) => Promise<boolean>;
  signup: (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }) => Promise<boolean>;
  logout: () => void;
  getProfile: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
}

const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,
      isAdmin: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await api.post(API_ENDPOINTS.AUTH_LOGIN, {
            email,
            password,
          });
          const { user, token } = response.data.data;
          set({
            user,
            token,
            isAuthenticated: true,
            isAdmin: user.role === "admin",
            isLoading: false,
          });
          if (typeof window !== "undefined") {
            sessionStorage.setItem("auth-token", token);
          }
          toast.success("Welcome back!");
          return true;
        } catch (error: any) {
          set({ isLoading: false });
          toast.error(
            error.response?.data?.message || "Login failed. Please try again."
          );
          return false;
        }
      },

      signup: async (data: { name: string; email: string; phone: string; password: string }) => {
        set({ isLoading: true });
        try {
          const response = await api.post(API_ENDPOINTS.AUTH_SIGNUP, data);
          const { user, token } = response.data.data;
          set({
            user,
            token,
            isAuthenticated: true,
            isAdmin: user.role === "admin",
            isLoading: false,
          });
          if (typeof window !== "undefined") {
            sessionStorage.setItem("auth-token", token);
          }
          toast.success("Account created successfully!");
          return true;
        } catch (error: any) {
          set({ isLoading: false });
          toast.error(
            error.response?.data?.message || "Signup failed. Please try again."
          );
          return false;
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isAdmin: false,
        });
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("auth-token");
          sessionStorage.removeItem("auth-storage");
        }
        toast.success("Logged out successfully");
      },

      getProfile: async () => {
        try {
          const response = await api.get(API_ENDPOINTS.AUTH_PROFILE);
          const user = response.data.data;
          set({
            user,
            isAuthenticated: true,
            isAdmin: user.role === "admin",
          });
        } catch {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isAdmin: false,
          });
        }
      },

      updateProfile: async (data: Partial<User>) => {
        try {
          const response = await api.put(API_ENDPOINTS.AUTH_PROFILE, data);
          set({ user: response.data.data });
          toast.success("Profile updated successfully");
        } catch (error: any) {
          toast.error(
            error.response?.data?.message || "Failed to update profile"
          );
        }
      },

      setUser: (user: User | null) =>
        set({
          user,
          isAuthenticated: !!user,
          isAdmin: user?.role === "admin",
        }),
      setToken: (token: string | null) => {
        set({ token });
        if (typeof window !== "undefined") {
          if (token) {
            sessionStorage.setItem("auth-token", token);
          } else {
            sessionStorage.removeItem("auth-token");
          }
        }
      },
    }),
    {
      name: "auth-storage",
      storage: {
        getItem: (name) => {
          if (typeof window === "undefined") return null;
          const value = sessionStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: (name, value) => {
          if (typeof window !== "undefined") {
            sessionStorage.setItem(name, JSON.stringify(value));
          }
        },
        removeItem: (name) => {
          if (typeof window !== "undefined") {
            sessionStorage.removeItem(name);
          }
        },
      },
      partialize: (state: any) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        isAdmin: state.isAdmin,
      }),
    }
  )
);

export default useAuth;
