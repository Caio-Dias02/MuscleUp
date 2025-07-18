import { IconTrendingUp, IconBarbell, IconHeart, IconTarget } from "@tabler/icons-react"
import * as React from "react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useProgressData } from "@/hooks/useProgressData"

export function SectionCards() {
  const { progressData } = useProgressData()

  // Calcular métricas dos dados de progresso
  const metrics = React.useMemo(() => {
    if (!progressData.length) {
      return {
        totalWorkouts: 0,
        avgWeight: 0,
        totalCalories: 0,
        avgDuration: 0
      }
    }

    const last30Days = progressData.slice(-30)
    const totalWorkouts = last30Days.reduce((sum, day) => sum + day.workoutCount, 0)
    const totalCalories = last30Days.reduce((sum, day) => sum + day.caloriesBurned, 0)
    const avgDuration = last30Days.reduce((sum, day) => sum + day.workoutDuration, 0) / totalWorkouts || 0
    
    const weightData = last30Days.filter(day => day.weight).map(day => day.weight!)
    const avgWeight = weightData.length > 0 ? weightData.reduce((sum, weight) => sum + weight, 0) / weightData.length : 0

    return {
      totalWorkouts,
      avgWeight: Math.round(avgWeight * 10) / 10,
      totalCalories,
      avgDuration: Math.round(avgDuration)
    }
  }, [progressData])

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Treinos Realizados</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {metrics.totalWorkouts}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconBarbell className="size-3" />
              Últimos 30 dias
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Mantendo consistência <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Treinos completados este mês
          </div>
        </CardFooter>
      </Card>
      
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Peso Médio</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {metrics.avgWeight}kg
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTarget className="size-3" />
              Atual
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Monitorando progresso <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Peso médio dos últimos 30 dias
          </div>
        </CardFooter>
      </Card>
      
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Calorias Queimadas</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {metrics.totalCalories.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconHeart className="size-3" />
              +15.3%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Queimando calorias <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Total dos últimos 30 dias
          </div>
        </CardFooter>
      </Card>
      
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Duração Média</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {metrics.avgDuration}m
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconBarbell className="size-3" />
              +8.2%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Treinos mais longos <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Duração média por treino
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
