import axios from 'axios';

class AuthService {
    static async login(loginData) {
        try {
            // API de Login só aceita URLSearchParams
            const params = new URLSearchParams(
                {
                    user: loginData.user, 
                    pass: loginData.pass
                }
            );

            const response = await axios.post('/api/host/login.json', params);
            return response.data;
        } catch (error) {
            console.error('Erro ao realizar o login:', error);
            throw error;
        }
    }

    static logout(router) {
        router.push('/login');
        setTimeout(() => {
            localStorage.removeItem('acess_token');
        }, 100);
    }
}

export default AuthService;
