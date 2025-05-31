import axios from 'axios';
import {useStore} from '@store';
import router from '@router';

const axiosClient = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
    withCredentials: true, // Important for CORS
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
})

axiosClient.interceptors.request.use(config => {
    const store = useStore();
    if (store.user.token) {
        config.headers.Authorization = `Bearer ${store.user.token}`;
    }
    return config;
});

axiosClient.interceptors.response.use( // Fix: this should be response, not request
    response => {
        return response;
    },
    error => {
        if (error.response?.status === 401) {
            sessionStorage.removeItem('token');
            router.push({name:'login'});
        }
        console.log(error);
        throw error; // Re-throw the error
    }
);

export default axiosClient;
