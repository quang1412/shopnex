'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getInitials } from '@/lib/utils'
import {
  AvatarImage,
  AvatarFallback,
  Avatar,
} from '../ui/avatar'
import { Button } from '@/components/ui/button'
import { User, LogOut, Settings, Package, UserPlus } from 'lucide-react'

export function AccountMenu() {
  const [isMounted, setIsMounted] = useState<boolean>(false)
  const { user, logout, loading } = useAuth()
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await logout()
    router.push('/')
    setIsLoggingOut(false)
  }

  const avatarPlaceholder = 'https://avatars.githubusercontent.com/u/43849669';

  useEffect(() => {
    setIsMounted(true);
  }, [])

  if (!isMounted || loading) {
    return <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
  }

  if (!user) {
    return (
      <div className="flex items-center space-x-2">
        <Button nativeButton={false} variant="ghost" size="icon" render={
          <Link href="/auth/v2/login">
            <User className="h-5 w-5" />
          </Link>
        } />
      </div>
    )
  }

  const user_ = {
    avatar: avatarPlaceholder,
    email: user.email,
    name: [user.firstName, user.lastName].filter(Boolean).join(' ')
  }

  return (
    <DropdownMenu>

      {/* <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="sm" className="relative">
            <User className="h-4 w-4" />
            <span className="ml-2 hidden sm:inline">
              {user_.name || user_.email.split('@')[0]}
            </span>
          </Button>
        }
      /> */}

      <DropdownMenuTrigger nativeButton={false} render={<Avatar className="size-8 rounded-lg" />}>
        <AvatarImage src={user_.avatar || undefined} alt={user_.name} />
        <AvatarFallback>{getInitials(user_.name)}</AvatarFallback>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2   text-sm font-medium">
          {user_.name ? `${user_.name || ''}` : user_.email}
        </div>
        <div className="px-2   text-xs text-gray-500">{user_.email}</div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          render={
            <Link href="/account" className="flex items-center">
              <Settings className="mr-2 h-4 w-4" />
              Cài đặt tài khoản
            </Link>
          }
        />
        <DropdownMenuItem
          render={
            <Link href="/account#orders" className="flex items-center">
              <Package className="mr-2 h-4 w-4" />
              Lịch sử đơn hàng
            </Link>
          }
        />
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex items-center text-red-600"
        >
          <LogOut className="mr-2 h-4 w-4" />
          {isLoggingOut ? 'Đang đăng xuất...' : 'Đăng xuất'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
