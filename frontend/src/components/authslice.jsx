import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    role: null, // 'admin', 'doctor', or 'patient'
    isAuthenticated: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess: (state, action) => {  
            state.user = action.payload.user;
            state.role = action.payload.role;
            state.isAuthenticated = true;
        },
        logout: (state) => {
            state.user = null;
            state.role = null;
            state.isAuthenticated = false;
            // Clean up session storage keys
            sessionStorage.removeItem('access_token');
            sessionStorage.removeItem('refresh_token'); 
            sessionStorage.removeItem('role');
            sessionStorage.removeItem('user');
        },
    },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;