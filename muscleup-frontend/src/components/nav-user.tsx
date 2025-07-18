import {
  IconDotsVertical,
  IconLogout,
  IconUserCircle,
} from "@tabler/icons-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useAuth } from "@/hooks/useAuth"
import { toast } from "sonner"
import { useNavigate } from "@tanstack/react-router"
import { useUser } from "@/hooks/useUser"

export function NavUser() {
  const { isMobile } = useSidebar()
  const { logout } = useAuth()
  const navigate = useNavigate()
  const { data: userData } = useUser()

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('Logout realizado com sucesso!')
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
      toast.error('Erro ao fazer logout')
    }
  }

  const handleAccountClick = () => {
    navigate({ to: '/app/profile' })
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="text-white hover:bg-white/20 hover:text-white data-[state=open]:bg-white/20 data-[state=open]:text-white"
            >
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                <AvatarImage src={userData?.profilePictureUrl} alt={userData?.name} />
                <AvatarFallback className="rounded-lg bg-white/20 text-white">
                  {userData?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'CN'}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium text-white">{userData?.name}</span>
                <span className="text-white/80 truncate text-xs">
                  {userData?.email}
                </span>
              </div>
              <IconDotsVertical className="ml-auto size-4 text-white" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={userData?.profilePictureUrl} alt={userData?.name} />
                  <AvatarFallback className="rounded-lg">
                    {userData?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'CN'}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{userData?.name}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {userData?.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={handleAccountClick}>
                <IconUserCircle />
                Perfil
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <IconLogout />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
