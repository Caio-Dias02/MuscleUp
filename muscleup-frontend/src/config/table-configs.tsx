import { type ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { useWorkoutExercises } from "@/hooks/useWorkoutExercises"

// Tipos de dados
export interface WorkoutDay {
  id: string
  name: string
  dayOfWeek: string
  workoutPlanId: string
  createdAt: string
  updatedAt: string
}

export interface WorkoutExercise {
  id: string
  name: string
  sets: number
  reps: number
  weight: number
  workoutDayId: string
  createdAt: string
  updatedAt: string
}

export interface WorkoutPlan {
  id: string
  name: string
  userId: string
  createdAt: string
  updatedAt: string
}

// Componente para exibir exercícios de um workout day
function WorkoutDayExercises({ workoutDayId }: { workoutDayId: string }) {
  const { data: exercises, isLoading } = useWorkoutExercises(workoutDayId);

  if (isLoading) {
    return (
      <div className="text-center">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mx-auto"></div>
        <p className="text-sm text-muted-foreground mt-1">Carregando exercícios...</p>
      </div>
    );
  }

  if (!exercises || exercises.length === 0) {
    return (
      <div className="text-center">
        <p className="text-sm text-muted-foreground">Nenhum exercício encontrado</p>
      </div>
    );
  }

  return (
    <div>
      <h4 className="font-medium mb-3">Exercícios:</h4>
      <div className="space-y-2">
        {exercises.map((exercise: WorkoutExercise) => (
          <div key={exercise.id} className="flex items-center justify-between p-3 bg-background rounded-lg border">
            <div className="flex-1">
              <p className="font-medium">{exercise.name}</p>
              <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                <span>{exercise.sets} séries</span>
                <span>{exercise.reps} repetições</span>
                <span>{exercise.weight}kg</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Configuração para Workout Days
export const workoutDaysColumns: ColumnDef<WorkoutDay>[] = [
  {
    accessorKey: "name",
    header: "Nome do Treino",
    cell: ({ row }) => (
      <div className="font-medium">{row.original.name}</div>
    ),
  },
  {
    accessorKey: "dayOfWeek",
    header: "Dia da Semana",
    cell: ({ row }) => {
      const dayMap: { [key: string]: string } = {
        MONDAY: "Segunda-feira",
        TUESDAY: "Terça-feira",
        WEDNESDAY: "Quarta-feira",
        THURSDAY: "Quinta-feira",
        FRIDAY: "Sexta-feira",
        SATURDAY: "Sábado",
        SUNDAY: "Domingo",
      }
      return (
        <Badge variant="outline" className="text-muted-foreground px-1.5">
          {dayMap[row.original.dayOfWeek] || row.original.dayOfWeek}
        </Badge>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: "Criado em",
    cell: ({ row }) => (
      <div className="text-muted-foreground">
        {new Date(row.original.createdAt).toLocaleDateString('pt-BR')}
      </div>
    ),
  },
  {
    accessorKey: "updatedAt",
    header: "Atualizado em",
    cell: ({ row }) => (
      <div className="text-muted-foreground">
        {new Date(row.original.updatedAt).toLocaleDateString('pt-BR')}
      </div>
    ),
  },
]

// Configuração para Workout Exercises
export const workoutExercisesColumns: ColumnDef<WorkoutExercise>[] = [
  {
    accessorKey: "name",
    header: "Nome do Exercício",
    cell: ({ row }) => (
      <div className="font-medium">{row.original.name}</div>
    ),
  },
  {
    accessorKey: "sets",
    header: "Séries",
    cell: ({ row }) => (
      <div className="text-center">
        <Badge variant="secondary">{row.original.sets}</Badge>
      </div>
    ),
  },
  {
    accessorKey: "reps",
    header: "Repetições",
    cell: ({ row }) => (
      <div className="text-center">
        <Badge variant="secondary">{row.original.reps}</Badge>
      </div>
    ),
  },
  {
    accessorKey: "weight",
    header: "Peso (kg)",
    cell: ({ row }) => (
      <div className="text-center">
        <Badge variant="outline">{row.original.weight}kg</Badge>
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Criado em",
    cell: ({ row }) => (
      <div className="text-muted-foreground">
        {new Date(row.original.createdAt).toLocaleDateString('pt-BR')}
      </div>
    ),
  },
]

// Configuração para Workout Plans
export const createWorkoutPlansColumns = (
  onEdit?: (plan: WorkoutPlan) => void,
  onDelete?: (plan: WorkoutPlan) => void
): ColumnDef<WorkoutPlan>[] => [
  {
    accessorKey: "name",
    header: "Nome do Plano",
    cell: ({ row }) => (
      <div className="font-medium">{row.original.name}</div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Criado em",
    cell: ({ row }) => (
      <div className="text-muted-foreground">
        {new Date(row.original.createdAt).toLocaleDateString('pt-BR')}
      </div>
    ),
  },
  {
    accessorKey: "updatedAt",
    header: "Atualizado em",
    cell: ({ row }) => (
      <div className="text-muted-foreground">
        {new Date(row.original.updatedAt).toLocaleDateString('pt-BR')}
      </div>
    ),
  },
]

// Função para criar conteúdo expandível para workout days
export function createWorkoutDayExpandableContent() {
  return (workoutDay: WorkoutDay) => (
    <WorkoutDayExercises workoutDayId={workoutDay.id} />
  );
}

// Configurações prontas para uso
export const tableConfigs = {
  workoutDays: {
    title: "Meus Dias de Treino",
    columns: workoutDaysColumns,
    addButtonText: "Novo dia",
    expandableContent: createWorkoutDayExpandableContent(),
    emptyMessage: "Nenhum dia de treino encontrado."
  },
  workoutExercises: {
    title: "Exercícios de Treino",
    columns: workoutExercisesColumns,
    addButtonText: "Novo exercício",
    emptyMessage: "Nenhum exercício encontrado."
  },
  workoutPlans: {
    title: "Planos de Treino",
    columns: createWorkoutPlansColumns,
    addButtonText: "Novo plano",
    emptyMessage: "Nenhum plano de treino encontrado."
  }
} 