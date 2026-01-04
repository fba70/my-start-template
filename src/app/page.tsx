import Link from "next/dist/client/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col gap-8 items-center justify-center h-screen px-5 text-center">
      <h1 className="text-8xl font-bold bg-linear-to-r from-blue-400 via-pink-500 to-orange-400 bg-clip-text text-transparent mb-12">
        MY PROJECT
      </h1>

      <h2 className="text-4xl font-bold">START TEMPLATE</h2>

      <p className="text-lg text-gray-500">
        Template for a project with sidebar menu and user authentication logic
      </p>

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
