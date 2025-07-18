"use client"

import * as React from "react"
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { useProgressData } from "@/hooks/useProgressData"

const chartConfig = {
  weight: {
    label: "Peso (kg)",
    color: "#3b82f6", // Azul vibrante
  },
  reps: {
    label: "Repetições",
    color: "#ef4444", // Vermelho vibrante
  },
  sets: {
    label: "Séries",
    color: "#10b981", // Verde vibrante
  },
  volume: {
    label: "Volume Total",
    color: "#f59e0b", // Laranja vibrante
  },
} satisfies ChartConfig

export function ExerciseProgressChart() {
  const { exerciseProgress, isLoading } = useProgressData()
  const [selectedExercise, setSelectedExercise] = React.useState("")
  const [metric, setMetric] = React.useState("weight")

  const exercises = React.useMemo(() => {
    const uniqueExercises = [...new Set(exerciseProgress.map(ex => ex.exerciseName))]
    return uniqueExercises
  }, [exerciseProgress])

  const filteredData = React.useMemo(() => {
    if (!selectedExercise) return []
    
    return exerciseProgress
      .filter(ex => ex.exerciseName === selectedExercise)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(ex => ({
        date: new Date(ex.date).toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' }),
        weight: ex.weight,
        reps: ex.reps,
        sets: ex.sets,
        volume: ex.weight * ex.reps * ex.sets
      }))
  }, [exerciseProgress, selectedExercise])

  const formatDate = (dateString: string) => {
    return dateString
  }

  // Cores vibrantes para cada métrica
  const getMetricColor = (metricType: string) => {
    switch (metricType) {
      case 'weight':
        return '#3b82f6' // Azul
      case 'reps':
        return '#ef4444' // Vermelho
      case 'sets':
        return '#10b981' // Verde
      case 'volume':
        return '#f59e0b' // Laranja
      default:
        return '#3b82f6'
    }
  }

  React.useEffect(() => {
    if (exercises.length > 0 && !selectedExercise) {
      setSelectedExercise(exercises[0])
    }
  }, [exercises, selectedExercise])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Progresso nos Exercícios</CardTitle>
          <CardDescription>Carregando dados...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Progresso nos Exercícios</CardTitle>
        <CardDescription>
          Acompanhe sua evolução em exercícios específicos
        </CardDescription>
        <div className="flex gap-2">
          <Select value={selectedExercise} onValueChange={setSelectedExercise}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecione o exercício" />
            </SelectTrigger>
            <SelectContent>
              {exercises.map((exercise) => (
                <SelectItem key={exercise} value={exercise}>
                  {exercise}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={metric} onValueChange={setMetric}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Métrica" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weight">Peso</SelectItem>
              <SelectItem value="reps">Repetições</SelectItem>
              <SelectItem value="sets">Séries</SelectItem>
              <SelectItem value="volume">Volume</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <LineChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatDate}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fill: '#6b7280' }}
            />
            <YAxis 
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fill: '#6b7280' }}
            />
            <ChartTooltip
              content={({ active, payload }) => {
                if (!active || !payload) return null
                return (
                  <ChartTooltipContent
                    active={active}
                    payload={payload}
                    labelFormatter={formatDate}
                  />
                )
              }}
            />
            <Line
              type="monotone"
              dataKey={metric}
              stroke={getMetricColor(metric)}
              strokeWidth={3}
              dot={{ fill: getMetricColor(metric), strokeWidth: 2, r: 5 }}
              activeDot={{ r: 8, fill: getMetricColor(metric), stroke: '#ffffff', strokeWidth: 2 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
} 