"use client";

import { useInventorySync } from "@/hooks/useInventorySync";

/**
 * Headless component that initializes and maintains the SignalR connection
 * for real-time inventory updates across the entire application.
 */
export const InventoryWatcher = () => {
    useInventorySync();
    return null;
};
