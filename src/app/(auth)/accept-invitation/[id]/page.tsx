"use client"

import { use, useState, useTransition } from "react"
import { authClient } from "@/lib/auth-client"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { LoadingButton } from "@/components/blocks/loading-button"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { CheckCircle, XCircle } from "lucide-react"

export default function AcceptInvitationPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const { data: session } = authClient.useSession()

  const handleAccept = () => {
    startTransition(async () => {
      const { error } = await authClient.organization.acceptInvitation({
        invitationId: id,
      })

      if (error) {
        setStatus("error")
        setErrorMessage(error.message || "Failed to accept invitation")
        toast.error(error.message || "Failed to accept invitation")
        return
      }

      setStatus("success")
      toast.success("Invitation accepted!")
      setTimeout(() => router.push("/dashboard"), 2000)
    })
  }

  if (!session) {
    return (
      <main className="flex min-h-svh items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-xl text-center">
              Organization Invitation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-gray-500">
              You need to sign in to accept this invitation.
            </p>
            <LoadingButton
              loading={false}
              onClick={() => router.push(`/sign-in?callbackURL=/accept-invitation/${id}`)}
              className="w-full"
            >
              Sign In
            </LoadingButton>
            <p className="text-sm text-gray-400">
              Don&apos;t have an account?{" "}
              <a
                href={`/sign-up?callbackURL=/accept-invitation/${id}`}
                className="text-primary underline"
              >
                Sign up
              </a>
            </p>
          </CardContent>
        </Card>
      </main>
    )
  }

  if (status === "success") {
    return (
      <main className="flex min-h-svh items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center gap-4 pt-6">
            <CheckCircle className="h-16 w-16 text-green-500" />
            <p className="text-lg font-medium">Invitation accepted!</p>
            <p className="text-gray-500">Redirecting to dashboard...</p>
          </CardContent>
        </Card>
      </main>
    )
  }

  if (status === "error") {
    return (
      <main className="flex min-h-svh items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center gap-4 pt-6">
            <XCircle className="h-16 w-16 text-red-500" />
            <p className="text-lg font-medium">Failed to accept invitation</p>
            <p className="text-gray-500">{errorMessage}</p>
            <LoadingButton
              loading={false}
              onClick={() => router.push("/dashboard")}
              className="w-full"
            >
              Go to Dashboard
            </LoadingButton>
          </CardContent>
        </Card>
      </main>
    )
  }

  return (
    <main className="flex min-h-svh items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl text-center">
            Organization Invitation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-gray-500">
            You&apos;ve been invited to join an organization.
          </p>
          <LoadingButton
            loading={isPending}
            onClick={handleAccept}
            className="w-full"
          >
            Accept Invitation
          </LoadingButton>
        </CardContent>
      </Card>
    </main>
  )
}
