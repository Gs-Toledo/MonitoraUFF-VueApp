import axios from 'axios';
import store from '@/store';

const axiosZoneminder = axios.create({
    baseURL: '/api',
});


axiosZoneminder.interceptors.request.use(
    async config => {
        let token = store.getters.getToken;

        const tokenTimeout = store.state.tokenTimeout;
        const currentTime = new Date().getTime();

        if (token && currentTime >= tokenTimeout - 60000) {  // 60000 ms = 1 minuto
            try {

                await store.dispatch('refreshToken');

                token = store.getters.getToken;
            } catch (error) {
                console.error('Erro ao renovar o token de acesso:', error);
                store.dispatch('logout');
                return Promise.reject(error);
            }
        }

        if (token) {
            const url = new URL(config.url, window.location.origin);
            url.searchParams.append('token', token);
            config.url = url.pathname + url.search;
            /* console.log('token enviado', token) */
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);




export default axiosZoneminder;