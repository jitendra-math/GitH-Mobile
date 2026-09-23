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
    <main className="min-h-screen bg-[#F2F2F7] flex items-start justify-center pt-[18vh] px-6">
      {/* Logo — background me subtle */}
      <img
        src="/logo.png"
        alt="GitHub Manager"
        className="w-16 h-16 rounded-[15px] object-cover shadow-[0_4px_16px_rgba(0,0,0,0.08)]"
      />

      {/* Login Modal */}
      <LoginModal />
    </main>
  );
}