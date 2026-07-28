import Link from "next/link";

import { Globe } from "lucide-react";

import { APP_CONFIG } from "@/config/app-config";

import { LoginForm } from "../../_components/login-form";
import { GoogleButton } from "../../_components/social-auth/google-button";

export default function LoginV2() {
  return (
    <>
      <div className="mx-auto flex w-full min-w-80 flex-col justify-center space-y-8 sm:w-[350px]">
        <div className="space-y-2 text-center">
          <h1 className="font-medium text-3xl">Đăng nhập</h1>
          <p className="text-muted-foreground text-sm">Điền thông tin để đăng nhập.</p>
        </div>
        <div className="space-y-4">
          <GoogleButton className="w-full" />
          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-border after:border-t">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">Hoặc</span>
          </div>
          <LoginForm />
        </div>
      </div>

      <div className="absolute top-5 flex w-full min-w-80 justify-end px-10">
        <div className="text-muted-foreground text-sm text-nowrap">
          Bạn chưa có tài khoản?&nbsp;
          <Link prefetch={false} className="text-foreground" href="register">
            Tạo tài khoản
          </Link>
        </div>
      </div>

      <div className="absolute bottom-5 flex w-full min-w-80 justify-between px-10">
        <div className="text-sm">{APP_CONFIG.copyright}</div>
        <div className="flex items-center gap-1 text-sm">
          <Globe className="size-4 text-muted-foreground" />
          VI
        </div>
      </div>
    </>
  );
}
