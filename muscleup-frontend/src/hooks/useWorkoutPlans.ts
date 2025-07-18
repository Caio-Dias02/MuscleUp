import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import type { WorkoutPlan } from "@/config/table-configs";
import { toast } from "sonner";

export function useWorkoutPlans() {
  const queryClient = useQueryClient();
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["workout-plans"],
    queryFn: async () => {
      const response = await api.get("/workout-plans");
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos - dados considerados frescos
    gcTime: 10 * 60 * 1000, // 10 minutos - tempo no cache
    retry: 2,
    enabled: !!localStorage.getItem("token"),
  });

  const createWorkoutPlan = useMutation({
    mutationFn: async (workoutPlan: WorkoutPlan) => {
      const response = await api.post("/workout-plans", workoutPlan);
      return response.data;
    },
    onSuccess: () => {
      // Invalida queries relacionadas
      queryClient.invalidateQueries({ queryKey: ["workout-plans"] });
      queryClient.invalidateQueries({ queryKey: ["workout-days"] });
      queryClient.invalidateQueries({ queryKey: ["workout-exercises"] });
      toast.success("Plano de treino criado com sucesso!");
    },
    onError: (error) => {
      console.error("Erro ao criar plano de treino:", error);
      toast.error("Erro ao criar plano de treino");
    },
  });

  const updateWorkoutPlan = useMutation({
    mutationFn: async (workoutPlan: WorkoutPlan) => {
      const response = await api.patch(`/workout-plans/${workoutPlan.id}`, workoutPlan);
      return response.data;
    },
    onSuccess: (data) => {
      // Atualiza o cache otimisticamente
      queryClient.setQueryData(["workout-plans"], (oldData: any) => {
        if (!oldData) return oldData;
        return oldData.map((plan: any) => 
          plan.id === data.id ? data : plan
        );
      });
      
      // Invalida queries relacionadas
      queryClient.invalidateQueries({ queryKey: ["workout-days"] });
      queryClient.invalidateQueries({ queryKey: ["workout-exercises"] });
      toast.success("Plano de treino atualizado com sucesso!");
    },
    onError: (error) => {
      console.error("Erro ao atualizar plano de treino:", error);
      toast.error("Erro ao atualizar plano de treino");
    },
  });

  const deleteWorkoutPlan = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/workout-plans/${id}`);
      return response.data;
    },
    onSuccess: (_, deletedId) => {
      // Remove do cache otimisticamente
      queryClient.setQueryData(["workout-plans"], (oldData: any) => {
        if (!oldData) return oldData;
        return oldData.filter((plan: any) => plan.id !== deletedId);
      });
      
      // Invalida queries relacionadas
      queryClient.invalidateQueries({ queryKey: ["workout-days"] });
      queryClient.invalidateQueries({ queryKey: ["workout-exercises"] });
      toast.success("Plano de treino excluído com sucesso!");
    },
    onError: (error) => {
      console.error("Erro ao excluir plano de treino:", error);
      toast.error("Erro ao excluir plano de treino");
    },
  });

  return {
    data: data || [],
    isLoading,
    error,
    refetch,
    createWorkoutPlan,
    updateWorkoutPlan,
    deleteWorkoutPlan,
  };
} 