import { createClient } from "@/utils/supabase/client";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { create } from "zustand";

// Zustand store for login state
interface LoginState {
  isLoading: boolean;
  error: string | null;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useLoginStore = create<LoginState>((set) => ({
  isLoading: false,
  error: null,
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));

// Zustand store for registration state
interface RegistrationState {
  isLoading: boolean;
  error: string | null;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useRegistrationStore = create<RegistrationState>((set) => ({
  isLoading: false,
  error: null,
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));

export const useRegistration = () => {
  const { setLoading, setError } = useRegistrationStore((state) => state);
  return useMutation({
    mutationFn: async (data: {
      email: string;
      password: string;
      name: string;
    }) => {
      const client = createClient();
      const { data: response, error } = await client.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            display_name: data.name,
          },
        },
      });
      if (error) {
        throw new Error(error.message);
      }
      return response;
    },
    onMutate: () => {
      setLoading(true);
      setError(null);
    },
    onSuccess: (data) => {
      setLoading(false);
      toast.success(
        "Registration successful! Please check your email to verify your account."
      );
    },
    onError: (error) => {
      setLoading(false);
      setError(error.message);
      toast.error("Registration failed");
    },
  });
};
export const useLogin = () => {
  const { setLoading, setError } = useLoginStore((state) => state);
  const client = createClient();
  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const { data: response, error } = await client.auth.signInWithPassword(
        data
      );
      if (error) {
        throw new Error(error.message);
      }
      return response;
    },
    onMutate: () => {
      setLoading(true);
      setError(null);
    },
    onSuccess: (data) => {
      setLoading(false);
      toast.success("Successfully logged in");
    },
    onError: (error) => {
      setLoading(false);
      setError(error.message);
      toast.error("Login failed");
    },
  });
};
