// app/page.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const cookieStore = await cookies(); // await here ✅
  const token = cookieStore.get("token")?.value; // now .get exists

  redirect(token ? "/dashboard" : "/auth/login");
}
