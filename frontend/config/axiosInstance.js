import axios from 'axios';

// Axios instance
const api = axios.create({
    baseURL: 'http://localhost:5000', 
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true // Allows sending cookies with requests
});

export default api;
