import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";

export interface ProgressData {
  date: string;
  weight?: number;
  bodyFat?: number;
  muscleMass?: number;
  workoutDuration: number;
  workoutCount: number;
  caloriesBurned: number;
}

export interface ExerciseProgress {
  exerciseName: string;
  date: string;
  weight: number;
  reps: number;
  sets: number;
}

export function useProgressData() {
  const { data: progressData, isLoading: progressLoading } = useQuery({
    queryKey: ["progress-data"],
    queryFn: async (): Promise<ProgressData[]> => {
      // Por enquanto, vamos usar dados mockados
      // TODO: Implementar endpoint real no backend
      return generateMockProgressData();
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    enabled: !!localStorage.getItem("token"),
  });

  const { data: exerciseProgress, isLoading: exerciseLoading } = useQuery({
    queryKey: ["exercise-progress"],
    queryFn: async (): Promise<ExerciseProgress[]> => {
      // Por enquanto, vamos usar dados mockados
      // TODO: Implementar endpoint real no backend
      return generateMockExerciseProgress();
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    enabled: !!localStorage.getItem("token"),
  });

  return {
    progressData: progressData || [],
    exerciseProgress: exerciseProgress || [],
    isLoading: progressLoading || exerciseLoading,
  };
}

// Função para gerar dados mockados de progresso
function generateMockProgressData(): ProgressData[] {
  const data: ProgressData[] = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 90); // Últimos 90 dias

  for (let i = 0; i < 90; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    // Simular progresso realista
    const baseWeight = 75;
    const weightVariation = Math.sin(i * 0.1) * 2 + Math.random() * 1;
    const weight = baseWeight + weightVariation;
    
    const bodyFat = 15 + Math.sin(i * 0.05) * 3 + Math.random() * 0.5;
    const muscleMass = 60 + Math.sin(i * 0.08) * 1.5 + Math.random() * 0.3;
    
    // Simular treinos (não todos os dias)
    const hasWorkout = Math.random() > 0.3; // 70% chance de ter treino
    const workoutDuration = hasWorkout ? 45 + Math.random() * 30 : 0;
    const workoutCount = hasWorkout ? 1 : 0;
    const caloriesBurned = hasWorkout ? 300 + Math.random() * 200 : 0;

    data.push({
      date: date.toISOString().split('T')[0],
      weight: Math.round(weight * 10) / 10,
      bodyFat: Math.round(bodyFat * 10) / 10,
      muscleMass: Math.round(muscleMass * 10) / 10,
      workoutDuration: Math.round(workoutDuration),
      workoutCount,
      caloriesBurned: Math.round(caloriesBurned),
    });
  }

  return data;
}

// Função para gerar dados mockados de progresso nos exercícios
function generateMockExerciseProgress(): ExerciseProgress[] {
  const exercises = ["Supino", "Agachamento", "Levantamento Terra", "Flexões", "Corrida"];
  const data: ExerciseProgress[] = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30); // Últimos 30 dias

  exercises.forEach((exercise, exerciseIndex) => {
    let baseWeight = 50 + exerciseIndex * 20;
    let baseReps = 8 + exerciseIndex * 2;

    for (let i = 0; i < 30; i += 3) { // A cada 3 dias
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      // Simular progresso gradual
      const progress = i * 0.02; // 2% de progresso a cada 3 dias
      const weight = baseWeight * (1 + progress) + Math.random() * 5;
      const reps = baseReps + Math.floor(progress * 10) + Math.floor(Math.random() * 3);
      const sets = 3 + Math.floor(Math.random() * 2);

      data.push({
        exerciseName: exercise,
        date: date.toISOString().split('T')[0],
        weight: Math.round(weight),
        reps,
        sets,
      });
    }
  });

  return data;
} 