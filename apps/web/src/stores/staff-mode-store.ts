import { create } from 'zustand';

interface StaffModeState {
  isStaffModeEnabled: boolean;
  // we need this to prevent resetting the staff mode between page navigation
  lastInitializedUserId: string | null;
  setStaffModeEnabled: (enabled: boolean) => void;
  setLastInitializedUserId: (id: string | null) => void;
}

export const useStaffModeStore = create<StaffModeState>((set) => ({
  isStaffModeEnabled: false,
  lastInitializedUserId: null,
  setStaffModeEnabled: (enabled) => set({ isStaffModeEnabled: enabled }),
  setLastInitializedUserId: (id) => set({ lastInitializedUserId: id }),
}));
