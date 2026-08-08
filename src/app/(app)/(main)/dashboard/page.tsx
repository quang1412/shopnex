import { redirect } from "next/navigation";

export default function Page() {
  redirect('/dashboard/ecommerce')

  return "sample page";
}
