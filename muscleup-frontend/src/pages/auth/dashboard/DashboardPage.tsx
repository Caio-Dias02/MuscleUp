import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { 
  WeightProgressChart, 
  WorkoutFrequencyChart, 
  ExerciseProgressChart 
} from "@/components/fitness-charts"
import { WorkoutCalendar } from "@/components/workout-calendar"


export function DashboardPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="ml-64">
        <SiteHeader title="Dashboard" />
        <div className="flex flex-1 flex-col gap-6 p-6 pt-8 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 min-h-screen">
          <div className="space-y-6">
            {/* Gráficos superiores */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="transform hover:scale-105 transition-transform duration-200">
                <WeightProgressChart />
              </div>
              <div className="transform hover:scale-105 transition-transform duration-200">
                <WorkoutFrequencyChart />
              </div>
            </div>
            
            {/* Progresso nos Exercícios + Calendário lado a lado */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="transform hover:scale-105 transition-transform duration-200">
                <ExerciseProgressChart />
              </div>
              <div className="transform hover:scale-105 transition-transform duration-200">
                <WorkoutCalendar />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
