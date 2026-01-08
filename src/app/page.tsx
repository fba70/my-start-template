import Link from "next/dist/client/link"
import { Button } from "@/components/ui/button"
import ElectricCard from "@/components/blocks/electric-card"

export default function Home() {
  return (
    <div className="flex flex-col gap-8 items-center justify-center h-screen px-5 text-center">
      <ElectricCard />

      <div className="flex gap-6 justify-center mt-8">
        <Link href="/sign-in">
          <Button className="w-25">Sign In</Button>
        </Link>
        <Link href="/sign-up">
          <Button className="w-25" variant="outline">
            Sign Up
          </Button>
        </Link>
      </div>
    </div>
  )
}
