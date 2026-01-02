"use client"

import { authClient } from "@/lib/auth-client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BadgeCheck, BadgeAlert } from "lucide-react"
import UpdateUserDialog from "@/components/forms/form-edit-user"
import ResetPasswordForm from "@/components/forms/form-reset-password"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"

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

  // console.log("User session in settings page:", user)

  return (
    <div className="flex flex-col gap-4 items-center justify-start h-screen">
      <h1 className="text-2xl font-medium mt-1">ACCOUNT</h1>

      {user && (
        <Card className="w-full max-w-md mt-6">
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
              <span className="font-medium dark:text-gray-400 text-gray-500">
                User Email:
              </span>
              <span>{user.email}</span>
              <span className="font-medium dark:text-gray-400 text-gray-500">
                Email Verified:
              </span>
              <span>
                {user.emailVerified ? (
                  <BadgeCheck className="inline-block text-green-500" />
                ) : (
                  <BadgeAlert className="inline-block text-red-500" />
                )}
              </span>
              <span className="font-medium dark:text-gray-400 text-gray-500">
                User Created At:
              </span>
              <span>
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleString()
                  : "N/A"}
              </span>
            </div>

            <div className="flex flex-row gap-4 items-center justify-center">
              <UpdateUserDialog user={user} onSuccess={refetch} />
              <ResetPasswordForm />
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="w-full max-w-md mt-6">
        <CardHeader className="flex flex-row items-center gap-6 justify-start">
          <CardTitle className="text-xl font-medium">Account balance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-2 grid-rows-1 gap-2">
            <span className="font-medium dark:text-gray-400 text-gray-500">
              Current balance (EUR):
            </span>
            <span>12.30</span>
          </div>
          <Separator />
          <div>Purchase credits</div>
          <div className="grid grid-cols-2 grid-rows-3 gap-2">
            <span className="font-medium dark:text-gray-400 text-gray-500">
              Purchase name:
            </span>
            <span>One-off credits purchase</span>
            <span className="font-medium dark:text-gray-400 text-gray-500">
              Product price (EUR):
            </span>
            <span>10.00</span>
            <span className="font-medium dark:text-gray-400 text-gray-500">
              Purchase type:
            </span>
            <span>One-off purchase</span>
          </div>

          <div className="flex flex-row gap-4 items-center justify-center">
            <Link
              href="https://buy.polar.sh/polar_cl_FiMDiynGGn97dqMLS9RkYqMQz4ql76NVeiutB0ij768"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button>Purchase</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
