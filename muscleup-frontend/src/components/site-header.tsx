import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

interface SiteHeaderProps {
  title?: string;
}

export function SiteHeader({ title = "Dashboard" }: SiteHeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 h-4"
        />
        <h1 className="text-base font-medium">{title}</h1>
      </div>
    </header>
  )
}
