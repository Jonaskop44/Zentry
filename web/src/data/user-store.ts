import { User } from "@/types/user.types";
import { create } from "zustand";

interface UserState {
  user: User;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: {} as User,
  isAuthenticated: false,
  setUser: (user: User) => set({ user, isAuthenticated: !!user.id }),
  logout: () => {
    set({ user: {} as User, isAuthenticated: false });
  },
}));
