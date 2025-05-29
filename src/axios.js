import axios from 'axios';
import {useStore} from '@store';
import router from '@router';

const axiosClient = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
    withCredentials: true, // Important for CORS with credentials
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
})

axiosClient.interceptors.request.use(config => {
    const store = useStore();
    if (store.user.token) {
        config.headers.Authorization = `Bearer ${store.user.token}`;
    }
    return config;
});

axiosClient.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if (error.response?.status === 401) {
            sessionStorage.removeItem('token');
            router.push({name:'login'});
        }
        console.log(error);
        throw error; // Re-throw the error so it can be caught by the calling code
    }
);

export default axiosClient;