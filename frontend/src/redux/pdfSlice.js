import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../config/axiosInstance';

// Thunk for uploading PDF
export const uploadPdf = createAsyncThunk('pdf/uploadPdf', async (fileData, { rejectWithValue }) => {
    try {
        const response = await api.post('/pdf', fileData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        console.log('response of upload pdf',response)
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

// Thunk for extracting pages from a PDF
export const extractPdfPages = createAsyncThunk('pdf/extractPdfPages', async (data, { rejectWithValue }) => {
    try {
        const response = await api.post('/pdf/extract', data);
        console.log('response of extract pages',response)
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

// Thunk for extracting pages from a PDF
export const getMyPdfs = createAsyncThunk('pdf/mypdfs', async (userId, { rejectWithValue }) => {
    try {
        const response = await api.get(`/pdf/${userId}`);
        console.log('response of mypdfs',response)
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});


const pdfSlice = createSlice({
    name: 'pdf',
    initialState: {
        pdfs: [],
        loading: false,
        error: null
    },
    extraReducers: (builder) => {
        builder
            // Handle pending state for PDF upload
            .addCase(uploadPdf.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            // Handle successful PDF upload
            .addCase(uploadPdf.fulfilled, (state, action) => {
                state.loading = false;
                state.pdfs.push(action.payload);
            })
            // Handle rejected PDF upload
            .addCase(uploadPdf.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default pdfSlice.reducer;
