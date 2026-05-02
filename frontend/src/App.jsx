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

function NavButton({ children, onClick, primary = false }) {
  const base = 'rounded-md px-3 py-1.5 text-sm font-medium transition';
  const tone = primary
    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
    : 'text-slate-700 hover:bg-slate-100';
  return (
    <button type="button" className={`${base} ${tone}`} onClick={onClick}>
      {children}
    </button>
  );
}

function AppShell() {
  const { user, token, loading } = useAuth();
  const { path, go } = usePath();

  if (loading) return <p className="p-6 text-slate-600">Cargando...</p>;

  const protectedView = () => {
    if (!token) return <LoginPage go={go} />;
    if (path === '/profile') return <ProfilePage go={go} />;
    if (path === '/categories') return <CategoriesPage go={go} />;
    return <Dashboard />;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="border-b bg-white">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 md:px-6">
          <button type="button" onClick={() => go('/')} className="text-lg font-semibold text-slate-800">
            Gestión de Gastos
          </button>

          <div className="flex items-center gap-2">
            {user && <span className="mr-2 hidden text-sm text-slate-600 sm:inline">Hola, {user.username}</span>}
            {token ? (
              <>
                <NavButton onClick={() => go('/categories')}>Categorías</NavButton>
                <NavButton onClick={() => go('/profile')}>Mi perfil</NavButton>
              </>
            ) : (
              <NavButton primary onClick={() => go('/register')}>Registrarme</NavButton>
            )}
          </div>
        </div>
      </nav>

      {path === '/register' && !token ? <RegisterPage go={go} /> : protectedView()}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}
