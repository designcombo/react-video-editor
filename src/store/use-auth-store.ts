import { User } from "@/interfaces/editor";
import { create } from "zustand";

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  signOut: () => Promise<void>;
  setUser: (user: User | null) => void;
  signinWithMagicLink: ({ email }: { email: string }) => Promise<any>;
  signinWithGithub: () => Promise<any>;
}

const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  isAuthenticated: false,
  signinWithGithub: async () => {},
  signinWithMagicLink: async () => {},

  signOut: async () => {
    set({ user: null, isAuthenticated: false });
  },
}));

export default useAuthStore;
