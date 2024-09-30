import { createStore } from 'vuex';
import AuthService from '@/services/authService';
import createPersistedState from 'vuex-persistedstate';  

export default createStore({
    state: {
        token: null,
        tokenTimeout: null
    },
    mutations: {
        setToken(state, { token, tokenTimeout }) {
            state.token = token;
            state.tokenTimeout = tokenTimeout
        },
    },
    actions: {
        async login({ commit }, credentials) {
            try {
                const response = await AuthService.login(credentials);
                console.log(response)
                const token = response.access_token;

                const expireTime = response.access_token_expires;
                const tokenExpiresIn = new Date().getTime() + expireTime * 1000;
                console.log(tokenExpiresIn)
                commit('setToken', { token: token, tokenTimeout: tokenExpiresIn });

                return token;
            } catch (error) {
                console.error('Erro na action de fazer login', error);
                throw error;
            }
        },
        logout({ commit }, router) {
            AuthService.logout(router);
            commit('setToken', { token: null, tokenTimeout: null });
        }
    },
    getters: {
        isAuthenticated: state => !!state.token && new Date().getTime() < state.tokenTimeout,
        getToken: state => state.token,
    },
    plugins: [
        createPersistedState({
            key: 'acess_token',
            paths: ['token', 'tokenTimeout'],
        }),
    ],
});
