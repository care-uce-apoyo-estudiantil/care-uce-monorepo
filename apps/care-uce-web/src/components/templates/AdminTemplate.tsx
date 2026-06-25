import { Sidebar } from '../organisms/Sidebar';

export const AdminTemplate = ({ children }: { children: React.ReactNode }) => (
  <div className="flex min-h-screen bg-gray-100">
    <Sidebar />
    <main className="flex-1 p-8">
      <h1 className="text-2xl font-bold mb-6 text-[#003366]">
        Panel de Control
      </h1>
      {children}
    </main>
  </div>
);
