import { useEffect, useState } from 'react';
import Dashboard from './components/Dashboard';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import RegisterPage from './pages/RegisterPage';

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

function Navbar({ user, token, go, onLogout }) {
  return (
    <nav className="sticky top-0 z-50 glass-card border-b-0 rounded-none border-x-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button 
            onClick={() => go('/')} 
            className="flex items-center gap-3 group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/40 transition-shadow">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
              Gestión de Gastos
            </span>
          </button>

          {/* Navigation */}
          <div className="flex items-center gap-3">
            {user && (
              <span className="hidden sm:block text-sm text-slate-400">
                Hola, <span className="text-slate-200 font-medium">{user.username}</span>
              </span>
            )}
            
            {token ? (
              <>
                <button 
                  className="btn-secondary text-sm py-2 px-4"
                  onClick={() => go('/profile')}
                >
                  Mi perfil
                </button>
                <button 
                  className="btn-secondary text-sm py-2 px-4 text-rose-400 hover:text-rose-300 border-rose-500/30 hover:border-rose-500/50"
                  onClick={onLogout}
                >
                  Salir
                </button>
              </>
            ) : (
              <>
                <button 
                  className="btn-secondary text-sm py-2 px-4"
                  onClick={() => go('/login')}
                >
                  Iniciar sesión
                </button>
                <button 
                  className="btn-primary text-sm py-2 px-4"
                  onClick={() => go('/register')}
                >
                  Registrarse
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

function AppShell() {
  const { user, token, loading, logout } = useAuth();
  const { path, go } = usePath();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center animate-pulse">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-slate-400 animate-pulse">Cargando tu panel...</p>
        </div>
      </div>
    );
  }

  const protectedView = () => {
    if (!token) return <LoginPage go={go} />;
    if (path === '/profile') return <ProfilePage go={go} />;
    return <Dashboard />;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} token={token} go={go} onLogout={logout} />
      <main className="flex-1">
        {path === '/register' && !token ? <RegisterPage go={go} /> : protectedView()}
      </main>
      
      {/* Footer */}
      <footer className="py-6 text-center text-sm text-slate-600">
        <p>© {new Date().getFullYear()} Gestión de Gastos • Controla tus finanzas con elegancia</p>
      </footer>
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
