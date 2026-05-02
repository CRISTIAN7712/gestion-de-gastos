import { useEffect, useMemo, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { api } from '../api/client';

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', '#14b8a6', '#f97316', '#ec4899'];

export default function Dashboard() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, balance: 0, expensesByCategory: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get(`/reports/summary?year=${year}&month=${month}`)
      .then((res) => setSummary(res.data))
      .finally(() => setLoading(false));
  }, [year, month]);

  const chartData = useMemo(
    () => summary.expensesByCategory.map((item) => ({ 
      name: item.name, 
      value: Number(item.total),
      color: COLORS[summary.expensesByCategory.indexOf(item) % COLORS.length]
    })),
    [summary.expensesByCategory]
  );

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
            Dashboard financiero
          </h1>
          <p className="text-slate-400 mt-1">Visualiza y gestiona tus movimientos</p>
        </div>
        
        <div className="flex items-center gap-3">
          <select 
            className="elegant-select"
            value={month} 
            onChange={(e) => setMonth(Number(e.target.value))}
          >
            {['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'].map((m, i) => (
              <option key={i + 1} value={i + 1} className="bg-slate-800">{m}</option>
            ))}
          </select>
          <input 
            className="elegant-input w-24 text-center"
            type="number" 
            value={year} 
            onChange={(e) => setYear(Number(e.target.value))}
            min="2020"
            max="2030"
          />
        </div>
      </header>

      {/* Stats Cards */}
      <section className="grid gap-4 sm:grid-cols-3 animate-fade-in-delay">
        <StatCard 
          title="Ingresos" 
          value={summary.totalIncome} 
          formatter={formatCurrency}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
            </svg>
          }
          gradient="gradient-income"
          loading={loading}
        />
        <StatCard 
          title="Gastos" 
          value={summary.totalExpense} 
          formatter={formatCurrency}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
            </svg>
          }
          gradient="gradient-expense"
          loading={loading}
        />
        <StatCard 
          title="Balance" 
          value={summary.balance} 
          formatter={formatCurrency}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
          gradient="gradient-balance"
          loading={loading}
        />
      </section>

      {/* Charts & Form */}
      <section className="grid gap-6 lg:grid-cols-2 animate-fade-in-delay-2">
        {/* Pie Chart */}
        <article className="glass-card p-6">
          <h2 className="section-title mb-4">Gastos por categoría</h2>
          {loading ? (
            <div className="h-72 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full shimmer"></div>
            </div>
          ) : chartData.length > 0 ? (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    dataKey="value" 
                    data={chartData} 
                    cx="50%" 
                    cy="50%"
                    outerRadius={80} 
                    innerRadius={40}
                    paddingAngle={2}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} className="transition-opacity hover:opacity-80" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'transparent', border: 'none', padding: 0 }}
                    itemStyle={{ color: '#e2e8f0' }}
                    formatter={(value) => formatCurrency(value)}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    formatter={(value) => <span className="text-slate-300 text-sm">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-72 flex flex-col items-center justify-center text-slate-500">
              <svg className="w-12 h-12 mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p className="text-sm">No hay gastos registrados este mes</p>
            </div>
          )}
        </article>

        {/* Quick Transaction Form */}
        <QuickTransactionForm onSuccess={() => {
          // Refresh summary after adding transaction
          api.get(`/reports/summary?year=${year}&month=${month}`).then((res) => setSummary(res.data));
        }} />
      </section>
    </main>
  );
}

function StatCard({ title, value, formatter, icon, gradient, loading }) {
  return (
    <article className="stat-card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400">{title}</p>
          {loading ? (
            <div className="h-8 w-32 mt-2 rounded shimmer"></div>
          ) : (
            <p className={`text-3xl font-bold mt-1 ${gradient.split(' ')[2]}`}>
              {formatter ? formatter(value) : value}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${gradient} bg-opacity-20`}>
          {icon}
        </div>
      </div>
      <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient.split(' ').slice(0, 2).join(' ')}`}></div>
    </article>
  );
}

function QuickTransactionForm({ onSuccess }) {
  const [form, setForm] = useState({
    amount: '',
    type: 'expense',
    date: new Date().toISOString().split('T')[0],
    category: '',
    description: '',
    recurrence: 'none',
    recurrence_every_days: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      const payload = {
        ...form,
        amount: parseFloat(form.amount),
        recurrence_every_days: form.recurrence === 'custom_days' ? Number(form.recurrence_every_days) : null
      };
      await api.post('/transactions', payload);
      setMessage({ type: 'success', text: '✓ Movimiento registrado exitosamente' });
      setForm({ ...form, amount: '', description: '', category: '', recurrence_every_days: '' });
      onSuccess?.();
    } catch (err) {
      setMessage({ type: 'error', text: err?.response?.data?.error || err?.response?.data?.message || 'Error al registrar' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <article className="glass-card p-6">
      <h2 className="section-title mb-5">Registrar movimiento</h2>
      
      {message.text && (
        <div className={`mb-4 p-3 rounded-xl text-sm flex items-center gap-2 ${
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

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Monto</label>
            <input 
              className="elegant-input"
              type="number" 
              step="0.01" 
              placeholder="0.00"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              required 
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Tipo</label>
            <select 
              className="elegant-select"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              required
            >
              <option value="expense" className="bg-slate-800">🔴 Gasto</option>
              <option value="income" className="bg-slate-800">🟢 Ingreso</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Fecha</label>
            <input 
              className="elegant-input"
              type="date" 
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              required 
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Categoría</label>
            <input 
              className="elegant-input"
              placeholder="Ej: Comida, Transporte..."
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              required 
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Descripción</label>
          <input 
            className="elegant-input"
            placeholder="Detalles del movimiento..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Frecuencia</label>
            <select
              className="elegant-select"
              value={form.recurrence}
              onChange={(e) => setForm({ ...form, recurrence: e.target.value })}
            >
              <option value="none" className="bg-slate-800">Único (sin repetición)</option>
              <option value="weekly" className="bg-slate-800">Semanal</option>
              <option value="biweekly" className="bg-slate-800">Quincenal</option>
              <option value="monthly" className="bg-slate-800">Mensual</option>
              <option value="custom_days" className="bg-slate-800">Cada N días</option>
            </select>
          </div>
          {form.recurrence === 'custom_days' && (
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Cada cuántos días</label>
              <input
                className="elegant-input"
                type="number"
                min="1"
                value={form.recurrence_every_days}
                onChange={(e) => setForm({ ...form, recurrence_every_days: e.target.value })}
                required
              />
            </div>
          )}
        </div>

        <button 
          type="submit" 
          className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={submitting}
        >
          {submitting ? (
            <>
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Procesando...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Registrar movimiento
            </>
          )}
        </button>
      </form>
    </article>
  );
}
