import axios from 'axios';

// Axios instance
const api = axios.create({
    baseURL: 'http://localhost:10000', 
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true // Allows sendrequestsing cookies with 
});

export default api;
