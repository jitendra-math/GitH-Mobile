import Navbar from "@/components/Navbar";
import EditModal from "@/components/EditModal";

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