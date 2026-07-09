import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './AuthPage';
import Dashboard from './Dashboard';

export function App() {
  return (
    <HashRouter>
      <Routes>
        {/* Al abrir la app, va directo al Login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Ruta del Login */}
        <Route path="/login" element={<AuthPage />} />

        {/* Ruta del Dashboard principal */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
