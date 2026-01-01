"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"

type User = {
  id: string
  createdAt: Date
  updatedAt: Date
  email: string
  emailVerified: boolean
  name: string
  image?: string | null | undefined
}

type UpdateUserFormData = {
  name: string
  image: string
}

export default function UpdateUserDialog({
  user,
  onSuccess,
}: {
  user: User
  onSuccess?: () => void
}) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const form = useForm<UpdateUserFormData>({
    defaultValues: {
      name: user.name || "",
      image: user.image || "",
    },
  })
  const {
    setValue,
    formState: { errors },
  } = form
  const [imagePreview, setImagePreview] = useState(user.image || "")

  const onSubmit = (data: UpdateUserFormData) => {
    startTransition(async () => {
      await authClient.updateUser({
        name: data.name,
        image: data.image,
      })
      setOpen(false)
      if (onSuccess) onSuccess()
      // Optionally refresh page or session here
    })
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!["image/png", "image/jpeg"].includes(file.type)) {
      alert("Only PNG or JPEG allowed")
      return
    }
    if (file.size > 300 * 1024) {
      alert("File must be less than 300kb")
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const base64 = reader.result as string
      setValue("image", base64)
      setImagePreview(base64)
    }
    reader.readAsDataURL(file)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="mt-4">
          Edit User Profile
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="mb-2">
          <DialogTitle>Edit User Profile</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-400">Name</FormLabel>
                  <FormControl>
                    <Input id="name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              render={() => (
                <FormItem>
                  <FormLabel className="text-gray-400">Profile Image</FormLabel>
                  <FormControl>
                    <Input
                      id="image"
                      type="file"
                      accept="image/png, image/jpeg"
                      onChange={handleImageChange}
                    />
                  </FormControl>
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="mt-2 w-16 h-16 rounded-full object-cover"
                    />
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
