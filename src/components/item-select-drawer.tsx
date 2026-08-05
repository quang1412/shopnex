"use client"

import * as React from "react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

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
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Item,
  ItemActions,
  ItemMedia,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item"

interface ItemData {
  id: string
  titleLeft: string | React.ReactNode
  titleRight?: string | React.ReactNode
  description?: string,
}

interface ItemSelectDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  name?: string
  items: ItemData[]
  selectedItemId?: string
  onValueChange: (id?: string) => void
  className?: string
  classNameDrawer?: string
}

export function ItemSelectDrawer({
  title,
  description,
  name,
  items = [],
  selectedItemId = '',
  onValueChange,
  className,
  classNameDrawer,
  open,
  onOpenChange,
}: ItemSelectDrawerProps) {
  const [selectedId, setSelectedId] = React.useState<string>(selectedItemId)
  const isMobile = useIsMobile();

  function handleConfirm() {
    onValueChange?.(selectedId);
    onOpenChange(false);
  }

  React.useEffect(() => {
    const t = setTimeout(() => {
      !open && setSelectedId(selectedItemId);
    }, 500);
    return () => {
      clearTimeout(t);
    }
  }, [open])

  const currentItem = items.find(i => i.id === selectedItemId)

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      showSwipeHandle={isMobile}
      swipeDirection={isMobile ? "down" : "right"}
    >
      <DrawerTrigger nativeButton={false} render={

        <Item
          variant="outline"
          className={cn(
            "hover:border-primary/50 active:border-primary cursor-pointer",
            className && className
          )}
        >
          {/* <ItemMedia variant="icon">
            <InboxIcon />
          </ItemMedia> */}
          <ItemContent>
            <ItemTitle className="w-full flex items-center justify-between">
              <span>{currentItem?.titleLeft}</span>
              {currentItem?.titleRight && <span>{currentItem?.titleRight}</span>}
            </ItemTitle>
            {currentItem?.description && <ItemDescription className="text-xs">
              {currentItem?.description}
            </ItemDescription>}
          </ItemContent>
        </Item>
      } />
      <DrawerContent className={cn("", classNameDrawer && classNameDrawer)}>
        <DrawerHeader>
          <DrawerTitle className={cn(!title && 'sr-only')}>
            {title}
          </DrawerTitle>
          <DrawerDescription className={cn(!description && 'sr-only')}>
            {description}
          </DrawerDescription>
        </DrawerHeader>
        <div className={
          " flex-1 overflow-y-auto p-4"
          // + " scroll-fade"
        }>
          <RadioGroup
            value={selectedId}
            onValueChange={setSelectedId}
            className="gap-2"
          >
            {items.map((item) => (
              <FieldLabel
                key={`${name}-${item.id}`}
                htmlFor={`${name}-drawer-${item.id}`}
                className='hover:border-muted-foreground'
              >
                <Field orientation="horizontal" className='flex flex-row-reverse'>
                  <FieldContent>
                    <FieldTitle className='w-full flex items-center justify-between'>
                      <span>{item.titleLeft}</span>
                      <span>{item.titleRight}</span>
                    </FieldTitle>
                    {item.description && <FieldDescription className='text-xs'>
                      {item.description}
                    </FieldDescription>}
                  </FieldContent>
                  <RadioGroupItem value={item.id} id={`${name}-drawer-${item.id}`} />
                </Field>
              </FieldLabel>
            ))}
          </RadioGroup>
        </div>
        <DrawerFooter>
          <Button onClick={handleConfirm} className="w-full">
            Xác nhận
          </Button>
          <DrawerClose render={<Button variant="outline"> Huỷ</Button>} />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
