import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import RegisterPage from './pages/RegisterPage';

function AppShell() {
  const { user } = useAuth();
  return (
    <>
      <nav className="flex items-center justify-between border-b bg-white px-6 py-3">
        <Link to="/" className="font-semibold">Gestión de Gastos</Link>
        <div className="flex items-center gap-4 text-sm">
          {user && <span>Hola, {user.username}</span>}
          <Link className="text-indigo-600" to="/profile">Mi perfil</Link>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </BrowserRouter>
  );
}
