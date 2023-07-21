import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SavedState {
  shownDrag: boolean;
  setShownDrag: () => void;
}

export const useSavedStore = create<SavedState>()(
  persist(
    (set) => ({
      shownDrag: false,
      setShownDrag: () => set({ shownDrag: true }),
    }),
    {
      name: 'saved-store',
    }
  )
)