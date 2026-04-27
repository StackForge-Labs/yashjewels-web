import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/api-client";

export interface CartItemType {
    cartItemId: string;
    productId: string;
    productName: string;
    slug: string;
    primaryImageUrl: string | null;
    styleCode: string;
    quantity: number;
    goldRateAtAdd: number;
    mrpAtAdd: number;
    currentLiveMrp: number;
    currentGoldRate: number;
    priceDriftPct: number;
    isGift: boolean;
    giftMessage: string | null;
    addedAt: string;
    maxStockQuantity: number;
}

export interface CartState {
    cartId: string | null;
    items: CartItemType[];
    totalLiveMrp: number;
    vatRate: number;
    shippingFee: number;
    hasPriceWarning: boolean;
    checkoutBlocked: boolean;
    itemCount: number;
    isLoading: boolean;
    error: string | null;
}

const initialState: CartState = {
    cartId: null,
    items: [],
    totalLiveMrp: 0,
    vatRate: 10,
    shippingFee: 0,
    hasPriceWarning: false,
    checkoutBlocked: false,
    itemCount: 0,
    isLoading: false,
    error: null,
};

export const fetchCart = createAsyncThunk(
    "cart/fetchCart",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get("/cart");
            if (data.success) {
                return data.data;
            }
            return rejectWithValue(data.message || "Failed to fetch cart");
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Error fetching cart");
        }
    }
);

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        setCartStart: (state) => {
            state.isLoading = true;
            state.error = null;
        },
        setCartSuccess: (state, action: PayloadAction<Omit<CartState, "isLoading" | "error">>) => {
            state.isLoading = false;
            state.cartId = action.payload.cartId;
            state.items = action.payload.items;
            state.totalLiveMrp = action.payload.totalLiveMrp;
            state.vatRate = action.payload.vatRate;
            state.shippingFee = action.payload.shippingFee;
            state.hasPriceWarning = action.payload.hasPriceWarning;
            state.checkoutBlocked = action.payload.checkoutBlocked;
            state.itemCount = action.payload.itemCount;
        },
        setCartFailure: (state, action: PayloadAction<string>) => {
            state.isLoading = false;
            state.error = action.payload;
        },
        clearCartLocal: (state) => {
            return initialState;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.isLoading = false;
                state.cartId = action.payload.cartId;
                state.items = action.payload.items;
                state.totalLiveMrp = action.payload.totalLiveMrp;
                state.vatRate = action.payload.vatRate;
                state.shippingFee = action.payload.shippingFee;
                state.hasPriceWarning = action.payload.hasPriceWarning;
                state.checkoutBlocked = action.payload.checkoutBlocked;
                state.itemCount = action.payload.itemCount;
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { setCartStart, setCartSuccess, setCartFailure, clearCartLocal } = cartSlice.actions;

export default cartSlice.reducer;
