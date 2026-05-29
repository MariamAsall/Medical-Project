import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isAuthenticated: false,
    role: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,

    reducers: {
        loginSuccess: (state, action) => {
            state.isAuthenticated =
                action.payload.isAuthenticated;

            state.role = action.payload.role;
        },

        logout: (state) => {
            state.isAuthenticated = false;
            state.role = null;

            localStorage.removeItem(
                "access_token"
            );

            localStorage.removeItem(
                "refresh_token"
            );
        },
    },
});

export const {
    loginSuccess,
    logout,
} = authSlice.actions;

export default authSlice.reducer;