import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { AppSidebar } from "@/components/blocks/app-sidebar"
import { getServerSession } from "@/lib/get-session"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession()
  const user = session?.user

  if (!user) redirect("/sign-in")

  return (
    <SidebarProvider>
      <AppSidebar />

      <div className="flex-1 flex flex-col">
        <div className="absolute top-2 right-2">
          <SidebarTrigger />
        </div>

        <div className="absolute top-1 left-16 text-2xl font-bold bg-linear-to-r from-blue-400 via-pink-500 to-orange-400 bg-clip-text text-transparent mb-12">
          IN4COM
        </div>

        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </SidebarProvider>
  )
}
