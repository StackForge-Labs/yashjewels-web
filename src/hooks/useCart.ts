import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { setCartStart, setCartSuccess, setCartFailure, clearCartLocal } from "@/store/cartSlice";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";

export const useCart = () => {
    const dispatch = useDispatch<AppDispatch>();
    const cart = useSelector((state: RootState) => state.cart);
    const { isAuthenticated } = useSelector((state: RootState) => state.user);

    const fetchCart = useCallback(async () => {
        if (!isAuthenticated) return;
        
        try {
            dispatch(setCartStart());
            const { data } = await axiosInstance.get("/v1/cart");
            if (data.success) {
                dispatch(setCartSuccess(data.data));
            } else {
                dispatch(setCartFailure(data.message || "Failed to load cart."));
            }
        } catch (error: any) {
            dispatch(setCartFailure(error.response?.data?.message || "Error loading cart."));
        }
    }, [dispatch, isAuthenticated]);

    const addToCart = async (productId: string, quantity: number = 1, isGift: boolean = false, giftMessage?: string) => {
        if (!isAuthenticated) {
            toast.error("Please login to add items to your cart.");
            return false;
        }

        try {
            const { data } = await axiosInstance.post("/v1/cart/items", {
                productId,
                quantity,
                isGift,
                giftMessage
            });
            
            if (data.success) {
                toast.success("Added to cart successfully.");
                await fetchCart(); // Re-sync entire cart to get accurate drift pct and totals
                return true;
            }
            toast.error(data.message || "Failed to add to cart.");
            return false;
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Error adding item.");
            return false;
        }
    };

    const updateQuantity = async (cartItemId: string, quantity: number) => {
        if (quantity < 1) return;
        
        try {
            const { data } = await axiosInstance.patch(`/v1/cart/items/${cartItemId}`, { quantity });
            if (data.success) {
                await fetchCart();
            } else {
                toast.error(data.message || "Failed to update quantity.");
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Error updating item.");
        }
    };

    const removeItem = async (cartItemId: string) => {
        try {
            const { data } = await axiosInstance.delete(`/v1/cart/items/${cartItemId}`);
            if (data.success) {
                toast.success("Item removed.");
                await fetchCart();
            } else {
                toast.error(data.message || "Failed to remove item.");
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Error removing item.");
        }
    };

    const clearCart = async () => {
        try {
            const { data } = await axiosInstance.delete("/v1/cart");
            if (data.success) {
                dispatch(clearCartLocal());
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Error clearing cart.");
        }
    };

    return {
        cart,
        fetchCart,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart
    };
};
