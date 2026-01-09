import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Bell } from "lucide-react"

export function NotificationsDrawer() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          className="flex flex-row gap-5 items-center justify-center"
        >
          <Bell /> <span className="text-lg">Notifications</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="mx-auto w-full max-w-4xl">
        <div className="">
          <DrawerHeader>
            <DrawerTitle>Notifications</DrawerTitle>
            <DrawerDescription></DrawerDescription>
          </DrawerHeader>
          <div className="flex-1 py-4 px-8 space-y-4 overflow-y-auto">
            {/* Notification items would go here */}
            <p>No new notifications.</p>
          </div>
          <DrawerFooter className="flex items-center justify-center">
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
