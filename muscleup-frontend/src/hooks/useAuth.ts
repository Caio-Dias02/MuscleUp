import { api } from "@/lib/axios";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";

export const useAuth = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    async function login(email: string, password: string) {
        try {
            const response = await api.post('/auth/login', { email, password });    
            const token = response.data.access_token;
            localStorage.setItem('token', token);
            navigate({ to: '/' });
        } catch (error) {
            console.error(error);
            throw error; // Lança o erro para que o LoginPage possa capturar
        }
    }

    async function logout() {
        localStorage.removeItem('token');
        // Limpar todo o cache do React Query
        queryClient.clear();
        navigate({ to: '/login' });
    }

    return { login, logout };
};
