import ElectricBorder from "@/components/ui/electric-border/ElectricBorder"
import Image from "next/image"

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-2 items-center justify-start h-screen">
      <h1 className="text-2xl font-medium mt-2">DASHBOARD</h1>

      <div className="mt-12">
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
              <Image
                src="/Avica_logo.png"
                alt="Logo"
                width={260}
                height={260}
              />
              <p className="text-6xl font-bold mt-auto bg-linear-to-r from-orange-500 via-pink-500 to-blue-400 bg-clip-text text-transparent">
                AVICA.AI
              </p>
            </div>

            <div className="flex flex-col p-12 pt-4 items-center justify-center">
              <p className="text-gray-200 text-lg">
                Your digital content at scale
              </p>
            </div>
          </div>
        </ElectricBorder>
      </div>
    </div>
  )
}
