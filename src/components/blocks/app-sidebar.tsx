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
} from "@/components/ui/sidebar"
import { Logout } from "./logout"
import { ModeSwitcher } from "./mode-switcher"
import { usePathname } from "next/navigation"

export const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Test",
    url: "/test",
    icon: StickyNote,
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar className="flex flex-col h-screen">
      <SidebarContent className="flex-1">
        <SidebarHeader className="flex flex-col items-center justify-center gap-2">
          <h1 className="text-5xl font-bold bg-linear-to-r from-blue-400 via-pink-500 to-orange-400 bg-clip-text text-transparent mb-2">
            IN4COM
          </h1>
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

      <SidebarFooter className="mt-auto mb-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a
                href={"/settings"}
                className={`flex items-center p-2 rounded-md ${
                  pathname === "/settings"
                    ? "bg-gray-200 dark:bg-gray-700 text-blue-600"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <Settings size={24} className="mr-2" />
                <span className="text-lg">Settings</span>
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
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

// <ModeSwitcher className="flex items-center justify-start" />
