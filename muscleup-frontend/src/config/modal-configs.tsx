import { type FieldConfig } from "@/components/dynamic-modal"
import { api } from "@/lib/axios"

// Configuração para Workout Days
export const workoutDayModalConfig: {
  title: string
  description: string
  fields: FieldConfig[]
  submitButtonText: string
  cancelButtonText: string
} = {
  title: "Dia de Treino",
  description: "Crie um novo dia de treino para seu plano",
  fields: [
    {
      name: "name",
      label: "Nome do Treino",
      type: "text" as const,
      required: true,
      placeholder: "Ex: Costas e Bíceps"
    },
    {
      name: "dayOfWeek",
      label: "Dia da Semana",
      type: "select" as const,
      required: true,
      options: [
        { value: "MONDAY", label: "Segunda-feira" },
        { value: "TUESDAY", label: "Terça-feira" },
        { value: "WEDNESDAY", label: "Quarta-feira" },
        { value: "THURSDAY", label: "Quinta-feira" },
        { value: "FRIDAY", label: "Sexta-feira" },
        { value: "SATURDAY", label: "Sábado" },
        { value: "SUNDAY", label: "Domingo" }
      ]
    },
    {
      name: "workoutPlanId",
      label: "Plano de Treino",
      type: "select" as const,
      required: true,
      options: [] // Será preenchido dinamicamente
    }
  ],
  submitButtonText: "Criar Dia de Treino",
  cancelButtonText: "Cancelar"
}

// Configuração para Workout Exercises
export const workoutExerciseModalConfig = {
  title: "Exercício",
  description: "Adicione um novo exercício ao seu treino",
  fields: [
    {
      name: "name",
      label: "Nome do Exercício",
      type: "text" as const,
      required: true,
      placeholder: "Ex: Supino Reto"
    },
    {
      name: "sets",
      label: "Número de Séries",
      type: "number" as const,
      required: true,
      placeholder: "Ex: 3",
      validation: (value: number) => {
        if (value < 1 || value > 20) {
          return "Número de séries deve estar entre 1 e 20"
        }
        return null
      }
    },
    {
      name: "reps",
      label: "Número de Repetições",
      type: "number" as const,
      required: true,
      placeholder: "Ex: 12",
      validation: (value: number) => {
        if (value < 1 || value > 100) {
          return "Número de repetições deve estar entre 1 e 100"
        }
        return null
      }
    },
    {
      name: "weight",
      label: "Peso (kg)",
      type: "number" as const,
      required: true,
      placeholder: "Ex: 50",
      validation: (value: number) => {
        if (value < 0 || value > 1000) {
          return "Peso deve estar entre 0 e 1000kg"
        }
        return null
      }
    },
    {
      name: "workoutDayId",
      label: "Dia de Treino",
      type: "select" as const,
      required: true,
      options: [] // Será preenchido dinamicamente
    }
  ],
  submitButtonText: "Adicionar Exercício",
  cancelButtonText: "Cancelar"
}

// Configuração para Workout Plans
export const workoutPlanModalConfig = {
  title: "Plano de Treino",
  description: "Crie um novo plano de treino personalizado",
  fields: [
    {
      name: "name",
      label: "Nome do Plano",
      type: "text" as const,
      required: true,
      placeholder: "Ex: Plano Iniciante"
    }
  ],
  submitButtonText: "Criar Plano",
  cancelButtonText: "Cancelar"
}

// Funções para submeter dados
export const modalSubmitHandlers = {
  // Criar Workout Day
  createWorkoutDay: async (data: any) => {
    const response = await api.post("/workout-days", data)
    return response.data
  },

  // Criar Workout Exercise
  createWorkoutExercise: async (data: any) => {
    const response = await api.post("/workout-exercises", data)
    return response.data
  },

  // Criar Workout Plan
  createWorkoutPlan: async (data: any) => {
    const response = await api.post("/workout-plans", data)
    return response.data
  },

  // Atualizar Workout Day
  updateWorkoutDay: async (id: string, data: any) => {
    const response = await api.patch(`/workout-days/${id}`, data)
    return response.data
  },

  // Atualizar Workout Exercise
  updateWorkoutExercise: async (id: string, data: any) => {
    const response = await api.patch(`/workout-exercises/${id}`, data)
    return response.data
  },

  // Atualizar Workout Plan
  updateWorkoutPlan: async (id: string, data: any) => {
    const response = await api.patch(`/workout-plans/${id}`, data)
    return response.data
  }
}

// Configurações completas prontas para uso
export const modalConfigs = {
  workoutDays: {
    create: {
      ...workoutDayModalConfig,
      onSubmit: modalSubmitHandlers.createWorkoutDay
    },
    edit: {
      ...workoutDayModalConfig,
      title: "Editar Dia de Treino",
      submitButtonText: "Salvar Alterações",
      onSubmit: (data: any) => {
        const { id, ...updateData } = data;
        return modalSubmitHandlers.updateWorkoutDay(id, updateData);
      }
    }
  },
  workoutExercises: {
    create: {
      ...workoutExerciseModalConfig,
      onSubmit: modalSubmitHandlers.createWorkoutExercise
    },
    edit: {
      ...workoutExerciseModalConfig,
      title: "Editar Exercício",
      submitButtonText: "Salvar Alterações",
      onSubmit: (data: any) => {
        const { id, ...updateData } = data;
        return modalSubmitHandlers.updateWorkoutExercise(id, updateData);
      }
    }
  },
  workoutPlans: {
    create: {
      ...workoutPlanModalConfig,
      onSubmit: modalSubmitHandlers.createWorkoutPlan
    },
    edit: {
      ...workoutPlanModalConfig,
      title: "Editar Plano de Treino",
      submitButtonText: "Salvar Alterações",
      onSubmit: (data: any) => {
        const { id, ...updateData } = data;
        return modalSubmitHandlers.updateWorkoutPlan(id, updateData);
      }
    }
  }
} 