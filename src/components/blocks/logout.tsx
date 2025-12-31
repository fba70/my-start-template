"use client"

import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"

export function Logout() {
  const router = useRouter()

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/sign-in")
        },
      },
    })
  }

  return (
    <Button variant="ghost" onClick={handleLogout}>
      <LogOut size={24} className="mr-2" />{" "}
      <span className="text-lg">Log Out</span>
    </Button>
  )
}
