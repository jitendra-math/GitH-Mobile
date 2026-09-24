import LoginModal from "@/components/LoginModal";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function LoginPage() {
  const cookieStore = cookies();
  const token = cookieStore.get("github_pat");

  if (token) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-[#F2F2F7] flex items-center justify-center px-6">
      <LoginModal />
    </main>
  );
}