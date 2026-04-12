import { UserProfile } from "@/types/user.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
    user: UserProfile | null;
    isAuthenticated: boolean;
}

const initialState: UserState = {
    user: null,
    isAuthenticated: false,
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<UserProfile>) {
            state.user = action.payload;
            state.isAuthenticated = true;
        },
        clearUser(state) {
            state.user = null;
            state.isAuthenticated = false;
        },
    },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
