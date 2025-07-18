import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import type { WorkoutDay } from "@/config/table-configs";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
export function useWorkoutDays() {
    const queryClient = useQueryClient();
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ["workout-days"],
        queryFn: async () => {
            const response = await api.get("/workout-days");
            return response.data;
        },
        staleTime: 5 * 60 * 1000, // 5 minutos
        gcTime: 10 * 60 * 1000, // 10 minutos
        retry: 2,
        enabled: !!localStorage.getItem("token"),
    });

    const useWorkoutDaysId = (id: string) => useQuery({
        queryKey: ["workout-days-id", id],
        queryFn: async () => {
            const response = await api.get(`/workout-days/${id}`);
            return response.data;
        },
    });

    const createWorkoutDay = useMutation({
        mutationFn: async (workoutDay: WorkoutDay) => {
            const response = await api.post("/workout-days", workoutDay);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["workout-days"] });
            // Also invalidate exercises since they depend on workout days
            queryClient.invalidateQueries({ queryKey: ["workout-exercises"] });
            toast.success("Dia de treino criado com sucesso!");
        },
        onError: (error) => {
            console.error("Erro ao criar dia de treino:", error);
        },
    });

    const updateWorkoutDay = useMutation({
        mutationFn: async (workoutDay: WorkoutDay) => {
            const response = await api.patch(`/workout-days/${workoutDay.id}`, workoutDay);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["workout-days"] });
            // Also invalidate exercises since they depend on workout days
            queryClient.invalidateQueries({ queryKey: ["workout-exercises"] });
            toast.success("Dia de treino atualizado com sucesso!");
        },
        onError: (error) => {
            console.error("Erro ao atualizar dia de treino:", error);
        },
    });

    const deleteWorkoutDay = useMutation({
        mutationFn: async (id: string) => {
            const response = await api.delete(`/workout-days/${id}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["workout-days"] });
            // Also invalidate exercises since they depend on workout days
            queryClient.invalidateQueries({ queryKey: ["workout-exercises"] });
            toast.success("Dia de treino deletado com sucesso!");
        },
        onError: (error) => {
            console.error("Erro ao deletar dia de treino:", error);
        },
    });
    

    return { data, isLoading, error, refetch, createWorkoutDay, updateWorkoutDay, deleteWorkoutDay, useWorkoutDaysId };
}