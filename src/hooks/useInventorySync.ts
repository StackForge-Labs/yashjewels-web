"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useEffect, useState, useRef } from "react";
// @ts-ignore - The user will install this package later
import * as signalR from "@microsoft/signalr";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { updateProductStatus } from "@/store/productRealtimeSlice";
import { fetchCart } from "@/store/cartSlice";

export const useInventorySync = () => {
    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
    const dispatch = useDispatch<AppDispatch>();
    const cartItems = useSelector((state: RootState) => state.cart.items);
    const { isAuthenticated } = useSelector((state: RootState) => state.user);

    // Dùng Ref để listener luôn lấy được giá trị mới nhất mà ko cần re-subscribe
    const cartItemsRef = useRef(cartItems);
    const authRef = useRef(isAuthenticated);

    useEffect(() => {
        cartItemsRef.current = cartItems;
        authRef.current = isAuthenticated;
    }, [cartItems, isAuthenticated]);

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

                    // ItemLocked: Sản phẩm đang bị một người khác giữ chỗ trong Checkout
                    connection.on("ItemLocked", (productId: string) => {
                        dispatch(updateProductStatus({ productId, isLocked: true }));

                        // Nếu item đang ở trong giỏ hàng của chính mình, re-fetch để cập nhật UI
                        if (authRef.current && cartItemsRef.current.some(item => item.productId.toLowerCase() === productId.toLowerCase())) {
                            dispatch(fetchCart());
                        }
                    });

                    // InventoryDepleted: Sản phẩm đã hết hàng hẳn (đã được bán thành công)
                    connection.on("InventoryDepleted", (productId: string) => {
                        dispatch(updateProductStatus({ productId, quantity: 0, status: "SOLD_OUT", isLocked: false }));

                        // Nếu item đang ở trong giỏ hàng, re-fetch để cập nhật nhãn Hết hàng
                        if (authRef.current && cartItemsRef.current.some(item => item.productId.toLowerCase() === productId.toLowerCase())) {
                            dispatch(fetchCart());
                        }
                    });

                    // InventoryRestocked: Sản phẩm vừa được nhập kho (không phải Giữ chỗ!)
                    connection.on("InventoryRestocked", (productId: string) => {
                        dispatch(updateProductStatus({ productId, quantity: 1, status: "ACTIVE", isLocked: false }));

                        // Nếu item đang ở trong giỏ hàng, re-fetch để cập nhật UI
                        if (authRef.current && cartItemsRef.current.some(item => item.productId.toLowerCase() === productId.toLowerCase())) {
                            dispatch(fetchCart());
                        }
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
