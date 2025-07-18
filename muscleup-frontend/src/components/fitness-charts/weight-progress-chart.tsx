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
  bodyFat: {
    label: "Gordura Corporal (%)",
    color: "#ef4444", // Vermelho vibrante
  },
  muscleMass: {
    label: "Massa Muscular (kg)",
    color: "#10b981", // Verde vibrante
  },
} satisfies ChartConfig

export function WeightProgressChart() {
  const { progressData, isLoading } = useProgressData()
  const [timeRange, setTimeRange] = React.useState("30d")
  const [metric, setMetric] = React.useState("weight")

  const filteredData = React.useMemo(() => {
    if (!progressData.length) return []
    
    const daysToShow = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90
    return progressData.slice(-daysToShow)
  }, [progressData, timeRange])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', { 
      month: 'short', 
      day: 'numeric' 
    })
  }

  // Cores vibrantes para cada métrica
  const getMetricColor = (metricType: string) => {
    switch (metricType) {
      case 'weight':
        return '#3b82f6' // Azul
      case 'bodyFat':
        return '#ef4444' // Vermelho
      case 'muscleMass':
        return '#10b981' // Verde
      default:
        return '#3b82f6'
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Progresso Corporal</CardTitle>
          <CardDescription>Carregando dados...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Progresso Corporal</CardTitle>
        <CardDescription>
          Acompanhe sua evolução de peso e medidas corporais
        </CardDescription>
        <div className="flex gap-2">
          <Select value={metric} onValueChange={setMetric}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecione a métrica" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weight">Peso</SelectItem>
              <SelectItem value="bodyFat">Gordura Corporal</SelectItem>
              <SelectItem value="muscleMass">Massa Muscular</SelectItem>
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