import Navbar from "@/components/Navbar";
import EditModal from "@/components/EditModal";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 relative">
      <Navbar />
      <main className="max-w-screen-md mx-auto p-3 md:p-4 pb-20">
        {children}
      </main>
      
      {/* Global Edit Modal */}
      <EditModal />
    </div>
  );
}
