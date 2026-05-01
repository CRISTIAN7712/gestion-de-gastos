import { useState } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { user, setUser, logout } = useAuth();
  const [form, setForm] = useState({ username: user?.username || '', email: user?.email || '' });
  const [msg, setMsg] = useState('');

  async function save(e) {
    e.preventDefault();
    const { data } = await api.put('/users/me', form);
    setUser(data);
    setMsg('Perfil actualizado');
  }

  return (
    <main className="mx-auto mt-8 max-w-lg rounded-xl border bg-white p-6 shadow-sm">
      <h1 className="mb-4 text-xl font-semibold">Mi perfil</h1>
      <form className="space-y-3" onSubmit={save}>
        <input className="w-full rounded border p-2" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
        <input className="w-full rounded border p-2" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        {msg && <p className="text-sm text-green-600">{msg}</p>}
        <button className="rounded bg-indigo-600 p-2 text-white">Guardar cambios</button>
      </form>
      <button className="mt-4 rounded bg-slate-700 p-2 text-white" onClick={logout}>Cerrar sesión</button>
    </main>
  );
}
