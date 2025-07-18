import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { toast } from "sonner";

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    passwordHash: string;
    birthDate: string;
    gender?: 'MALE' | 'FEMALE' | 'OTHER';
    height: number;
    weight: number;
    activityLevel?: 'SEDENTARY' | 'LIGHT' | 'MODERATE' | 'HIGH' | 'VERY_HIGH';
    goal?: 'LOSE_WEIGHT' | 'GAIN_WEIGHT' | 'MAINTAIN_WEIGHT' | 'GAIN_MUSCLE' | 'STRENGTH_GAIN';
    profilePictureUrl?: string;
    role: 'USER' | 'ADMIN';
    createdAt: string;
    updatedAt: string;
}

export interface UpdateUserProfileData {
    name?: string;
    email?: string;
    birthDate?: string;
    gender?: 'MALE' | 'FEMALE' | 'OTHER';
    height?: number;
    weight?: number;
    activityLevel?: 'SEDENTARY' | 'LIGHT' | 'MODERATE' | 'HIGH' | 'VERY_HIGH';
    goal?: 'LOSE_WEIGHT' | 'GAIN_WEIGHT' | 'MAINTAIN_WEIGHT' | 'GAIN_MUSCLE' | 'STRENGTH_GAIN';
    profilePictureUrl?: string;
}

export const useUpdateUserProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: UpdateUserProfileData) => {
            const response = await api.patch('/users/me', data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['me'] });
            toast.success('Perfil atualizado com sucesso!');
        },
        onError: (error) => {
            console.error('Erro ao atualizar perfil:', error);
            toast.error('Erro ao atualizar perfil');
        }
    });
};

export const useDeleteUserProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            const response = await api.delete('/users/me');
            return response.data;
        },
        onSuccess: () => {
            queryClient.clear();
            localStorage.removeItem('token');
            toast.success('Conta excluída com sucesso');
        },
        onError: (error) => {
            console.error('Erro ao excluir conta:', error);
            toast.error('Erro ao excluir conta');
        }
    });
}; 