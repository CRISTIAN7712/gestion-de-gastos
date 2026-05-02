import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage({ go }) {
  const { register } = useAuth();
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      go('/');
    } catch (err) {
      setError(err?.response?.data?.message || 'No se pudo registrar');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-[calc(100vh-12rem)] flex items-center justify-center px-4 py-12 animate-enter">
      <div className="w-full max-w-md">
        {/* Card elegante con header decorativo */}
        <div className="card card-elevated overflow-hidden">
          {/* Header con gradiente de éxito */}
          <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-sm">
                <span className="text-white font-bold text-lg">✨</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Únete ahora</h1>
                <p className="text-emerald-100 text-sm">Comienza tu viaje financiero</p>
              </div>
            </div>
          </div>

          {/* Formulario */}
          <form className="card-body space-y-4" onSubmit={onSubmit}>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-finance-base">Nombre de usuario</label>
              <input 
                className="input"
                placeholder="Tu nombre" 
                required 
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })} 
              />
            </div>
            
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
                placeholder="Mínimo 8 caracteres" 
                type="password" 
                required 
                minLength={8}
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
              className="btn-success w-full py-3 text-base font-semibold disabled:opacity-70"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Creando cuenta...
                </span>
              ) : 'Crear cuenta gratuita'}
            </button>
            
            <p className="text-xs text-finance-muted text-center leading-relaxed">
              Al registrarte, aceptas nuestros <button className="underline hover:text-primary-600">Términos</button> y <button className="underline hover:text-primary-600">Política de privacidad</button>.
            </p>
          </form>

          {/* Footer del card */}
          <div className="card-footer text-center">
            <p className="text-sm text-finance-muted">
              ¿Ya tienes cuenta?{' '}
              <button 
                className="font-semibold text-primary-600 hover:text-primary-700 transition-colors"
                onClick={() => go('/login')}
              >
                Iniciar sesión
              </button>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
