import axios from 'axios';

// Axios instance
const api = axios.create({
    baseURL: 'https://pdf-extractor-okox.onrender.com', 
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true // Allows sendrequestsing cookies with 
});

export default api;
