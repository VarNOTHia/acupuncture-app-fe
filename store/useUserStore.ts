import { create } from "zustand";

interface UserState {
  username?: string;
  location?: {
    latitude: number,
    longitude: number,
  }
  setUsername: (username: string) => void;
  setLocation: (latitude: number, longitude: number) => void;
}

export const useUserStore = create<UserState>((set) => ({
  username: undefined,
  location: undefined,

  setUsername: (username) => set({ username }),
  setLocation: ((latitude: number, longitude: number) => set({
    location: {
      latitude, longitude
    }
  }))
}));