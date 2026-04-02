"use client"

import {
  Home,
  Loader,
  FileText,
  ShieldCheck,
  CircleUserRound,
  FileImage,
} from "lucide-react"
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
import UnauthorizedPage from "@/app/unauthorized"
import Image from "next/image"
import Link from "next/link"
import { NotificationsDrawer } from "./notifications-drawer"

export const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Cards",
    url: "/cards",
    icon: FileImage,
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { open } = useSidebar()

  const { data: session, isPending, error } = authClient.useSession()
  const {
    data: organization,
    isPending: isPendingOrg,
    error: errorOrg,
  } = authClient.useActiveOrganization()

  if (!isPending && (error || !session)) {
    return <UnauthorizedPage />
  }

  if (!isPendingOrg && (errorOrg || !organization)) {
    return <UnauthorizedPage />
  }

  // console.log("User session in sidebar:", session)

  return (
    <Sidebar className="flex flex-col h-screen" collapsible="icon">
      <SidebarContent className="flex-1">
        <SidebarHeader>
          {open ? (
            <div className="flex flex-row gap-5 items-center justify-center">
              <Image
                src="/TP_golden_icon_small.jpg"
                alt="Logo"
                width={28}
                height={28}
                className="mt-1 rounded-full"
              />
              <h1 className="text-3xl font-bold bg-linear-to-r from-orange-500 via-pink-500 to-blue-400 bg-clip-text text-transparent">
                truffalo.ai
              </h1>
            </div>
          ) : (
            <Image
              src="/TP_golden_icon_small.jpg"
              alt="Logo"
              width={40}
              height={40}
              className="mt-1 rounded-full"
            />
          )}
        </SidebarHeader>

        <SidebarGroup>
          <Separator className="mb-3 -mt-3" />
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.url}
                      className={`flex items-center p-2 rounded-md ${
                        pathname === item.url
                          ? "bg-gray-200 dark:bg-gray-600 text-orange-400"
                          : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-white"
                      }`}
                    >
                      <item.icon size={24} className="mr-2" />
                      <span className="text-lg">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="mt-auto mb-1">
        <SidebarMenu>
          <Separator className="my-1" />

          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                href={"/account"}
                className={`flex items-center p-2 rounded-md ${
                  pathname === "/account"
                    ? "bg-gray-200 dark:bg-gray-600 text-orange-400"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-white"
                }`}
              >
                <CircleUserRound size={24} className="mr-3 ml-1" />
                <span className="text-lg">Account</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {session?.user?.role === "admin" && (
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link
                  href={"/settings"}
                  className={`flex items-center p-2 rounded-md ${
                    pathname === "/settings"
                      ? "bg-gray-200 dark:bg-gray-600 text-orange-400"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-white"
                  }`}
                >
                  <ShieldCheck size={24} className="mr-3 ml-1" />
                  <span className="text-lg">Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NotificationsDrawer compact={!open} />
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                href={"/docs"}
                className={`flex items-center p-2 rounded-md ${
                  pathname === "/docs"
                    ? "bg-gray-200 dark:bg-gray-600 text-orange-400"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-white"
                }`}
              >
                <FileText size={24} className="mr-3 ml-1" />
                <span className="text-lg">Documents</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <ModeSwitcher
                className={cn(
                  "flex items-center justify-start",
                  !open ? "ml-1" : "",
                )}
              />
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Logout />
            </SidebarMenuButton>
          </SidebarMenuItem>

          <Separator className="my-1" />
          <SidebarMenuItem className="p-1">
            {isPendingOrg ? (
              <div className="flex items-center justify-center p-2">
                <Loader className="animate-spin h-6 w-6 text-gray-900 dark:text-gray-100" />
              </div>
            ) : session ? (
              <div
                className={cn(
                  "flex items-center gap-3 pl-1",
                  !open && "justify-center rounded-full",
                )}
              >
                <Avatar className={cn("h-8 w-8", !open && "h-6 w-6")}>
                  <AvatarImage
                    src={organization?.logo ?? undefined}
                    alt={organization?.name ?? "User"}
                  />
                  <AvatarFallback>
                    {organization?.name
                      ? organization?.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                      : "U"}
                  </AvatarFallback>
                </Avatar>
                {open && (
                  <span className="text-lg font-medium text-gray-800 dark:text-gray-100 truncate">
                    {organization?.name}
                  </span>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center p-2">
                <span className="text-sm text-gray-500 truncate">
                  No organization
                </span>
              </div>
            )}
          </SidebarMenuItem>

          <SidebarMenuItem className="p-1">
            {isPending ? (
              <div className="flex items-center justify-center p-2">
                <Loader className="animate-spin h-6 w-6 text-gray-900 dark:text-gray-100" />
              </div>
            ) : session ? (
              <div
                className={cn(
                  "flex items-center gap-3 pl-1",
                  !open && "justify-center rounded-full",
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
            ) : (
              <div className="flex items-center justify-center p-2">
                <span className="text-sm text-gray-500 truncate">
                  No session
                </span>
              </div>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

// <ModeSwitcher className="flex items-center justify-start" />
