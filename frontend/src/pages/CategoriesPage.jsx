import { useEffect, useState } from 'react';
import { api } from '../api/client';

export default function CategoriesPage({ go }) {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', type: 'expense', icon_name: '' });
  const [error, setError] = useState('');

  async function load() {
    const { data } = await api.get('/categories');
    setCategories(data);
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
    <main className="mx-auto mt-8 max-w-2xl space-y-4 rounded-xl border bg-white p-6 shadow-sm">
      <h1 className="text-xl font-semibold">Mis categorías</h1>
      <form className="grid gap-2 sm:grid-cols-3" onSubmit={submit}>
        <input className="rounded border p-2" placeholder="Nombre" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <select className="rounded border p-2" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
          <option value="expense">Gasto</option>
          <option value="income">Ingreso</option>
        </select>
        <input className="rounded border p-2" placeholder="Icono (opcional)" value={form.icon_name} onChange={(e) => setForm({ ...form, icon_name: e.target.value })} />
        <button className="sm:col-span-3 rounded bg-indigo-600 p-2 text-white">Crear categoría</button>
      </form>
      {error && <p className="text-sm text-red-600">{error}</p>}

      <ul className="divide-y rounded border">
        {categories.map((c) => (
          <li key={c.id} className="flex items-center justify-between p-2 text-sm">
            <span>{c.name}</span>
            <span className="rounded bg-slate-100 px-2 py-1">{c.type}</span>
          </li>
        ))}
      </ul>

      <button className="rounded bg-slate-200 px-3 py-2" onClick={() => go('/')}>Volver</button>
    </main>
  );
}
