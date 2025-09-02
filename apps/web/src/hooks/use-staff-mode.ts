import { useUser } from '@stackframe/react';
import { useEffect } from 'react';
import { useStaffModeStore } from '~/stores/staff-mode-store';
import { isStaffUser } from '@appdotbuild/core';

export function useStaffMode() {
  const user = useUser();
  const {
    isStaffModeEnabled,
    setStaffModeEnabled,
    lastInitializedUserId,
    setLastInitializedUserId,
  } = useStaffModeStore();
  const isActualStaff = isStaffUser(user);

  useEffect(() => {
    const userId = user?.id || null;

    // Only reset if this is a different user or first time
    if (lastInitializedUserId !== userId) {
      setStaffModeEnabled(isActualStaff);
      setLastInitializedUserId(userId);
    }
  }, [
    user?.id,
    isActualStaff,
    setStaffModeEnabled,
    lastInitializedUserId,
    setLastInitializedUserId,
  ]);

  const toggleStaffMode = () => {
    setStaffModeEnabled(!isStaffModeEnabled);
  };

  return {
    isStaffMode: isStaffModeEnabled,
    isActualStaff,
    toggleStaffMode,
  };
}
