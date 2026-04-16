"use client";

import { useInventorySync } from "@/hooks/useInventorySync";

export const SignalRWatcher = () => {
    useInventorySync();
    return null;
};
