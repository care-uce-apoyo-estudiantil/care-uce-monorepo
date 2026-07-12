import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthPage } from '../pages/AuthPage';
import { DashboardPage } from '../pages/DashboardPage';
import { StudentsPage } from '../pages/StudentsPage';
import { AlertsPage } from '../pages/AlertsPage';
import { ProtectedRoute } from '../components/atoms/ProtectedRoute';
import { AdminTemplate } from '../components/templates/AdminTemplate';

export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth" replace />} />
      <Route path="/auth" element={<AuthPage />} />

      {/* Rutas envueltas en AdminTemplate */}
      <Route element={<AdminTemplate />}>
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
      </Route>

      <Route path="*" element={<Navigate to="/auth" replace />} />
    </Routes>
  );
};

export default App;
