import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import cartReducer from "./cartSlice";
import productRealtimeReducer from "./productRealtimeSlice";

export const store = configureStore({
    reducer: {
        user: userReducer,
        cart: cartReducer,
        productRealtime: productRealtimeReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
