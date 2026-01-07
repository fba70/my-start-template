import Link from "next/dist/client/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col gap-8 items-center justify-center h-screen px-5 text-center">
      <div className="flex flex-row gap-10 items-center justify-center mb-12">
        <Image
          src="/Avica_logo.png"
          alt="Logo"
          width={90}
          height={90}
          className="mt-2"
        />
        <h1 className="text-8xl font-bold bg-linear-to-r from-orange-500 via-pink-500 to-blue-400 bg-clip-text text-transparent">
          AVICA.AI
        </h1>
      </div>

      <h2 className="text-4xl font-bold">DIGITAL CONTENT AT SCALE</h2>

      <p className="text-lg text-gray-500">
        Create your digital content using flexibility of AVICA Storytelling
        Templates and power of AI
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
