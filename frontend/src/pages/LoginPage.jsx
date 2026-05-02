import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage({ go }) {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      go('/');
    } catch (err) {
      setError(err?.response?.data?.message || 'No se pudo iniciar sesión');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-[calc(100vh-12rem)] flex items-center justify-center px-4 py-12 animate-enter">
      <div className="w-full max-w-md">
        {/* Card elegante con header decorativo */}
        <div className="card card-elevated overflow-hidden">
          {/* Header con gradiente */}
          <div className="gradient-bg px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-sm">
                <span className="text-white font-bold text-lg">🔐</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Bienvenido de nuevo</h1>
                <p className="text-primary-100 text-sm">Accede a tu panel financiero</p>
              </div>
            </div>
          </div>

          {/* Formulario */}
          <form className="card-body space-y-4" onSubmit={onSubmit}>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-finance-base">Email</label>
              <input 
                className="input"
                placeholder="tu@email.com" 
                type="email" 
                required 
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })} 
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-finance-base">Contraseña</label>
              <input 
                className="input"
                placeholder="••••••••" 
                type="password" 
                required 
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })} 
              />
            </div>
            
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-accent-ruby text-sm">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}
            
            <button 
              type="submit" 
              className="btn-primary w-full py-3 text-base font-semibold disabled:opacity-70"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Iniciando sesión...
                </span>
              ) : 'Iniciar sesión'}
            </button>
          </form>

          {/* Footer del card */}
          <div className="card-footer text-center">
            <p className="text-sm text-finance-muted">
              ¿No tienes cuenta?{' '}
              <button 
                className="font-semibold text-primary-600 hover:text-primary-700 transition-colors"
                onClick={() => go('/register')}
              >
                Crear cuenta gratuita
              </button>
            </p>
          </div>
        </div>

        {/* Enlaces adicionales */}
        <div className="mt-6 text-center">
          <button className="text-sm text-finance-muted hover:text-finance-base transition-colors">
            ¿Olvidaste tu contraseña?
          </button>
        </div>
      </div>
    </main>
  );
}
