import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartItemType {
    cartItemId: string;
    productId: string;
    productName: string;
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
    hasPriceWarning: false,
    checkoutBlocked: false,
    itemCount: 0,
    isLoading: false,
    error: null,
};

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
});

export const { setCartStart, setCartSuccess, setCartFailure, clearCartLocal } = cartSlice.actions;

export default cartSlice.reducer;
