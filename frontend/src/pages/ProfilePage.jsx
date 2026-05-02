import { useState } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage({ go }) {
  const { user, setUser, logout } = useAuth();
  const [form, setForm] = useState({ username: user?.username || '', email: user?.email || '' });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  async function save(e) {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      const { data } = await api.put('/users/me', form);
      setUser(data);
      setMessage({ type: 'success', text: '✓ Perfil actualizado exitosamente' });
    } catch (err) {
      setMessage({ type: 'error', text: err?.response?.data?.message || 'Error al actualizar' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg animate-fade-in">
        {/* Card */}
        <div className="glass-card p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <span className="text-2xl font-bold text-white">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
              Mi perfil
            </h1>
            <p className="text-slate-400 mt-2">Gestiona tu información personal</p>
          </div>

          {/* User Info Badge */}
          <div className="mb-6 p-4 rounded-xl bg-slate-800/30 border border-slate-700/30 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500/20 to-violet-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-slate-200">{user?.username}</p>
              <p className="text-sm text-slate-400">{user?.email}</p>
            </div>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={save}>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Nombre de usuario</label>
              <input 
                className="elegant-input"
                value={form.username} 
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                disabled={loading}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
              <input 
                className="elegant-input"
                type="email"
                value={form.email} 
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                disabled={loading}
              />
            </div>

            {message.text && (
              <div className={`p-3 rounded-xl text-sm flex items-center gap-2 ${
                message.type === 'success' 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              }`}>
                {message.type === 'success' ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
                {message.text}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button 
                type="button"
                className="btn-secondary flex-1"
                onClick={() => go('/')}
                disabled={loading}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Guardando...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Guardar cambios
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Logout Section */}
          <div className="mt-8 pt-6 border-t border-slate-800/50">
            <button 
              className="w-full py-3 px-4 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 hover:border-rose-500/40 font-medium transition-all flex items-center justify-center gap-2"
              onClick={logout}
              disabled={loading}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Cerrar sesión
            </button>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-violet-500/10 rounded-full blur-3xl -z-10"></div>
      </div>
    </div>
  );
}
