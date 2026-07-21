"use client";


import { useRouter } from "next/navigation";

import { useAuth } from "@/contexts/auth-context";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { Input } from "@/components/ui/input";

const formSchema = z
  .object({
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    email: z.email({ message: "Please enter a valid email address." }),
    password: z.string().min(6, { message: "Password must be at least 6 characters." }),
    confirmPassword: z.string().min(6, { message: "Confirm Password must be at least 6 characters." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof formSchema>

// const onSubmit = (data: z.infer<typeof formSchema>) => {
//   toast("You submitted the following values", {
//     description: (
//       <pre className="mt-2 w-[320px] rounded-md bg-neutral-950 p-4">
//         <code className="text-white">{JSON.stringify(data, null, 2)}</code>
//       </pre>
//     ),
//   });
// };

export function RegisterForm() {
  const router = useRouter();

  const { register, user } = useAuth();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  if (user) {
    router.push("/account");
    return null;
  }

  const _onSubmit = async (values: FormData) => {
    try {
      const { error } = await register(
        values.email,
        values.password,
        values.firstName,
        values.lastName,
      );
      if (error) throw new Error(error)
      router.push("/");
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(_onSubmit)} className="flex flex-col gap-4">
        <fieldset className="space-y-4" disabled={form.formState.isSubmitting}>
          <div className="flex flex-col sm:flex-row gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="gap-1.5"  >
                  <FormLabel >first-name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="first-name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem className="gap-1.5"  >
                  <FormLabel >last-name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="last-name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="gap-1.5"  >
                <FormLabel >Email Address</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="gap-1.5"  >
                <FormLabel htmlFor="register-password">Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    id="register-password"
                    type="password"
                    placeholder="••••••••"
                    autoComplete="new-password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="gap-1.5"  >
                <FormLabel htmlFor="register-confirm-password">Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    id="register-confirm-password"
                    type="password"
                    placeholder="••••••••"
                    autoComplete="new-password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </fieldset>
        <Button className="w-full" type="submit">
          {form.formState.isSubmitting
            ? <span className="flex justify-center items-center gap-2" ><Spinner /> Đang đăng nhập...</span>
            : <span>Đăng nhập</span>
          }
        </Button>
      </form>
    </Form>
  );
}
