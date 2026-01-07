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
import { TableUserUsage } from "@/components/tables/table-user-usage"
import { TableUserApiKeys } from "@/components/tables/table-user-api-keys"
import UpdateOrganizationDialog from "@/components/forms/form-edit-organization"
import Loading from "@/app/loading"
import { InferSelectModel } from "drizzle-orm"
import { schema } from "@/db/schema"

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

type Organization = InferSelectModel<typeof schema.organization>

export default function AccountPage() {
  const { data: session, refetch } = authClient.useSession()
  const user = session?.user as User | undefined

  const [userState, setUserState] = useState<PolarCustomerState>()
  const [userOrders, setUserOrders] = useState<SimplifiedOrders[]>([])
  const [ordersLoading, setOrdersLoading] = useState<boolean>(false)
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [orgKey, setOrgKey] = useState(0)

  //console.log("User session in settings page:", session)

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
    async function fetchOrganization() {
      if (!user?.id) return
      try {
        const res = await fetch(
          `/api/organization?userId=${encodeURIComponent(user.id)}`
        )
        const data = await res.json()
        setOrganization(data.organization)
        //console.log("User organization:", data.organization)
      } catch (e) {
        console.error("Failed to fetch organization:", e)
      }
    }

    fetchOrganization()
  }, [user?.id, orgKey])

  useEffect(() => {
    async function fetchUserOrders() {
      if (!userState?.id) return

      setOrdersLoading(true)

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
      setOrdersLoading(false)
    }

    fetchUserOrders()
  }, [user?.id, userState?.id])

  return (
    <div className="flex flex-col gap-6 items-center justify-start h-screen">
      <h1 className="text-2xl font-medium mt-2">ACCOUNT</h1>

      <div className="flex flex-row gap-12 items-center justify-center">
        {user && (
          <Card className="w-full max-w-xl">
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

        {organization && (
          <Card className="w-full max-w-xl">
            <CardHeader className="flex flex-row items-center gap-6 justify-start">
              <Avatar>
                <AvatarImage
                  src={organization.logo ?? undefined}
                  alt={organization.name ?? "Organization"}
                />
                <AvatarFallback>
                  {organization.name
                    ? organization.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                    : "U"}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-xl font-medium">
                {organization.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 grid-rows-3 gap-2">
                <span className="font-medium dark:text-gray-400 text-gray-500">
                  Organization Name:
                </span>
                <span>{organization.name}</span>
                <span className="font-medium dark:text-gray-400 text-gray-500">
                  Organization Slug:
                </span>
                <span className="truncate">{organization.slug}</span>
                <span className="font-medium dark:text-gray-400 text-gray-500">
                  Tax ID:
                </span>
                <span>
                  {(() => {
                    try {
                      const parsed =
                        typeof organization.metadata === "string"
                          ? JSON.parse(organization.metadata)
                          : organization.metadata
                      return parsed?.taxId || "N/A"
                    } catch {
                      return "N/A"
                    }
                  })()}
                </span>
              </div>

              <div className="flex flex-row gap-4 items-center justify-center">
                <UpdateOrganizationDialog
                  organization={organization}
                  onSuccess={() => setOrgKey((prev) => prev + 1)}
                />
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Card className="w-full max-w-5xl">
        <CardHeader className="flex flex-row items-center gap-6 justify-start">
          <CardTitle className="text-xl font-medium">Balance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex flex-row gap-4 items-center justify-start">
            <span className="font-medium dark:text-gray-400 text-gray-500">
              Current balance (EUR):
            </span>
            <span className="text-xl font-medium">12.30</span>
            <span className="font-medium dark:text-gray-400 text-gray-500 ml-8">
              Current balance (Coins):
            </span>
            <span className="text-xl font-medium">1,230</span>
          </div>
          <Separator />
          <div>Purchase credits</div>
          <div className="flex flex-row gap-8 items-center justify-center">
            <div className="border-2 border-gray-200 dark:border-gray-700 rounded-md p-4">
              <div className="grid grid-cols-2 grid-rows-4 gap-x-6 gap-y-2">
                <span className="font-medium dark:text-gray-400 text-gray-500">
                  Product:
                </span>
                <span className="font-bold text-lime-600">STARTER</span>
                <span className="font-medium dark:text-gray-400 text-gray-500">
                  Price (EUR):
                </span>
                <span>20.00</span>
                <span className="font-medium dark:text-gray-400 text-gray-500">
                  Coins:
                </span>
                <span>2,000</span>
                <span className="font-medium dark:text-gray-400 text-gray-500">
                  Purchase type:
                </span>
                <span>One-off</span>
              </div>
              <div className="flex flex-row gap-4 items-center justify-center mt-6">
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
              <div className="grid grid-cols-2 grid-rows-4 gap-x-6 gap-y-2">
                <span className="font-medium dark:text-gray-400 text-gray-500">
                  Product:
                </span>
                <span className="font-bold text-blue-500">PRO</span>
                <span className="font-medium dark:text-gray-400 text-gray-500">
                  Price (EUR):
                </span>
                <span>100.00</span>
                <span className="font-medium dark:text-gray-400 text-gray-500">
                  Coins:
                </span>
                <span>10,000</span>
                <span className="font-medium dark:text-gray-400 text-gray-500">
                  Purchase type:
                </span>
                <span>One-off</span>
              </div>
              <div className="flex flex-row gap-4 items-center justify-center mt-6">
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
              <div className="grid grid-cols-2 grid-rows-4 gap-x-6 gap-y-2">
                <span className="font-medium dark:text-gray-400 text-gray-500">
                  Product:
                </span>
                <span className="font-bold text-orange-600">ULTIMATE</span>
                <span className="font-medium dark:text-gray-400 text-gray-500">
                  Price (EUR):
                </span>
                <span>500.00</span>
                <span className="font-medium dark:text-gray-400 text-gray-500">
                  Coins:
                </span>
                <span>50,000</span>
                <span className="font-medium dark:text-gray-400 text-gray-500">
                  Purchase type:
                </span>
                <span>One-off</span>
              </div>
              <div className="flex flex-row gap-4 items-center justify-center mt-6">
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

      <Card className="w-full max-w-5xl">
        <CardHeader className="flex flex-row items-center gap-6 justify-start">
          <CardTitle className="text-xl font-medium">Purchases</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {ordersLoading ? (
            <Loading />
          ) : (
            userOrders.length > 0 && <TableUserOrders orders={userOrders} />
          )}
        </CardContent>
      </Card>

      <Card className="w-full max-w-5xl">
        <CardHeader className="flex flex-row items-center gap-6 justify-start">
          <CardTitle className="text-xl font-medium">Usage</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <TableUserUsage />
        </CardContent>
      </Card>

      <Card className="w-full max-w-5xl">
        <CardHeader className="flex flex-row items-center gap-6 justify-start">
          <CardTitle className="text-xl font-medium">API keys</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <TableUserApiKeys />
        </CardContent>
      </Card>
    </div>
  )
}
