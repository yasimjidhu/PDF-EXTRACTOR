import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../config/axiosInstance';

// User Logout
export const logoutUser = createAsyncThunk('auth/logoutUser', async (_, { rejectWithValue }) => {
    try {
        console.log('logout reached')
        const response = await api.post('/auth/logout');
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

// Thunk for logging in a user
export const loginUser = createAsyncThunk('auth/loginUser', async (credentials, { rejectWithValue }) => {
    try {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        token: null,
        loading: false,
        error: null
    },
    reducers: {
        setUserData(state, action) {
            state.user = action.payload.user;
            state.token = action.payload.token;
        },
        clearUserData(state) {
            state.user = null;
            state.token = null;
        }
    },
    extraReducers: (builder) => {

        builder.addCase(logoutUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        });

        builder.addCase(logoutUser.fulfilled, (state) => {
            state.user = null;
            state.token = null;
            state.loading = false;
        });

        builder.addCase(logoutUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
    }
});

export const { setUserData, clearUserData } = authSlice.actions;
export default authSlice.reducer;
