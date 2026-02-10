import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Profile } from '@/types/database';

interface ProfileState {
  activeProfile: Profile | null;
  profiles: Profile[];
}

interface ProfileActions {
  setActiveProfile: (profile: Profile) => void;
  setProfiles: (profiles: Profile[]) => void;
  switchProfile: (profileId: string) => void;
  updateActiveProfile: (data: Partial<Profile>) => void;
}

export const useProfileStore = create<ProfileState & ProfileActions>()(
  persist(
    (set, get) => ({
      activeProfile: null,
      profiles: [],

      setActiveProfile: (profile) => set({ activeProfile: profile }),

      setProfiles: (profiles) => set({ profiles }),

      switchProfile: (profileId) => {
        const target = get().profiles.find((p) => p.id === profileId);
        if (target) {
          set({ activeProfile: target });
        }
      },

      updateActiveProfile: (data) =>
        set((state) => ({
          activeProfile: state.activeProfile
            ? { ...state.activeProfile, ...data }
            : null,
          profiles: state.profiles.map((p) =>
            p.id === state.activeProfile?.id ? { ...p, ...data } : p
          ),
        })),
    }),
    {
      name: 'fittrack-profile',
      partialize: (state) => ({
        activeProfile: state.activeProfile,
        profiles: state.profiles,
      }),
    }
  )
);
