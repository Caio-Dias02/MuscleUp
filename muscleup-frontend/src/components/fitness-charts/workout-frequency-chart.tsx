"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

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
  workoutCount: {
    label: "Treinos",
    color: "#8b5cf6", // Roxo vibrante
  },
  workoutDuration: {
    label: "Duração (min)",
    color: "#f59e0b", // Laranja vibrante
  },
  caloriesBurned: {
    label: "Calorias",
    color: "#ec4899", // Rosa vibrante
  },
  daysWithWorkout: {
    label: "Dias com Treino",
    color: "#06b6d4", // Ciano vibrante
  },
} satisfies ChartConfig

export function WorkoutFrequencyChart() {
  const { progressData, isLoading } = useProgressData()
  const [timeRange, setTimeRange] = React.useState("30d")
  const [metric, setMetric] = React.useState("workoutCount")

  const processedData = React.useMemo(() => {
    if (!progressData.length) return []
    
    const daysToShow = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90
    const filteredData = progressData.slice(-daysToShow)
    
    // Agrupar por semana se for 30d ou 90d
    if (timeRange === "30d" || timeRange === "90d") {
      const weeklyData: { [key: string]: any } = {}
      
      filteredData.forEach(day => {
        const date = new Date(day.date)
        const weekStart = new Date(date)
        weekStart.setDate(date.getDate() - date.getDay()) // Domingo
        const weekKey = weekStart.toISOString().split('T')[0]
        
        if (!weeklyData[weekKey]) {
          weeklyData[weekKey] = {
            week: `Semana ${weekStart.toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' })}`,
            workoutCount: 0,
            workoutDuration: 0,
            caloriesBurned: 0,
            daysWithWorkout: 0
          }
        }
        
        weeklyData[weekKey].workoutCount += day.workoutCount
        weeklyData[weekKey].workoutDuration += day.workoutDuration
        weeklyData[weekKey].caloriesBurned += day.caloriesBurned
        if (day.workoutCount > 0) {
          weeklyData[weekKey].daysWithWorkout += 1
        }
      })
      
      return Object.values(weeklyData)
    }
    
    // Para 7 dias, mostrar dados diários
    return filteredData.map(day => ({
      date: new Date(day.date).toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' }),
      workoutCount: day.workoutCount,
      workoutDuration: day.workoutDuration,
      caloriesBurned: day.caloriesBurned
    }))
  }, [progressData, timeRange])

  // Cores vibrantes para cada métrica
  const getMetricColor = (metricType: string) => {
    switch (metricType) {
      case 'workoutCount':
        return '#8b5cf6' // Roxo
      case 'workoutDuration':
        return '#f59e0b' // Laranja
      case 'caloriesBurned':
        return '#ec4899' // Rosa
      case 'daysWithWorkout':
        return '#06b6d4' // Ciano
      default:
        return '#8b5cf6'
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Frequência de Treinos</CardTitle>
          <CardDescription>Carregando dados...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Frequência de Treinos</CardTitle>
        <CardDescription>
          Acompanhe sua frequência de treinos e gasto calórico
        </CardDescription>
        <div className="flex gap-2">
          <Select value={metric} onValueChange={setMetric}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecione a métrica" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="workoutCount">Número de Treinos</SelectItem>
              <SelectItem value="workoutDuration">Duração dos Treinos</SelectItem>
              <SelectItem value="caloriesBurned">Calorias Queimadas</SelectItem>
              {timeRange !== "7d" && <SelectItem value="daysWithWorkout">Dias com Treino</SelectItem>}
            </SelectContent>
          </Select>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 dias</SelectItem>
              <SelectItem value="30d">30 dias</SelectItem>
              <SelectItem value="90d">90 dias</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <BarChart data={processedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey={timeRange === "7d" ? "date" : "week"}
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
                  />
                )
              }}
            />
            <Bar
              dataKey={metric}
              fill={getMetricColor(metric)}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
} 