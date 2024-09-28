import axios from 'axios';
import store from '@/store';

const axiosZoneminder = axios.create({
    baseURL: '/api', // Substitua pela URL base do seu ZoneMinder
});


axiosZoneminder.interceptors.request.use(
    config => {
        const token = store.getters.getToken;
        if (token) {
            const url = new URL(config.url, window.location.origin);
            url.searchParams.append('token', token);
            config.url = url.pathname + url.search;
            console.log('token enviado', token)
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);


export default axiosZoneminder;