"use client"

import { Home, Settings, StickyNote } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Logout } from "./logout"
import { ModeSwitcher } from "./mode-switcher"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { authClient } from "@/lib/auth-client"
import Loading from "@/app/loading"
import UnauthorizedPage from "@/app/unauthorized"
import Image from "next/image"

export const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Projects",
    url: "/projects",
    icon: StickyNote,
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { open } = useSidebar()

  const { data: session, isPending, error } = authClient.useSession()

  if (isPending) {
    return <Loading />
  }

  if (error || !session) {
    return <UnauthorizedPage />
  }

  // console.log("User session in sidebar:", session)

  return (
    <Sidebar className="flex flex-col h-screen" collapsible="icon">
      <SidebarContent className="flex-1">
        <SidebarHeader>
          {open ? (
            <div className="flex flex-row gap-4 items-center justify-center">
              <Image src="/Logo.jpg" alt="Logo" width={36} height={36} />
              <h1 className="text-4xl font-bold bg-linear-to-r from-blue-400 via-pink-500 to-orange-400 bg-clip-text text-transparent">
                PROJECT
              </h1>
            </div>
          ) : (
            <Image src="/Logo.jpg" alt="Logo" width={40} height={40} />
          )}
        </SidebarHeader>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a
                      href={item.url}
                      className={`flex items-center p-2 rounded-md ${
                        pathname === item.url
                          ? "bg-gray-200 dark:bg-gray-600 text-orange-400"
                          : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-white"
                      }`}
                    >
                      <item.icon size={24} className="mr-2" />
                      <span className="text-lg">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="mt-auto mb-1">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a
                href={"/account"}
                className={`flex items-center p-2 rounded-md ${
                  pathname === "/account"
                    ? "bg-gray-200 dark:bg-gray-600 text-orange-400"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-white"
                }`}
              >
                <Settings size={24} className="mr-4" />
                <span className="text-lg">Account</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <ModeSwitcher className="flex items-center justify-start" />
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Logout />
            </SidebarMenuButton>
          </SidebarMenuItem>
          <Separator className="my-1" />
          <SidebarMenuItem className="p-1">
            <div
              className={cn(
                "flex items-center gap-3 pl-1",
                !open && "justify-center rounded-full"
              )}
            >
              <Avatar className={cn("h-8 w-8", !open && "h-6 w-6")}>
                <AvatarImage
                  src={session.user.image ?? undefined}
                  alt={session.user.name ?? "User"}
                />
                <AvatarFallback>
                  {session.user.name
                    ? session.user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                    : "U"}
                </AvatarFallback>
              </Avatar>
              {open && (
                <span className="text-lg font-medium text-gray-800 dark:text-gray-100 truncate">
                  {session.user.name}
                </span>
              )}
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

// <ModeSwitcher className="flex items-center justify-start" />
