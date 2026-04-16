"use client";

import { useEffect, useState } from "react";
// @ts-ignore - The user will install this package later
import * as signalR from "@microsoft/signalr";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { updateProductStatus } from "@/store/productRealtimeSlice";

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
                        dispatch(updateProductStatus({ productId, quantity: 1 }));
                        toast.info("Một món đồ vừa được giữ chỗ!");
                    });

                    connection.on("InventoryDepleted", (productId: string) => {
                        dispatch(updateProductStatus({ productId, quantity: 0, status: "SOLD_OUT" }));
                        toast.error("Một món đồ vừa hết hàng!");
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
