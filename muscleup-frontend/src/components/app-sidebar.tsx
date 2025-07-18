import * as React from "react"
import {
  IconChartBar,
  IconDashboard,
  IconActivity,
  IconListDetails,
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/app/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Planos de Treino",
      url: "/app/workout-plans",
      icon: IconListDetails,
    },
    {
      title: "Dias de Treino",
      url: "/app/workout-days",
      icon: IconListDetails,
    },
    {
      title: "Exercícios de Treino",
      url: "/app/workout-exercises",
      icon: IconChartBar,
    },
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <div className="flex flex-col h-screen w-64 bg-gradient-to-b from-blue-600 via-purple-600 to-pink-600 border-r fixed left-0 top-0">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-white/20">
        <div className="flex items-center gap-3">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-white/20 text-white backdrop-blur-sm">
            <IconActivity className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold text-white">MuscleUp</span>
            <span className="truncate text-xs text-white/80">Fitness App</span>
          </div>
        </div>
      </div>
      
      {/* Navigation Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <NavMain items={data.navMain} />
      </div>
      
      {/* Footer - User Profile */}
      <div className="flex-shrink-0 p-4 border-t border-white/20">
        <NavUser />
      </div>
    </div>
  )
}
