"use client";

import { useState } from "react";

import Link from "next/link";

import { BadgeCheck, Bell, Check, CreditCard, LogOut } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn, getInitials } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from 'next/navigation'
import { toast } from "sonner";
import { useAuth } from '@/contexts/auth-context'

import { Skeleton } from "@/components/ui/skeleton";

export function NavAccount({
  // users,
}: {
    // readonly users: ReadonlyArray<{
    //   readonly id: string;
    //   readonly name: string;
    //   readonly email: string;
    //   readonly avatar: string;
    //   readonly role: string;
    // }>;
  }) {

  const { user, logout, loading, } = useAuth()
  const router = useRouter()
  // const [isLoggingOut, setIsLoggingOut] = useState(false)

  const avatarPlaceholderSrc = 'https://avatars.githubusercontent.com/u/43849669';

  // const [activeUser, setActiveUser] = useState(users[0]);
  // if (!activeUser) {
  //   return null;
  // }

  const activeUser = user as any

  if (loading) {
    return (
      <Skeleton className="rounded-full w-8 h-8" />
    )
  }

  if (!activeUser) {
    return (
      <div className="flex items-center space-x-2">
        <Button nativeButton={false} variant="default" size="icon" render={
          <Link href="/auth/v2/login">
            <User />
          </Link>
        }></Button>
      </div>
    )
  };

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

  activeUser.name = ([activeUser?.firstName, activeUser?.lastName,]).join(' ');
  activeUser.avatar = avatarPlaceholderSrc;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger nativeButton={false} render={<Avatar className="size-9 rounded-lg" />}>
        <AvatarImage src={activeUser.avatar || undefined} alt={activeUser.name} />
        <AvatarFallback>{getInitials(activeUser.name)}</AvatarFallback>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-56 space-y-1 rounded-lg" side="bottom" align="end" sideOffset={4}>
        {/* {users.map((user) => (
          <DropdownMenuItem
            key={user.email}
            className={cn("p-0", user.id === activeUser.id && "bg-accent/50")}
            aria-current={user.id === activeUser.id ? "true" : undefined}
            onClick={() => setActiveUser(user)}
          >
            <div className="flex w-full items-center gap-2 px-1 py-1.5">
              <Avatar className="size-9 rounded-lg">
                <AvatarImage src={user.avatar || undefined} alt={user.name} />
                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
              </Avatar>
              <div className="grid min-w-0 flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs capitalize">{user.role}</span>
              </div>
              <span
                className={cn(
                  "mr-1 flex size-5 items-center justify-center rounded-full text-primary opacity-0",
                  user.id === activeUser.id && "opacity-100",
                )}
              >
                <Check aria-hidden="true" />
              </span>
            </div>
          </DropdownMenuItem>
        ))} */}

        <div className="flex w-full items-center gap-2 px-1 py-1.5">
          <Avatar className="size-9 rounded-lg">
            <AvatarImage src={activeUser.avatar || undefined} alt={activeUser.name} />
            <AvatarFallback>{getInitials(activeUser.name)}</AvatarFallback>
          </Avatar>
          <div className="grid min-w-0 flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{activeUser.name}</span>
            <span className="truncate text-xs capitalize">{activeUser.roles.join(', ')}</span>
          </div>
        </div>

        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <BadgeCheck />
            Account
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCard />
            Billing
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Bell />
            Notifications
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive"
          onClick={handleLogout}>
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
