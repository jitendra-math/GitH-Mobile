import LandingPage from "@/components/landing/LandingPage";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function Home() {
  const cookieStore = cookies();
  const token = cookieStore.get("github_pat");

  if (token) {
    redirect("/dashboard");
  }

  return <LandingPage />;
}