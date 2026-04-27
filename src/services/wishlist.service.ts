import apiClient, { getErrorMessage } from "@/lib/api-client";

export interface WishlistItemType {
    wishlistItemId: string;
    productId: string;
    productName: string;
    slug: string;
    primaryImageUrl: string | null;
    categoryName: string | null;
    status: string;
    addedAt: string;
}

export const wishlistService = {
    getWishlist: async (): Promise<WishlistItemType[]> => {
        try {
            const { data } = await apiClient.get("/wishlist");
            return data.success ? data.data : [];
        } catch {
            return [];
        }
    },

    addToWishlist: async (productId: string): Promise<{ success: boolean; message: string; data?: WishlistItemType }> => {
        try {
            const { data } = await apiClient.post(`/wishlist/${productId}`);
            return { success: data.success, message: data.message, data: data.data };
        } catch (error) {
            return { success: false, message: getErrorMessage(error) ?? "Failed to add to wishlist" };
        }
    },

    removeFromWishlist: async (productId: string): Promise<{ success: boolean; message: string }> => {
        try {
            const { data } = await apiClient.delete(`/wishlist/${productId}`);
            return { success: data.success, message: data.message };
        } catch (error) {
            return { success: false, message: getErrorMessage(error) ?? "Failed to remove from wishlist" };
        }
    },
};
