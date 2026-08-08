'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Menu, Home, Package, Grid3X3, Info, Search } from 'lucide-react'

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { href: '/', label: 'Trang chủ', icon: Home },
    { href: '/products', label: 'Sản phẩm', icon: Package },
    { href: '/categories', label: 'Danh mục', icon: Grid3X3 },
    { href: '/about', label: 'Giới thiệu', icon: Info },
  ]

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Menu</span>
          </Button>
        }
      />
      <SheetContent side="left" className="w-80">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">S</span>
            </div>
            ShopNex
          </SheetTitle>
        </SheetHeader>

        <div className="mt-8 space-y-4 px-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Tìm sản phẩm..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Quick Actions */}
          <div className="pt-4 border-t space-y-2">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Lối tắt
            </h3>
            <Button variant="outline" className="w-full justify-start bg-transparent" nativeButton={false} render={
              <Link href="/cart" onClick={() => setIsOpen(false)}>
                Giỏ hàng
              </Link>
            } />
            <Link href="/checkout" onClick={() => setIsOpen(false)}>
              <Button className="w-full justify-start">Mua hàng</Button>
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
