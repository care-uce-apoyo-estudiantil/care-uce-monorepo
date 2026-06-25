import { Link } from 'react-router-dom';

export const Sidebar = () => (
  <aside className="w-64 h-screen bg-[#003366] text-white p-6">
    <h2 className="text-xl font-bold mb-8">CareUCE Admin</h2>
    <nav className="flex flex-col gap-4">
      <Link to="/dashboard" className="p-3 hover:bg-[#002244] rounded-lg">
        Dashboard
      </Link>
      <Link to="/alertas" className="p-3 hover:bg-[#002244] rounded-lg">
        Alertas de Crisis
      </Link>
    </nav>
  </aside>
);
