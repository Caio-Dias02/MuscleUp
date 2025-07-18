import { type Icon } from "@tabler/icons-react"
import { Link } from "@tanstack/react-router"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: Icon
  }[]
}) {
  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              tooltip="Home" 
              asChild
              className="text-white hover:bg-white/20 hover:text-white data-[state=open]:bg-white/20 data-[state=open]:text-white"
            >
              <Link to="/app/dashboard">
                <span>Home</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton 
                tooltip={item.title} 
                asChild
                className="text-white hover:bg-white/20 hover:text-white data-[state=open]:bg-white/20 data-[state=open]:text-white"
              >
                <Link to={item.url}>
                  {item.icon && <item.icon className="text-white" />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
