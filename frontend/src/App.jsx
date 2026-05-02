import { useEffect, useState } from 'react';
import Dashboard from './components/Dashboard';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import RegisterPage from './pages/RegisterPage';
import CategoriesPage from './pages/CategoriesPage';

// ← Hook personalizado para dark mode
function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return [isDark, setIsDark];
}

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

function NavButton({ children, onClick, variant = 'ghost', active = false }) {
  const base = 'rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 ease-luxury';
  const variants = {
    primary: 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-soft hover:shadow-elevated hover:from-primary-700 hover:to-primary-800',
    secondary: 'bg-finance-card text-finance-base border border-finance-border hover:border-primary-300 hover:text-primary-700 shadow-soft dark:bg-finance-dark-card dark:text-finance-dark-muted dark:border-finance-dark-border dark:hover:border-primary-500 dark:hover:text-finance-dark-text',
    ghost: `text-finance-muted hover:text-finance-base hover:bg-finance-card/60 dark:text-finance-dark-muted dark:hover:text-finance-dark-text dark:hover:bg-finance-dark-card/60 ${active ? 'text-primary-700 bg-primary-50/60 font-semibold dark:text-primary-400 dark:bg-primary-900/20' : ''}`,
  };
  return (
    <button type="button" className={`${base} ${variants[variant]}`} onClick={onClick}>
      {children}
    </button>
  );
}

// ← Componente Toggle Dark Mode
function ThemeToggle({ isDark, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="theme-toggle group relative flex items-center"
      aria-label={isDark ? 'Activar modo claro' : 'Activar modo oscuro'}
      title={isDark ? 'Modo claro ☀️' : 'Modo oscuro 🌙'}
    >
      <span className="theme-toggle-ball" />
      <span className="sr-only">Toggle theme</span>
      {/* Iconos decorativos */}
      <span className={`absolute left-1.5 text-[10px] transition-opacity duration-200 ${isDark ? 'opacity-0' : 'opacity-100'}`}>☀️</span>
      <span className={`absolute right-1.5 text-[10px] transition-opacity duration-200 ${isDark ? 'opacity-100' : 'opacity-0'}`}>🌙</span>
    </button>
  );
}

function AppShell() {
  const { user, token, loading, logout } = useAuth(); // ← Extraer logout
  const { path, go } = usePath();
  const [isDark, setIsDark] = useDarkMode(); // ← Hook dark mode

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-finance-light to-primary-50/30 dark:from-finance-dark-bg dark:to-primary-950/30 transition-colors duration-300">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin dark:border-primary-800 dark:border-t-primary-400" />
          <p className="text-finance-muted font-medium dark:text-finance-dark-muted">Cargando tu experiencia financiera...</p>
        </div>
      </div>
    );
  }

  const protectedView = () => {
    if (!token) return <LoginPage go={go} />;
    if (path === '/profile') return <ProfilePage go={go} />;
    if (path === '/categories') return <CategoriesPage go={go} />;
    return <Dashboard />;
  };

  // ← Handlers para botones de autenticación
  const handleLogin = () => go('/login');
  const handleRegister = () => go('/register');
  const handleLogout = () => {
    logout();
    go('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-finance-light via-finance-light to-primary-50/20 dark:from-finance-dark-bg dark:via-finance-dark-bg dark:to-primary-950/20 transition-colors duration-300">
      {/* Header elegante con efecto glassmorphism y dark mode */}
      <header className="header-glass">
        <div className="container-premium">
          <div className="flex h-16 items-center justify-between">
            {/* Logo / Brand */}
            <button 
              type="button" 
              onClick={() => go('/')} 
              className="flex items-center gap-2 group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center shadow-elevated group-hover:shadow-luxury transition-shadow">
                <span className="text-white font-bold text-lg">$</span>
              </div>
              <span className="text-xl font-bold text-finance-dark tracking-tight dark:text-finance-dark-text transition-colors">
                Gestión de Gastos
                <span className="block text-xs font-normal text-finance-muted dark:text-finance-dark-muted -mt-0.5 transition-colors">Control financiero inteligente</span>
              </span>
            </button>

            {/* Navegación */}
            <nav className="flex items-center gap-1.5">
              {user && (
                <span className="hidden sm:flex items-center gap-2 mr-2 px-3 py-1.5 rounded-full bg-finance-card border border-finance-border dark:bg-finance-dark-card dark:border-finance-dark-border transition-colors">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-soft" />
                  <span className="text-sm font-medium text-finance-base dark:text-finance-dark-text transition-colors">{user.username}</span>
                </span>
              )}
              
              {/* ← Toggle Dark Mode */}
              <div className="hidden sm:flex items-center mr-2">
                <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
              </div>
              
              {token ? (
                <>
                  <NavButton 
                    onClick={() => go('/categories')} 
                    variant="ghost"
                    active={path === '/categories'}
                  >
                    Categorías
                  </NavButton>
                  <NavButton 
                    onClick={() => go('/profile')} 
                    variant="ghost"
                    active={path === '/profile'}
                  >
                    Perfil
                  </NavButton>
                  <div className="w-px h-6 bg-finance-border dark:bg-finance-dark-border mx-1 transition-colors" />
                  {/* ← Botón Cerrar Sesión FUNCIONAL */}
                  <NavButton variant="secondary" onClick={() => { logout(); go('/'); }}>
                    Cerrar sesión
                  </NavButton>
                </>
              ) : (
                <>
                  {/* ← Botón Iniciar Sesión FUNCIONAL */}
                  <NavButton variant="ghost" onClick={() => go('/login')}>
                    Iniciar sesión
                  </NavButton>
                  <NavButton variant="primary" onClick={handleRegister}>
                    Comenzar gratis
                  </NavButton>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="flex-1 animate-enter">
        {path === '/register' && !token ? <RegisterPage go={go} /> : protectedView()}
      </main>

      {/* Footer elegante */}
      <footer className="border-t border-finance-border/60 bg-finance-card/50 backdrop-blur-sm dark:border-finance-dark-border/60 dark:bg-finance-dark-card/50 transition-colors">
        <div className="container-premium py-4">
          <p className="text-center text-sm text-finance-muted dark:text-finance-dark-muted transition-colors">
            © {new Date().getFullYear()} Gestión de Gastos · Tu aliado financiero
          </p>
        </div>
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