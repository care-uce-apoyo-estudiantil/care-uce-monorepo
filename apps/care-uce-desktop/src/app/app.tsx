// Location: apps/care-uce-desktop/src/app/app.tsx
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './AuthPage';
import Dashboard from './Dashboard';
import { ProtectedRoute } from './components/ProtectedRoute';

export function App() {
  return (
    <HashRouter>
      <Routes>
        {/* Default route redirects to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public Login Route */}
        <Route path="/login" element={<AuthPage />} />

        {/* Protected Dashboard Route */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </HashRouter>
  );
}

export default App;
