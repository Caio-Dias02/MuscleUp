import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/axios";

// Tipo para criação de workout plan
export interface CreateWorkoutPlanData {
    name: string;
}

export function useWorkoutPlansPage() {
    const queryClient = useQueryClient();
    
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['workout-plans'],
        queryFn: async () => {
            const response = await api.get('/workout-plans');
            return response.data;
        },
        staleTime: 5 * 60 * 1000, // 5 minutos
        gcTime: 10 * 60 * 1000, // 10 minutos
        retry: 2,
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
        enabled: !!localStorage.getItem('token'), // Só executa se houver token
    });

    // Mutation para criar workout plan
    const createWorkoutPlan = useMutation({
        mutationFn: async (workoutPlanData: CreateWorkoutPlanData) => {
            const response = await api.post('/workout-plans', workoutPlanData);
            return response.data;
        },
        onSuccess: () => {
            // Invalida o cache e recarrega os dados
            queryClient.invalidateQueries({ queryKey: ['workout-plans'] });
        },

        onError: (error) => {
            console.error('Erro ao criar workout plan:', error);
        },
    });

    return { 
        data, 
        isLoading, 
        error, 
        refetch,
        createWorkoutPlan: createWorkoutPlan.mutate,
        isCreating: createWorkoutPlan.isPending,
        createError: createWorkoutPlan.error
    };
}   