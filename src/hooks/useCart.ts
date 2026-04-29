import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { clearCartLocal, fetchCart as fetchCartThunk } from "@/store/cartSlice";
import axiosInstance from "@/lib/api-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const useCart = () => {
    const dispatch = useDispatch<AppDispatch>();
    const cart = useSelector((state: RootState) => state.cart);
    const { isAuthenticated } = useSelector((state: RootState) => state.user);
    const router = useRouter();

    const fetchCart = useCallback(async () => {
        if (!isAuthenticated) return;
        dispatch(fetchCartThunk());
    }, [dispatch, isAuthenticated]);

    const addToCart = async (productId: string, quantity: number = 1, isGift: boolean = false, giftMessage?: string) => {
        if (!isAuthenticated) {
            toast.error("Please login to add products to your cart.");
            sessionStorage.setItem("redirect_after_login", window.location.pathname + window.location.search);
            router.push("/auth/login");
            return false;
        }

        try {
            const { data } = await axiosInstance.post("/cart/items", {
                productId,
                quantity,
                isGift,
                giftMessage
            });

            if (data.success) {
                toast.success("Added to cart successfully");
                await fetchCart();
                return true;
            } else {
                toast.error(data.message || "Could not add item to cart.");
                return false;
            }
        } catch (error: any) {
            const msg = error.response?.data?.message || "An error occurred while adding to cart.";
            toast.error(msg);
            return false;
        }
    };

    const updateQuantity = async (cartItemId: string, quantity: number) => {
        if (quantity < 1) return;

        try {
            const { data } = await axiosInstance.patch(`/cart/items/${cartItemId}`, { quantity });
            if (data.success) {
                await fetchCart();
            } else {
                toast.error(data.message || "Failed to update quantity.");
            }
        } catch (error: any) {
            toast.error("Error updating cart.");
        }
    };

    const removeItem = async (cartItemId: string) => {
        try {
            const { data } = await axiosInstance.delete(`/cart/items/${cartItemId}`);
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
            const { data } = await axiosInstance.delete("/cart");
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
