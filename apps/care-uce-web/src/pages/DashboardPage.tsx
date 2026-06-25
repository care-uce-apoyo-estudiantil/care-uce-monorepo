import { AdminTemplate } from '../components/templates/AdminTemplate';

export const DashboardPage = () => {
  return (
    <AdminTemplate>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-xl shadow-sm border">
          <h3 className="text-gray-500">Alertas Activas</h3>
          <p className="text-3xl font-bold text-[#D32F2F]">12</p>
        </div>
        <div className="p-6 bg-white rounded-xl shadow-sm border">
          <h3 className="text-gray-500">Usuarios Activos</h3>
          <p className="text-3xl font-bold text-[#003366]">84</p>
        </div>
      </div>
    </AdminTemplate>
  );
};
