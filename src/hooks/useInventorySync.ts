"use client";

import { useEffect, useState } from "react";
// @ts-ignore - The user will install this package later
import * as signalR from "@microsoft/signalr";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";

export const useInventorySync = () => {
    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        // Initialize SignalR Connection
        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl(process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "/hubs/inventory") || "http://localhost:5066/hubs/inventory", {
                withCredentials: true
            })
            .withAutomaticReconnect()
            .build();

        setConnection(newConnection);
    }, []);

    useEffect(() => {
        if (connection) {
            connection.start()
                .then(() => {
                    console.log("Connected to InventoryHub");

                    // Listeners
                    connection.on("ItemLocked", (productId: string) => {
                        // Optional: Disallow adding to cart if it's the last item and locked
                    });

                    connection.on("InventoryDepleted", (productId: string) => {
                        toast.error("Một sản phẩm trong giỏ hàng của bạn vừa hết hàng!");
                        // Ideally, we would refresh cart here
                    });
                })
                .catch(e => console.error("Connection failed: ", e));
        }

        return () => {
            if (connection) {
                connection.stop();
            }
        };
    }, [connection, dispatch]);

    return { connection };
};
