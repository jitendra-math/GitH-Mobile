import TokenForm from "@/components/TokenForm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function LoginPage() {
  const cookieStore = cookies();
  const token = cookieStore.get("github_pat");

  if (token) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-[#F2F2F7] flex flex-col items-center justify-center px-6 pt-safe pb-safe">
      <div className="w-full max-w-[340px] flex flex-col items-center">
        {/* Logo */}
        <img
          src="/logo.png"
          alt="GitHub Manager"
          className="w-20 h-20 rounded-[18px] object-cover shadow-[0_4px_16px_rgba(0,0,0,0.08)]"
        />

        {/* Title */}
        <h1 className="text-[28px] font-bold text-black tracking-tight text-center mt-6">
          GitHub Manager
        </h1>
        <p className="text-[15px] text-[#8E8E93] text-center mt-1.5 leading-snug">
          Sign in with your personal access token
        </p>

        {/* Form */}
        <div className="w-full mt-8">
          <TokenForm />
        </div>
      </div>
    </main>
  );
}