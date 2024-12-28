import axios from 'axios';

class AuthService {
    static async login(loginData) {
        try {
            const urlRequest = '/api/host/login.json'
            // API de Login só aceita URLSearchParams
            const params = new URLSearchParams(
                {
                    user: loginData.user,
                    pass: loginData.pass
                }
            );

            const response = await axios.post(urlRequest, params);

            return response.data;
        } catch (error) {
            console.error('Erro ao realizar o login:', error);
            throw error;
        }
    }

    static async refreshToken(refreshToken) {
        try {
            const urlRefresh = '/api/host/login.json';
            const response = await axios.post(urlRefresh, { refresh_token: refreshToken });
            console.log('token renovado: ',response.data)
            return response.data;
        } catch (error) {
            console.error('Erro ao renovar o token pelo service:', error);
            throw error;
        }
    }

    static logout(router) {
        router.push('/login');
        setTimeout(() => {
            localStorage.removeItem('acess_token');
            localStorage.removeItem('refresh_token');
        }, 100);
    }
}

export default AuthService;
