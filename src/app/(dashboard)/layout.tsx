import DashboardFooter from "@/components/shared/DashboardFooter";
import DashboardNavbar from "@/components/shared/DashboardNavbar";
import Sidebar from "@/components/shared/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='min-h-screen bg-gray-50'>
      <DashboardNavbar />
      <Sidebar />

      <div className='ml-56 min-h-[calc(100vh-64px)] flex flex-col'>
        <main className='flex-1'>
          <div className='p-6'>{children}</div>
        </main>

        <DashboardFooter />
      </div>
    </div>
  );
}
