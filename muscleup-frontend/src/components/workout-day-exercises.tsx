import React from "react";
import { useWorkoutExercisesByDay } from "@/hooks/useWorkoutExercises";
import { Badge } from "@/components/ui/badge";
import { IconBarbell, IconLoader } from "@tabler/icons-react";

interface WorkoutDayExercisesProps {
  workoutDayId: string;
}

export function WorkoutDayExercises({ workoutDayId }: WorkoutDayExercisesProps) {
  const { data: exercises, isLoading, error } = useWorkoutExercisesByDay(workoutDayId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <IconLoader className="h-4 w-4 animate-spin mr-2" />
        <span className="text-sm text-muted-foreground">Carregando exercícios...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-sm text-destructive">
        Erro ao carregar exercícios
      </div>
    );
  }

  if (!exercises || exercises.length === 0) {
    return (
      <div className="p-4 text-sm text-muted-foreground">
        Nenhum exercício encontrado para este dia
      </div>
    );
  }

  return (
    <div className="mt-2 space-y-2">
      <div className="flex items-center gap-2 mb-2">
        <IconBarbell className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium">Exercícios:</span>
      </div>
      <div className="space-y-1">
        {exercises.map((exercise: any) => (
          <div key={exercise.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
            <div className="flex-1">
              <span className="text-sm font-medium">{exercise.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {exercise.sets} séries
              </Badge>
              <Badge variant="outline" className="text-xs">
                {exercise.reps} reps
              </Badge>
              <Badge variant="outline" className="text-xs">
                {exercise.weight}kg
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 