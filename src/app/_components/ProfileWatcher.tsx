"use client";

import { useEffect } from "react";
import { useProfile } from "@/hooks/useAuth";
import { useOrderNotifications } from "@/hooks/useOrderNotifications";
import { useWishlist } from "@/hooks/useWishlist";

export const ProfileWatcher = () => {
    const { data: profile } = useProfile();
    const { loadWishlist } = useWishlist();

    useOrderNotifications(profile?.id);

    useEffect(() => {
        if (profile?.id) {
            loadWishlist();
        }
    }, [profile?.id]);

    return null;
};
