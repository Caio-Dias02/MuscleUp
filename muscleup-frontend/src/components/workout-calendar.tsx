import React from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { IconBarbell, IconCalendar, IconLoader } from "@tabler/icons-react"
import { useWorkoutDays } from "@/hooks/useWorkoutDays"
import { WorkoutDayExercises } from "@/components/workout-day-exercises"
import { ptBR } from "date-fns/locale"

export function WorkoutCalendar() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  const [selectedWorkoutDay, setSelectedWorkoutDay] = React.useState<any>(null)
  const { data: workoutDays, isLoading, error } = useWorkoutDays()
  
  // Mapeamento dos dias da semana para números (0 = Domingo, 1 = Segunda, etc.)
  const dayOfWeekMap: { [key: string]: number } = {
    'SUNDAY': 0,
    'MONDAY': 1,
    'TUESDAY': 2,
    'WEDNESDAY': 3,
    'THURSDAY': 4,
    'FRIDAY': 5,
    'SATURDAY': 6
  }

  // Cores para diferentes tipos de treino
  const workoutColors = [
    { bg: "#3b82f6", text: "#ffffff" }, // Azul
    { bg: "#ef4444", text: "#ffffff" }, // Vermelho
    { bg: "#10b981", text: "#ffffff" }, // Verde
    { bg: "#f59e0b", text: "#ffffff" }, // Laranja
    { bg: "#8b5cf6", text: "#ffffff" }, // Roxo
    { bg: "#ec4899", text: "#ffffff" }, // Rosa
    { bg: "#06b6d4", text: "#ffffff" }, // Ciano
  ]

  // Função para obter cor baseada no nome do treino
  const getWorkoutColor = (workoutName: string) => {
    const index = workoutName.length % workoutColors.length
    return workoutColors[index]
  }

  // Função para gerar datas de treino baseadas nos dias da semana
  const generateWorkoutDates = React.useMemo(() => {
    if (!workoutDays || workoutDays.length === 0) return []
    
    const workoutDates: any[] = []
    const today = new Date()
    const startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1) // 1 mês atrás
    const endDate = new Date(today.getFullYear(), today.getMonth() + 2, 0) // 2 meses à frente
    
    workoutDays.forEach(workoutDay => {
      const dayOfWeek = dayOfWeekMap[workoutDay.dayOfWeek]
      if (dayOfWeek === undefined) return
      
      let currentDate = new Date(startDate)
      
      // Encontrar a primeira ocorrência do dia da semana
      while (currentDate.getDay() !== dayOfWeek) {
        currentDate.setDate(currentDate.getDate() + 1)
      }
      
      // Gerar todas as ocorrências até a data final
      while (currentDate <= endDate) {
        workoutDates.push({
          date: new Date(currentDate),
          workoutDay: workoutDay
        })
        currentDate.setDate(currentDate.getDate() + 7) // Próxima semana
      }
    })
    
    return workoutDates
  }, [workoutDays])

  // Função para verificar se uma data tem treino
  const hasWorkout = (date: Date) => {
    return generateWorkoutDates.some(event => 
      event.date.toDateString() === date.toDateString()
    )
  }

  // Função para obter o workout day de uma data
  const getWorkoutDay = (date: Date) => {
    const event = generateWorkoutDates.find(event => 
      event.date.toDateString() === date.toDateString()
    )
    return event?.workoutDay
  }

  // Função para obter a cor de um treino específico
  const getWorkoutStyle = (date: Date) => {
    const workoutDay = getWorkoutDay(date)
    if (!workoutDay) return {}
    
    const color = getWorkoutColor(workoutDay.name)
    return {
      backgroundColor: color.bg,
      color: color.text,
      fontWeight: "bold"
    }
  }

  // Função para lidar com a seleção de uma data
  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate)
    if (selectedDate && hasWorkout(selectedDate)) {
      setSelectedWorkoutDay(getWorkoutDay(selectedDate))
    } else {
      setSelectedWorkoutDay(null)
    }
  }

  // Próximos treinos (próximas 3 ocorrências)
  const upcomingWorkouts = React.useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Reset para início do dia
    return generateWorkoutDates
      .filter(event => {
        const eventDate = new Date(event.date)
        eventDate.setHours(0, 0, 0, 0)
        return eventDate >= today
      })
      .slice(0, 3)
      .map(event => ({
        date: event.date,
        workoutDay: event.workoutDay
      }))
  }, [generateWorkoutDates])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconCalendar className="h-5 w-5" />
            Calendário de Treinos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <IconLoader className="h-6 w-6 animate-spin mr-2" />
            <span className="text-muted-foreground">Carregando calendário...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconCalendar className="h-5 w-5" />
            Calendário de Treinos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-destructive">
            Erro ao carregar dados dos treinos
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconCalendar className="h-5 w-5" />
          Calendário de Treinos
        </CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center">
        <div className="w-fit">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            className="rounded-md border"
            locale={ptBR}
            showOutsideDays={true}
            classNames={{
              nav: "hidden", // Remove as flechas de navegação
              caption: "flex justify-center pt-1 relative items-center",
              caption_label: "text-sm font-medium",
              head_row: "hidden", // Remove as abreviações dos dias da semana
              months: "flex justify-center",
              month: "space-y-4",
              table: "w-full border-collapse space-y-1",
              row: "flex w-full mt-2",
              cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
              day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
            }}
            modifiers={{
              workout: (date) => hasWorkout(date)
            }}
            modifiersStyles={{
              workout: (date) => getWorkoutStyle(date)
            }}
          />
        </div>
      </CardContent>
      
      {/* Detalhes do treino selecionado */}
      {date && selectedWorkoutDay && (
        <CardContent className="pt-0">
          <div className="p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <IconBarbell className="h-4 w-4" />
              <span className="text-sm font-medium">{selectedWorkoutDay.name}</span>
            </div>
            <p className="text-xs text-muted-foreground mb-2">
              {date.toLocaleDateString('pt-BR', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long' 
              })}
            </p>
            
            {/* Exercícios do dia */}
            <WorkoutDayExercises workoutDayId={selectedWorkoutDay.id} />
          </div>
        </CardContent>
      )}

      {/* Próximos treinos */}
      {upcomingWorkouts.length > 0 && (
        <CardContent className="pt-0">
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Próximos Treinos:</h4>
            <div className="space-y-1">
              {upcomingWorkouts.map((workout, index) => {
                const color = getWorkoutColor(workout.workoutDay.name)
                return (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded-md">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: color.bg }}
                      />
                      <span className="text-xs font-medium">{workout.workoutDay.name}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {workout.date.toLocaleDateString('pt-BR', { 
                        day: 'numeric', 
                        month: 'short' 
                      })}
                    </Badge>
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      )}

      {/* Mensagem quando não há treinos */}
      {workoutDays && workoutDays.length === 0 && (
        <CardContent className="pt-0">
          <div className="mt-4 p-4 text-center text-muted-foreground">
            <IconCalendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Nenhum dia de treino configurado</p>
            <p className="text-xs">Configure seus dias de treino para ver o calendário</p>
          </div>
        </CardContent>
      )}
    </Card>
  )
} 