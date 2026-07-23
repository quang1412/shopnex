"use client";

import { useState } from "react";

import { toast } from "sonner";

import { CircleUser, CreditCard, EllipsisVertical, LogOut, MessageSquareDot } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { getInitials } from "@/lib/utils";

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'

// import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton";

export function NavUser({
  // user,
}: {
    // readonly user: {
    //   readonly name: string;
    //   readonly email: string;
    //   readonly avatar: string;
    // };
  }) {
  const { isMobile } = useSidebar();

  const { user, logout, loading } = useAuth()
  const router = useRouter()
  // const [isLoggingOut, setIsLoggingOut] = useState(false)

  // const avatarPlaceholder = 'https://avatars.githubusercontent.com/u/43849669';

  const activeUser = user as any;

  if (loading) {
    return <Button nativeButton={false} className="w-full" size="lg" variant="ghost" render={
      <Skeleton className="w-full h-full" />
    } />
  }

  if (!activeUser) {
    return (
      <div className="flex items-center space-x-2">
        <Button nativeButton={false} variant="default" size="lg" className="w-full" render={
          <Link href="/auth/v2/login">
            <User /> Đăng nhập
          </Link>
        }></Button>
        {/* <Link href="/account/login">
              <Button variant="ghost" size="sm" render={<User className="h-4 w-4" />}></Button>
            </Link> */}

      </div>
    )
  }

  const handleLogout = async () => {
    try {
      // setIsLoggingOut(true);
      await logout();
      router.push('/auth/v2/login');
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      // setIsLoggingOut(false)
    }
  }

  activeUser.avatar = 'https://avatars.githubusercontent.com/u/43849669';

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="data-popup-open:bg-sidebar-accent data-popup-open:text-sidebar-accent-foreground"
              />
            }
          >
            <Avatar className="h-8 w-8 rounded-lg grayscale">
              <AvatarImage src={activeUser.avatar || undefined} alt={activeUser.email} />
              <AvatarFallback className="rounded-lg">{getInitials([activeUser.firstName, activeUser.lastName].join(' '))}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{activeUser.firstName}</span>
              <span className="truncate text-muted-foreground text-xs">{activeUser.email}</span>
            </div>
            <EllipsisVertical className="ml-auto size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--anchor-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <div className="flex items-center gap-2 px-2 py-1.5 text-left text-sm">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={activeUser.avatar || undefined} alt={activeUser.firstName} />
                <AvatarFallback className="rounded-lg">{getInitials([activeUser.firstName, activeUser.lastName].join(' '))}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{activeUser.firstName}</span>
                <span className="truncate text-muted-foreground text-xs">{activeUser.email}</span>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <CircleUser />
                Tài khoản
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard />
                Hoá đơn
              </DropdownMenuItem>
              <DropdownMenuItem>
                <MessageSquareDot />
                Thông báo
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={handleLogout}
            >
              <LogOut />
              Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
