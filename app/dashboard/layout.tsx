import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import EditModal from "@/components/EditModal";

// Dashboard should NOT be indexed by search engines — it's an authenticated view
export const metadata: Metadata = {
  title: "Dashboard",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F2F2F7] relative">
      <Navbar />
      <main className="max-w-screen-md mx-auto px-4 pt-3 pb-6 pb-safe">
        {children}
      </main>

      {/* Global Edit Modal */}
      <EditModal />
    </div>
  );
}