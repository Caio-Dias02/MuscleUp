import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { type UserProfile } from "./useUserProfile";

export async function getUser(): Promise<UserProfile> {
    const response = await api.get('/users/me');
    return response.data;
}

export const useUser = () => {
    const token = localStorage.getItem('token');
    
    return useQuery({
        queryKey: ['me'],
        queryFn: getUser,
        retry: false,
        enabled: !!token, // Só faz a requisição se houver token
    });
};