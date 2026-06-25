import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthPage } from '../pages/AuthPage';
import { DashboardPage } from '../pages/DashboardPage';
import { StudentsPage } from '../pages/StudentsPage';
import { AlertsPage } from '../pages/AlertsPage';
import { ProtectedRoute } from '../components/atoms/ProtectedRoute';

export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth" replace />} />

      {/* Tu página unificada de Login/Registro */}
      <Route path="/auth" element={<AuthPage />} />

      {/* El Dashboard MVP */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/estudiantes"
        element={
          <ProtectedRoute>
            <StudentsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/alertas"
        element={
          <ProtectedRoute>
            <AlertsPage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/auth" replace />} />
    </Routes>
  );
};

export default App;
