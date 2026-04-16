"use client";

import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { getAccessToken } from "@/lib/api-client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export function useOrderNotifications(userId?: string) {
    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!userId) return;

        const token = getAccessToken();
        const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5066/api/v1").replace("/api/v1", "");
        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl(`${baseUrl}/hubs/orders`, {
                accessTokenFactory: () => token || ""
            })
            .withAutomaticReconnect()
            .configureLogging(signalR.LogLevel.Information)
            .build();

        setConnection(newConnection);
    }, [userId]);

    useEffect(() => {
        if (connection) {
            connection.start()
                .then(() => {
                    // Join user-specific group
                    connection.invoke("SubscribeToUser", userId);

                    connection.on("ReceiveOrderStatusUpdate", (data: any) => {
                        console.log("--> RECEIVED ORDER STATUS UPDATE:", data);
                        
                        toast.info(`Order #${data.orderId.substring(0,8)}... Status: ${data.newStatus}`, {
                            description: data.message,
                            duration: 5000,
                        });

                        // Invalidate relevant queries
                        queryClient.invalidateQueries({ queryKey: ["orders"] });
                        queryClient.invalidateQueries({ queryKey: ["order", data.orderId] });
                        queryClient.invalidateQueries({ queryKey: ["profile"] });
                    });
                })
                .catch(err => console.error("--> SIGNALR CONNECTION ERROR:", err));

            return () => {
                connection.stop();
            };
        }
    }, [connection, queryClient]);

    return { connection };
}
