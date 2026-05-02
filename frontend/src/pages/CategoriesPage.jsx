import { useEffect, useState } from 'react';
import { api } from '../api/client';

const ICON_SUGGESTIONS = ['🛒', '🍽️', '🚗', '🏠', '💡', '🎬', '🏥', '🎓', '✈️', '🛍️'];

export default function CategoriesPage({ go }) {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', type: 'expense', icon_name: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const { data } = await api.get('/categories');
      setCategories(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function submit(e) {
    e.preventDefault();
    setError('');
    try {
      await api.post('/categories', form);
      setForm({ name: '', type: 'expense', icon_name: '' });
      await load();
    } catch (err) {
      setError(err?.response?.data?.message || 'No se pudo crear categoría');
    }
  }

  return (
    <main className="container-premium py-8 animate-enter">
      <div className="page-header">
        <h1 className="page-title">Categorías</h1>
        <p className="page-subtitle">Organiza tus movimientos con categorías personalizadas</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Formulario de nueva categoría */}
        <article className="card card-elevated lg:col-span-1">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-finance-dark flex items-center gap-2">
              <span className="text-xl">✨</span>
              Nueva categoría
            </h2>
          </div>
          <form className="card-body space-y-4" onSubmit={submit}>
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-finance-muted uppercase tracking-wide">Nombre</label>
              <input 
                className="input" 
                placeholder="Ej: Supermercado" 
                value={form.name} 
                onChange={(e) => setForm({ ...form, name: e.target.value })} 
                required 
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-finance-muted uppercase tracking-wide">Tipo</label>
              <select 
                className="select" 
                value={form.type} 
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option value="expense">🔴 Gasto</option>
                <option value="income">🟢 Ingreso</option>
              </select>
            </div>
            
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-finance-muted uppercase tracking-wide">Icono</label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {ICON_SUGGESTIONS.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setForm({ ...form, icon_name: icon })}
                    className={`w-9 h-9 rounded-lg text-lg transition-all ${
                      form.icon_name === icon 
                        ? 'bg-primary-100 ring-2 ring-primary-500 scale-110' 
                        : 'bg-finance-light hover:bg-finance-card border border-finance-border'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
              <input 
                className="input" 
                placeholder="O escribe uno..." 
                value={form.icon_name} 
                onChange={(e) => setForm({ ...form, icon_name: e.target.value })} 
              />
            </div>
            
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-accent-ruby text-sm">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}
            
            <button type="submit" className="btn-primary w-full">
              Crear categoría
            </button>
          </form>
        </article>

        {/* Lista de categorías */}
        <article className="card card-elevated lg:col-span-2">
          <div className="card-header flex items-center justify-between">
            <h2 className="text-lg font-semibold text-finance-dark">Mis categorías</h2>
            <span className="badge badge-info">{categories.length} total</span>
          </div>
          <div className="card-body">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin" />
              </div>
            ) : categories.length > 0 ? (
              <ul className="space-y-2">
                {categories.map((c) => (
                  <li 
                    key={c.id} 
                    className="flex items-center justify-between p-4 rounded-xl bg-finance-light/50 border border-finance-border hover:border-primary-200 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{c.icon_name || '📁'}</span>
                      <div>
                        <p className="font-medium text-finance-dark">{c.name}</p>
                        <p className="text-xs text-finance-muted">ID: {c.id}</p>
                      </div>
                    </div>
                    <span className={`badge ${c.type === 'expense' ? 'badge-danger' : 'badge-success'}`}>
                      {c.type === 'expense' ? 'Gasto' : 'Ingreso'}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-12 text-finance-muted">
                <span className="text-4xl block mb-2">📭</span>
                <p>No tienes categorías aún</p>
                <p className="text-sm">Crea tu primera categoría para comenzar</p>
              </div>
            )}
          </div>
        </article>
      </div>

      {/* Botón de volver */}
      <div className="mt-8 flex justify-center">
        <button 
          className="btn-secondary flex items-center gap-2"
          onClick={() => go('/')}
        >
          ← Volver al dashboard
        </button>
      </div>
    </main>
  );
}
