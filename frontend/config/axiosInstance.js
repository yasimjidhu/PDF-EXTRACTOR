import axios from 'axios';


const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
});

api.interceptors.request.use(
    function(config){
        const token = localStorage.getItem('token')
        if(token){
            config.headers.Authorization = `Bearer ${token}`; // Include token in headers
        }
        return config
    },
    function(error){
        return Promise.reject(error)
    }
)

export default api;
