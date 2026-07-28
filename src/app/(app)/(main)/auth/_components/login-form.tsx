"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
// import {
//   Field,
//   FieldContent,
//   FieldError,
//   FieldGroup,
//   FieldLabel,
//   FieldSet,
// } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";

import { Spinner } from "@/components/ui/spinner";

const formSchema = z.object({
  email: z.email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  remember: z.boolean().optional(),
});

type FormData = z.infer<typeof formSchema>;

// const onSubmit = (data: z.infer<typeof formSchema>) => {
//   toast("You submitted the following values", {
//     description: (
//       <pre className="mt-2 w-[320px] rounded-md bg-neutral-950 p-4">
//         <code className="text-white">{JSON.stringify(data, null, 2)}</code>
//       </pre>
//     ),
//   });
// };

export function LoginForm() {
  const router = useRouter();
  const { user, login } = useAuth();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    // mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  if (user) {
    router.replace('/')
  }

  const handleSubmit = async (data: FormData) => {
    try {
      const { error } = await login(data.email, data.password);
      if (error) throw new Error(error);
      router.push('/dashboard')
      // window.document.location.href = "/dashboard"
    } catch (e: any) {
      toast.error(e.message);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <fieldset disabled={Boolean(user || form.formState.isSubmitting)} className="flex flex-col gap-4">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <FormItem className="gap-1.5" data-invalid={fieldState.invalid}>
                  <FormLabel htmlFor="login-email">Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      // id="login-email"
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      aria-invalid={fieldState.invalid}
                    />
                  </FormControl>
                  <FormMessage />
                  {/* {fieldState.invalid && <FieldError errors={[fieldState.error]} />} */}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field, fieldState }) => (
                <FormItem className="gap-1.5" data-invalid={fieldState.invalid}>
                  <FormLabel htmlFor="login-password">Mật khẩu</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      // id="login-password"
                      type="password"
                      placeholder="••••••••"
                      autoComplete="current-password"
                      aria-invalid={fieldState.invalid}
                    />
                  </FormControl>
                  {/* {fieldState.invalid && <FieldError errors={[fieldState.error]} />} */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="remember"
              render={({ field, fieldState }) => (
                <FormItem className="flex flex-row-reverse justify-end gap-1">
                  <FormLabel>Ghi nhớ trong 30 ngày</FormLabel>
                  <FormControl>
                    <Checkbox
                      // id="login-remember"
                      name={field.name}
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(Boolean(checked))}
                      aria-invalid={fieldState.invalid}
                    />
                  </FormControl>
                  {/* FormMessage handles showing errors automatically */}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button className="w-full" type="submit">
            {form.formState.isSubmitting
              ? <span className="flex justify-center items-center gap-2" ><Spinner /> Đang đăng nhập...</span>
              : <span>Đăng nhập</span>
            }
          </Button>
        </fieldset>
      </form>
    </Form>
  );
}
