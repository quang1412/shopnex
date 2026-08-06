"use client"

import * as React from "react"
import { toast } from "sonner"

import { useIsMobile } from "@/hooks/use-mobile"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
import { Ruler } from "lucide-react"


interface SizeGuideDrawerProps {
  label?: string | React.ReactNode
  content: string | React.ReactNode
}

export function SizeGuideDrawer({
  label,
  content,
}: SizeGuideDrawerProps) {
  const [open, setOpen] = React.useState(false)
  const isMobile = useIsMobile()

  function handleConfirm() {

  }

  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}
      showSwipeHandle={isMobile}
      swipeDirection={isMobile ? "down" : "right"}
    >
      <DrawerTrigger render={
        <Button variant="link" size="sm">
          {label}
        </Button>
      } />
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Bảng size</DrawerTitle>
          <DrawerDescription>
            Hướng dẫn chọn size
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex-1 scroll-fade overflow-y-auto p-4">
          {content}
        </div>
        <DrawerFooter>
          {/* <Button onClick={handleConfirm} className="h-[34px]">
            Confirm Delivery Time
          </Button> */}
          <DrawerClose render={<Button variant="outline">Đóng</Button>} />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
