import { useEffect, useState } from 'react';
import Dashboard from './components/Dashboard';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import RegisterPage from './pages/RegisterPage';
import CategoriesPage from './pages/CategoriesPage';

function usePath() {
  const [path, setPath] = useState(window.location.pathname);
  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  const go = (to) => {
    window.history.pushState({}, '', to);
    setPath(to);
  };
  return { path, go };
}

function AppShell() {
  const { user, token, loading } = useAuth();
  const { path, go } = usePath();

  if (loading) return <p className="p-6">Cargando...</p>;

  const protectedView = () => {
    if (!token) return <LoginPage go={go} />;
    if (path === '/profile') return <ProfilePage go={go} />;
    if (path === '/categories') return <CategoriesPage go={go} />;
    return <Dashboard />;
  };

  return (
    <>
      <nav className="flex items-center justify-between border-b bg-white px-6 py-3">
        <button onClick={() => go('/')} className="font-semibold">Gestión de Gastos</button>
        <div className="flex items-center gap-4 text-sm">
          {user && <span>Hola, {user.username}</span>}
          {token ? (
            <>
              <button className="text-indigo-600" onClick={() => go('/categories')}>Categorías</button>
              <button className="text-indigo-600" onClick={() => go('/profile')}>Mi perfil</button>
            </>
          ) : (
            <button className="text-indigo-600" onClick={() => go('/register')}>Registrarme</button>
          )}
        </div>
      </nav>
      {path === '/register' && !token ? <RegisterPage go={go} /> : protectedView()}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}
