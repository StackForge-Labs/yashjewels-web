import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ProductRealtimeState {
    // Map of productId to its override status
    overrides: Record<string, {
        quantity?: number;
        status?: string;
    }>;
}

const initialState: ProductRealtimeState = {
    overrides: {},
};

const productRealtimeSlice = createSlice({
    name: "productRealtime",
    initialState,
    reducers: {
        updateProductStatus: (state, action: PayloadAction<{ productId: string; quantity?: number; status?: string }>) => {
            const { productId, quantity, status } = action.payload;
            state.overrides[productId] = {
                ...state.overrides[productId],
                ...(quantity !== undefined && { quantity }),
                ...(status !== undefined && { status }),
            };
        },
        resetOverrides: (state) => {
            state.overrides = {};
        }
    },
});

export const { updateProductStatus, resetOverrides } = productRealtimeSlice.actions;
export default productRealtimeSlice.reducer;
