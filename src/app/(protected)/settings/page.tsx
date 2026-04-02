"use client"

import { authClient } from "@/lib/auth-client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldAlert, Loader } from "lucide-react"
import { TableAdminUsers } from "@/components/tables/table-admin-users"
import { TableAdminOrgs } from "@/components/tables/table-admin-orgs"

export default function SettingsPage() {
  const { data: session, isPending } = authClient.useSession()

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="animate-spin h-8 w-8 text-gray-900 dark:text-gray-100" />
      </div>
    )
  }

  if (session?.user?.role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <ShieldAlert className="h-16 w-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-medium">Access Denied</h1>
        <p className="text-gray-500 mt-2">
          You do not have permission to access this page.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 items-center justify-start min-h-screen pb-8">
      <h1 className="text-2xl font-medium mt-2">PLATFORM SETTINGS</h1>

      <Card className="w-full max-w-7xl">
        <CardHeader>
          <CardTitle className="text-xl font-medium">
            Users Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TableAdminUsers />
        </CardContent>
      </Card>

      <Card className="w-full max-w-7xl">
        <CardHeader>
          <CardTitle className="text-xl font-medium">
            Organizations Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TableAdminOrgs />
        </CardContent>
      </Card>
    </div>
  )
}
