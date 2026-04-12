"use client";

import { useProfile } from "@/hooks/useAuth";

export const ProfileWatcher = () => {
    // This hook will automatically fetch the profile and dispatch to Redux if enable condition is met
    useProfile();
    return null;
};
