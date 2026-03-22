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
      <div className='flex'>
        <Sidebar />
        <main className='ml-56 flex-1 min-h-[calc(100vh-64px)]'>
          <div className='p-6'>{children}</div>
        </main>
      </div>
    </div>
  );
}
