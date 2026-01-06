"use client"

import { useEffect, useState } from "react"
import { authClient } from "@/lib/auth-client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BadgeCheck, BadgeAlert } from "lucide-react"
import UpdateUserDialog from "@/components/forms/form-edit-user"
import ResetPasswordForm from "@/components/forms/form-reset-password"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { PolarCustomerState, PolarOrder } from "@/types/polar"
import { TableUserOrders } from "@/components/tables/table-user-orders"

type User = {
  id: string
  createdAt: Date
  updatedAt: Date
  email: string
  emailVerified: boolean
  name: string
  image?: string | null | undefined
}

type SimplifiedOrders = {
  id: string
  createdAt: string
  paid: boolean
  netAmount: number
  taxAmount: number
  totalAmount: number
  currency: string
  invoiceNumber: string
  productName: string
}

export default function AccountPage() {
  const { data: session, refetch } = authClient.useSession()
  const user = session?.user as User | undefined

  const [userState, setUserState] = useState<PolarCustomerState>()
  const [userOrders, setUserOrders] = useState<SimplifiedOrders[]>([])

  // console.log("User session in settings page:", user)

  useEffect(() => {
    async function fetchUserState() {
      if (!user?.id) return
      try {
        const res = await fetch(
          `/api/auth/polar/state?id=${encodeURIComponent(user.id)}`
        )
        const userState = await res.json()
        setUserState(userState)
        // console.log("Polar user state:", userState)
      } catch (e) {
        console.error("Failed to fetch Polar user state:", e)
      }
    }

    fetchUserState()
  }, [user?.id])

  useEffect(() => {
    async function fetchUserOrders() {
      if (!userState?.id) return
      try {
        const res = await fetch(
          `/api/auth/polar/orders?id=${encodeURIComponent(userState?.id)}`
        )
        const userOrdersAllData = await res.json()
        // console.log("Polar user ALL orders:", userOrdersAllData.result.items)

        // Transform to only include the required fields
        const simplifiedOrders = (
          userOrdersAllData.result.items as PolarOrder[]
        ).map((order) => ({
          id: order.id,
          createdAt: order.createdAt,
          paid: order.paid,
          netAmount: order.netAmount,
          taxAmount: order.taxAmount,
          totalAmount: order.totalAmount,
          currency: order.currency,
          invoiceNumber: order.invoiceNumber,
          productName: order.product?.name ?? "",
        }))
        setUserOrders(simplifiedOrders)
        //console.log("Polar user orders:", simplifiedOrders)
      } catch (e) {
        console.error("Failed to fetch Polar user orders:", e)
      }
    }

    fetchUserOrders()
  }, [user?.id, userState?.id])

  return (
    <div className="flex flex-col gap-4 items-center justify-start h-screen">
      <h1 className="text-2xl font-medium mt-2">ACCOUNT</h1>

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

      <Card className="w-full max-w-5xl mt-6">
        <CardHeader className="flex flex-row items-center gap-6 justify-start">
          <CardTitle className="text-xl font-medium">Account balance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex flex-row gap-4 items-center justify-start">
            <span className="font-medium dark:text-gray-400 text-gray-500">
              Current balance (EUR):
            </span>
            <span className="text-xl font-medium">12.30</span>
          </div>
          <Separator />
          <div>Purchase credits</div>
          <div className="flex flex-row gap-8 items-center justify-center">
            <div className="border-2 border-gray-200 dark:border-gray-700 rounded-md p-4">
              <div className="grid grid-cols-2 grid-rows-3 gap-x-6 gap-y-2">
                <span className="font-medium dark:text-gray-400 text-gray-500">
                  Product:
                </span>
                <span className="font-bold text-lime-600">STARTER</span>
                <span className="font-medium dark:text-gray-400 text-gray-500">
                  Price (EUR):
                </span>
                <span>20.00</span>
                <span className="font-medium dark:text-gray-400 text-gray-500">
                  Purchase type:
                </span>
                <span>One-off</span>
              </div>
              <div className="flex flex-row gap-4 items-center justify-center mt-4">
                <Link
                  href="https://sandbox-api.polar.sh/v1/checkout-links/polar_cl_L6wreTRQmMcJQeLVILkTtzuDkb0DOe41PZffJ3jNxv8/redirect"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button>Purchase</Button>
                </Link>
              </div>
            </div>
            <div className="border-2 border-gray-200 dark:border-gray-700 rounded-md p-4">
              <div className="grid grid-cols-2 grid-rows-3 gap-x-6 gap-y-2">
                <span className="font-medium dark:text-gray-400 text-gray-500">
                  Product:
                </span>
                <span className="font-bold text-blue-500">PRO</span>
                <span className="font-medium dark:text-gray-400 text-gray-500">
                  Price (EUR):
                </span>
                <span>100.00</span>
                <span className="font-medium dark:text-gray-400 text-gray-500">
                  Purchase type:
                </span>
                <span>One-off</span>
              </div>
              <div className="flex flex-row gap-4 items-center justify-center mt-4">
                <Link
                  href="https://sandbox-api.polar.sh/v1/checkout-links/polar_cl_L6wreTRQmMcJQeLVILkTtzuDkb0DOe41PZffJ3jNxv8/redirect"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button>Purchase</Button>
                </Link>
              </div>
            </div>
            <div className="border-2 border-gray-200 dark:border-gray-700 rounded-md p-4">
              <div className="grid grid-cols-2 grid-rows-3 gap-x-6 gap-y-2">
                <span className="font-medium dark:text-gray-400 text-gray-500">
                  Product:
                </span>
                <span className="font-bold text-orange-600">ULTIMATE</span>
                <span className="font-medium dark:text-gray-400 text-gray-500">
                  Price (EUR):
                </span>
                <span>500.00</span>
                <span className="font-medium dark:text-gray-400 text-gray-500">
                  Purchase type:
                </span>
                <span>One-off</span>
              </div>
              <div className="flex flex-row gap-4 items-center justify-center mt-4">
                <Link
                  href="https://sandbox-api.polar.sh/v1/checkout-links/polar_cl_L6wreTRQmMcJQeLVILkTtzuDkb0DOe41PZffJ3jNxv8/redirect"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button>Purchase</Button>
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full max-w-5xl mt-6">
        <CardHeader className="flex flex-row items-center gap-6 justify-start">
          <CardTitle className="text-xl font-medium">Account orders</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {userOrders.length > 0 && <TableUserOrders orders={userOrders} />}
        </CardContent>
      </Card>
    </div>
  )
}
