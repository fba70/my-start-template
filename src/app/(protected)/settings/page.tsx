"use client"

import { authClient } from "@/lib/auth-client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BadgeCheck, BadgeAlert } from "lucide-react"
import UpdateUserDialog from "@/components/forms/form-edit-user"
import ResetPasswordForm from "@/components/forms/form-reset-password"

type User = {
  id: string
  createdAt: Date
  updatedAt: Date
  email: string
  emailVerified: boolean
  name: string
  image?: string | null | undefined
}

export default function DashboardPage() {
  const { data: session, refetch } = authClient.useSession()
  const user = session?.user as User | undefined

  console.log("User session in settings page:", user)

  return (
    <div className="flex flex-col gap-2 items-center justify-start h-screen">
      <h1 className="text-2xl font-bold mt-1">SETTINGS</h1>

      {user && (
        <Card className="w-full max-w-md mt-6 bg-white dark:bg-slate-800">
          <CardHeader className="flex flex-row items-center gap-6 justify-start">
            <Avatar>
              <AvatarImage
                src={user.image ?? undefined}
                alt={user.name ?? "User"}
              />
              <AvatarFallback>
                {user.name
                  ? user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                  : "U"}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-xl font-medium">{user.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 grid-rows-3 gap-2">
              <span className="font-medium text-gray-500">User Email:</span>
              <span>{user.email}</span>
              <span className="font-medium text-gray-500">Email Verified:</span>
              <span>
                {user.emailVerified ? (
                  <BadgeCheck className="inline-block text-green-500" />
                ) : (
                  <BadgeAlert className="inline-block text-red-500" />
                )}
              </span>
              <span className="font-medium text-gray-500">
                User Created At:
              </span>
              <span>
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleString()
                  : "N/A"}
              </span>
            </div>

            <div className="flex felx-row gap-4 items-center justyfy-center">
              <UpdateUserDialog user={user} onSuccess={refetch} />
              <ResetPasswordForm />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
