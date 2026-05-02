import { useState } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage({ go }) {
  const { user, setUser, logout } = useAuth();
  const [form, setForm] = useState({ username: user?.username || '', email: user?.email || '' });
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  async function save(e) {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    try {
      const { data } = await api.put('/users/me', form);
      setUser(data);
      setMsg('✅ Perfil actualizado correctamente');
    } catch (err) {
      setMsg('❌ No se pudo actualizar el perfil');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container-premium py-8 animate-enter">
      <div className="max-w-2xl mx-auto">
        {/* Header del perfil */}
        <div className="page-header text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-elevated">
            <span className="text-3xl text-white">👤</span>
          </div>
          <h1 className="page-title">Mi perfil</h1>
          <p className="page-subtitle">Gestiona tu información personal</p>
        </div>

        {/* Card de información del usuario */}
        <article className="card card-elevated mb-6">
          <div className="card-body text-center">
            <h3 className="text-xl font-bold text-finance-dark">{user?.username}</h3>
            <p className="text-finance-muted">{user?.email}</p>
            <div className="mt-4 flex justify-center gap-2">
              <span className="badge badge-success">Cuenta activa</span>
              <span className="badge badge-info">Miembro desde 2024</span>
            </div>
          </div>
        </article>

        {/* Formulario de edición */}
        <article className="card card-elevated">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-finance-dark flex items-center gap-2">
              <span className="text-xl">✏️</span>
              Editar información
            </h2>
          </div>
          <form className="card-body space-y-5" onSubmit={save}>
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-finance-muted uppercase tracking-wide">Nombre de usuario</label>
              <input 
                className="input" 
                value={form.username} 
                onChange={(e) => setForm({ ...form, username: e.target.value })} 
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-finance-muted uppercase tracking-wide">Email</label>
              <input 
                className="input" 
                type="email"
                value={form.email} 
                onChange={(e) => setForm({ ...form, email: e.target.value })} 
              />
            </div>
            
            {msg && (
              <div className={`flex items-center gap-2 p-3 rounded-xl text-sm ${
                msg.includes('✅') 
                  ? 'bg-emerald-50 border border-emerald-200 text-accent-emerald' 
                  : 'bg-red-50 border border-red-200 text-accent-ruby'
              }`}>
                <span>{msg.includes('✅') ? '✓' : '⚠️'}</span>
                <span>{msg}</span>
              </div>
            )}
            
            <button 
              type="submit" 
              className="btn-primary w-full py-3 font-semibold disabled:opacity-70"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Guardando...
                </span>
              ) : '💾 Guardar cambios'}
            </button>
          </form>
        </article>

        {/* Acciones */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <button 
            className="btn-secondary flex-1 sm:flex-none"
            onClick={() => go('/')}
          >
            ← Volver al dashboard
          </button>
          <button 
            className="btn-danger flex-1 sm:flex-none"
            onClick={logout}
          >
            🚪 Cerrar sesión
          </button>
        </div>
      </div>
    </main>
  );
}
