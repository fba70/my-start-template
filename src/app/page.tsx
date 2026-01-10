import Link from "next/dist/client/link"
import { Button } from "@/components/ui/button"
import ElectricBorder from "@/components/ui/electric-border/ElectricBorder"
import Image from "next/image"

export default function Home() {
  return (
    <div className="flex flex-col gap-8 items-center justify-center h-screen px-5 text-center">
      <ElectricBorder
        color="#7df9ff"
        speed={0.75}
        chaos={0.1}
        borderRadius={16}
        style={{ borderRadius: 16 }}
        className=""
      >
        <div className="h-auto w-[380px] flex flex-col items-center justify-center p-4">
          <div className="flex flex-col p-12 pb-4 h-full items-center justify-center">
            <Image src="/Avica_logo.png" alt="Logo" width={260} height={260} />
            <p className="text-6xl font-bold mt-auto bg-linear-to-r from-orange-500 via-pink-500 to-blue-400 bg-clip-text text-transparent">
              AVICA.AI
            </p>
          </div>

          <div className="flex flex-col p-12 pt-4 items-center justify-center">
            <p className="text-gray-300 text-lg">
              Your digital content at scale
            </p>
          </div>
        </div>
      </ElectricBorder>

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
