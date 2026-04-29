import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchWishlist, addItemLocally, removeItemLocally } from "@/store/wishlistSlice";
import { wishlistService } from "@/services/wishlist.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const useWishlist = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { items, isLoading } = useSelector((state: RootState) => state.wishlist);
    const { isAuthenticated } = useSelector((state: RootState) => state.user);
    const router = useRouter();

    const isWishlisted = useCallback(
        (productId: string) => items.some(i => i.productId === productId),
        [items]
    );

    const toggle = async (productId: string, productName?: string) => {
        if (!isAuthenticated) {
            toast.error("Please login to save favorite products.");
            sessionStorage.setItem("redirect_after_login", window.location.pathname);
            router.push("/auth/login");
            return;
        }

        if (isWishlisted(productId)) {
            dispatch(removeItemLocally(productId));
            const result = await wishlistService.removeFromWishlist(productId);
            if (!result.success) {
                dispatch(fetchWishlist());
                toast.error(result.message);
            } else {
                toast.success("Removed from wishlist.");
            }
        } else {
            const result = await wishlistService.addToWishlist(productId);
            if (result.success && result.data) {
                dispatch(addItemLocally(result.data));
                toast.success(`Added "${productName ?? "product"}" to wishlist.`);
            } else {
                toast.error(result.message);
            }
        }
    };

    const loadWishlist = useCallback(() => {
        if (isAuthenticated) {
            dispatch(fetchWishlist());
        }
    }, [dispatch, isAuthenticated]);

    return { items, isLoading, isWishlisted, toggle, loadWishlist };
};
