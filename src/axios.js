import axios from 'axios';
import {useStore} from '@store';
import router from '@router';

const axiosClient = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
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

axiosClient.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            sessionStorage.removeItem('token');
            router.push({name:'login'});
        }
        throw error;
    }
);

export default axiosClient;
