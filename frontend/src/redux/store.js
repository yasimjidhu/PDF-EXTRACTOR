import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice'
import pdfReducer from './pdfSlice'

const store = configureStore({
    reducer: {
        auth: authReducer,
        pdf: pdfReducer
    },
});

export default store;
