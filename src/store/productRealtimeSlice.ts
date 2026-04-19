import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ProductOverride {
    quantity?: number;
    status?: string;
    /**
     * isLocked = true  → sản phẩm đang bị người khác giữ chỗ (đang checkout)
     * Phân biệt rõ với sản phẩm vừa được nhập kho 1 cái (quantity=1 nhưng isLocked=false)
     */
    isLocked?: boolean;
}

interface ProductRealtimeState {
    overrides: Record<string, ProductOverride>;
}

const initialState: ProductRealtimeState = {
    overrides: {},
};

const productRealtimeSlice = createSlice({
    name: "productRealtime",
    initialState,
    reducers: {
        updateProductStatus: (state, action: PayloadAction<{ productId: string; quantity?: number; status?: string; isLocked?: boolean }>) => {
            const { productId, quantity, status, isLocked } = action.payload;
            state.overrides[productId] = {
                ...state.overrides[productId],
                ...(quantity !== undefined && { quantity }),
                ...(status !== undefined && { status }),
                ...(isLocked !== undefined && { isLocked }),
            };
        },
        resetOverrides: (state) => {
            state.overrides = {};
        }
    },
});

export const { updateProductStatus, resetOverrides } = productRealtimeSlice.actions;
export default productRealtimeSlice.reducer;
