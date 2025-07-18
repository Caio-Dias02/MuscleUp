import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import type { WorkoutExercise } from "@/config/table-configs";
import { toast } from "sonner";

export function useWorkoutExercises(workoutDayId?: string) {
  const queryClient = useQueryClient();
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["workout-exercises", workoutDayId],
    queryFn: async () => {
      const response = await api.get("/workout-exercises", {
        params: {
          workoutDayId: workoutDayId
        }
      });
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    retry: 2,
    enabled: !!localStorage.getItem("token"),
  });

  const createWorkoutExercise = useMutation({
    mutationFn: async (workoutExercise: WorkoutExercise) => {
      const response = await api.post("/workout-exercises", workoutExercise);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workout-exercises"] });
      toast.success("Exercício de treino criado com sucesso!");
    },
    onError: (error) => {
      console.error("Erro ao criar exercício de treino:", error);
    },
  });

  const updateWorkoutExercise = useMutation({
    mutationFn: async (workoutExercise: WorkoutExercise) => {
      const response = await api.patch(`/workout-exercises/${workoutExercise.id}`, workoutExercise);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workout-exercises"] });
      toast.success("Exercício de treino atualizado com sucesso!");
    },
    onError: (error) => {
      console.error("Erro ao atualizar exercício de treino:", error);
    },
  });

  const deleteWorkoutExercise = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/workout-exercises/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workout-exercises"] });
      toast.success("Exercício de treino deletado com sucesso!");
    },
    onError: (error) => {
      console.error("Erro ao deletar exercício de treino:", error);
    },
  });

  return { 
    data, 
    isLoading, 
    error, 
    refetch, 
    createWorkoutExercise, 
    updateWorkoutExercise, 
    deleteWorkoutExercise
  };
}

// Hook específico para buscar exercícios de um dia de treino
export function useWorkoutExercisesByDay(workoutDayId: string) {
  return useQuery({
    queryKey: ["workout-exercises-by-day", workoutDayId],
    queryFn: async () => {
      const response = await api.get("/workout-exercises", {
        params: {
          workoutDayId: workoutDayId
        }
      });
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    enabled: !!localStorage.getItem("token") && !!workoutDayId,
  });
}