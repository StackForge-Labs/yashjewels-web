import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { wishlistService, WishlistItemType } from "@/services/wishlist.service";

interface WishlistState {
    items: WishlistItemType[];
    isLoading: boolean;
    error: string | null;
}

const initialState: WishlistState = {
    items: [],
    isLoading: false,
    error: null,
};

export const fetchWishlist = createAsyncThunk(
    "wishlist/fetchWishlist",
    async (_, { rejectWithValue }) => {
        try {
            return await wishlistService.getWishlist();
        } catch {
            return rejectWithValue("Failed to fetch wishlist");
        }
    }
);

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState,
    reducers: {
        addItemLocally: (state, action: PayloadAction<WishlistItemType>) => {
            if (!state.items.find(i => i.productId === action.payload.productId)) {
                state.items.unshift(action.payload);
            }
        },
        removeItemLocally: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(i => i.productId !== action.payload);
        },
        clearWishlistLocal: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchWishlist.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchWishlist.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items = action.payload;
            })
            .addCase(fetchWishlist.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { addItemLocally, removeItemLocally, clearWishlistLocal } = wishlistSlice.actions;
export default wishlistSlice.reducer;
