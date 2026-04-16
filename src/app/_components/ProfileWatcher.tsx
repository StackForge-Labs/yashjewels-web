"use client";

import { useProfile } from "@/hooks/useAuth";
import { useOrderNotifications } from "@/hooks/useOrderNotifications";

export const ProfileWatcher = () => {
    // This hook will automatically fetch the profile and dispatch to Redux
    const { data: profile } = useProfile();
    
    // Initialize SignalR listener if user is logged in
    useOrderNotifications(profile?.id);
    
    return null;
};
