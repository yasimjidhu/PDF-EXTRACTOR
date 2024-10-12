import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../config/axiosInstance';

// Thunk for signup 
export const signup = createAsyncThunk('auth/signup', async (credentials, { rejectWithValue }) => {
    try {
        console.log('signup reached',credentials)
        const response = await api.post('/auth/register', credentials);
        console.log('response of signup',response)
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});


// Thunk for logging in a user
export const loginUser = createAsyncThunk('auth/loginUser', async (credentials, { rejectWithValue }) => {
    try {
        const response = await api.post('/auth/login', credentials);
        console.log('reponse of login',response)
        return response.data;
    } catch (error) {
        console.log('error in login',error)
        return rejectWithValue(error.response.data);
    }
});

// User Logout
export const logoutUser = createAsyncThunk('auth/logoutUser', async (_, { rejectWithValue }) => {
    try {
        const response = await api.post('/auth/logout');
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});


const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
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

        builder.addCase(signup.pending, (state) => {
            state.loading = true;
            state.error = null;
        });

        builder.addCase(signup.fulfilled, (state,action) => {
            console.log('action payload of signup',action.payload)
            state.user = action.payload;
            state.loading = false;
        });

        builder.addCase(signup.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
        builder.addCase(loginUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        });

        builder.addCase(loginUser.fulfilled, (state,action) => {
            console.log('action payload of login',action.payload)
            state.user = action.payload.user;
            state.loading = false;
        });

        builder.addCase(loginUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
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
