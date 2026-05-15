import { Sidebar } from "@/components/erp/Sidebar";
import { TopBar } from "@/components/erp/TopBar";

export const metadata = {
  title: "ERP | Burgos & Asociados",
};

export default function ErpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-burgos-black flex">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-0 lg:ml-64">
        <TopBar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
