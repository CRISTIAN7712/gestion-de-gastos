import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage({ go }) {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      await login(form.email, form.password);
      go('/');
    } catch (err) {
      setError(err?.response?.data?.message || 'No se pudo iniciar sesión');
    }
  }

  return (
    <main className="mx-auto mt-16 max-w-md rounded-xl border bg-white p-6 shadow-sm">
      <h1 className="mb-4 text-xl font-semibold">Iniciar sesión</h1>
      <form className="space-y-3" onSubmit={onSubmit}>
        <input className="w-full rounded border p-2" placeholder="Email" type="email" required onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="w-full rounded border p-2" placeholder="Password" type="password" required onChange={(e) => setForm({ ...form, password: e.target.value })} />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button className="w-full rounded bg-indigo-600 p-2 text-white">Entrar</button>
      </form>
      <p className="mt-3 text-sm">¿No tienes cuenta? <button className="text-indigo-600" onClick={() => go('/register')}>Regístrate</button></p>
    </main>
  );
}
