import { useEffect, useMemo, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { api } from '../api/client';

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#14b8a6', '#06b6d4', '#6366f1'];

export default function Dashboard() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, balance: 0, expensesByCategory: [] });
  const [loading, setLoading] = useState(true);

  async function loadSummary() {
    setLoading(true);
    try {
      const res = await api.get(`/reports/summary?year=${year}&month=${month}`);
      setSummary(res.data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSummary();
  }, [year, month]);

  const chartData = useMemo(
    () => summary.expensesByCategory.map((item) => ({ name: item.name, value: Number(item.total) })),
    [summary.expensesByCategory]
  );

  return (
    <main className="container-premium py-6 space-y-8 animate-enter">
      {/* Header del dashboard */}
      <header className="flex flex-wrap items-center justify-between gap-4 page-header">
        <div>
          <h1 className="page-title">Dashboard financiero</h1>
          <p className="page-subtitle">Visualiza y controla tus finanzas en tiempo real</p>
        </div>
        
        <div className="flex items-center gap-3">
          <select 
            className="select w-32"
            value={month} 
            onChange={(e) => setMonth(Number(e.target.value))}
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>{String(m).padStart(2, '0')}</option>
            ))}
          </select>
          <input 
            className="input w-24 text-center"
            type="number" 
            value={year} 
            onChange={(e) => setYear(Number(e.target.value))} 
            min="2020"
            max="2030"
          />
        </div>
      </header>

      {/* Tarjetas de resumen con gradientes */}
      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <SummaryCard 
          title="Ingresos" 
          value={summary.totalIncome} 
          variant="income"
          icon="📈"
        />
        <SummaryCard 
          title="Gastos" 
          value={summary.totalExpense} 
          variant="expense"
          icon="📉"
        />
        <SummaryCard 
          title="Balance" 
          value={summary.balance} 
          variant={Number(summary.balance) >= 0 ? 'balance-positive' : 'balance-negative'}
          icon="💰"
        />
      </section>

      {/* Sección de gráficos y formulario */}
      <section className="grid gap-6 lg:grid-cols-2">
        {/* Gráfico de pastel */}
        <article className="card card-elevated">
          <div className="card-header flex items-center justify-between">
            <h2 className="text-lg font-semibold text-finance-dark">Distribución de gastos</h2>
            <span className="badge badge-info">{chartData.length} categorías</span>
          </div>
          <div className="card-body">
            {loading ? (
              <div className="h-72 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin" />
              </div>
            ) : chartData.length > 0 ? (
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie 
                      dataKey="value" 
                      data={chartData} 
                      outerRadius={85}
                      innerRadius={50}
                      paddingAngle={3}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {chartData.map((_, i) => (
                        <Cell 
                          key={i} 
                          fill={COLORS[i % COLORS.length]} 
                          className="transition-opacity hover:opacity-80 cursor-pointer"
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: '12px', 
                        border: 'none', 
                        boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
                        backgroundColor: '#fff'
                      }}
                    />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36}
                      iconType="circle"
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-72 flex flex-col items-center justify-center text-finance-muted">
                <span className="text-4xl mb-2">📊</span>
                <p className="text-sm">No hay datos para mostrar</p>
              </div>
            )}
          </div>
        </article>

        {/* Formulario de transacción rápida */}
        <QuickTransactionForm onCreated={loadSummary} />
      </section>
    </main>
  );
}

function SummaryCard({ title, value, variant, icon }) {
  const variants = {
    income: {
      bg: 'from-emerald-50 to-emerald-100/50',
      border: 'border-emerald-200',
      text: 'text-accent-emerald',
      iconBg: 'bg-emerald-500',
    },
    expense: {
      bg: 'from-red-50 to-red-100/50',
      border: 'border-red-200',
      text: 'text-accent-ruby',
      iconBg: 'bg-accent-ruby',
    },
    'balance-positive': {
      bg: 'from-primary-50 to-primary-100/50',
      border: 'border-primary-200',
      text: 'text-primary-700',
      iconBg: 'bg-primary-600',
    },
    'balance-negative': {
      bg: 'from-amber-50 to-amber-100/50',
      border: 'border-amber-200',
      text: 'text-amber-700',
      iconBg: 'bg-amber-500',
    },
  };
  
  const style = variants[variant] || variants.income;
  const numericValue = Number(value) || 0;
  const isNegative = numericValue < 0;

  return (
    <article className={`card gradient-card bg-gradient-to-br ${style.bg} ${style.border} hover:scale-[1.02]`}> 
      <div className="card-body flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-finance-muted uppercase tracking-wide">{title}</p>
          <p className={`text-3xl font-bold mt-1 ${style.text} ${isNegative ? 'line-through' : ''}`}>
            ${Math.abs(numericValue).toFixed(2)}
          </p>
          {isNegative && (
            <span className="text-xs text-accent-ruby font-medium">Negativo</span>
          )}
        </div>
        <div className={`w-12 h-12 rounded-2xl ${style.iconBg} flex items-center justify-center text-white text-xl shadow-soft`}>
          {icon}
        </div>
      </div>
    </article>
  );
}

function QuickTransactionForm({ onCreated }) {
  const today = new Date().toISOString().slice(0, 10);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ 
    amount: '', 
    type: 'expense', 
    transaction_date: today, 
    category_id: '', 
    description: '' 
  });

  useEffect(() => {
    api.get(`/categories?type=${form.type}`).then((r) => setCategories(r.data));
  }, [form.type]);

  async function submit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/transactions', form);
      setForm((prev) => ({ ...prev, amount: '', description: '' }));
      onCreated();
    } catch (err) {
      setError(err?.response?.data?.message || 'No se pudo guardar el movimiento');
    } finally {
      setLoading(false);
    }
  }

  return (
    <article className="card card-elevated">
      <div className="card-header">
        <h2 className="text-lg font-semibold text-finance-dark flex items-center gap-2">
          <span className="text-xl">⚡</span>
          Movimiento rápido
        </h2>
      </div>
      <form className="card-body grid gap-4 sm:grid-cols-2" onSubmit={submit}>
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-finance-muted uppercase tracking-wide mb-1.5">Tipo</label>
          <div className="flex gap-2">
            {['expense', 'income'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setForm({ ...form, type, category_id: '' })}
                className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                  form.type === type
                    ? type === 'expense'
                      ? 'bg-accent-ruby text-white shadow-soft'
                      : 'bg-accent-emerald text-white shadow-soft'
                    : 'bg-finance-light text-finance-muted hover:bg-finance-card border border-finance-border'
                }`}
              >
                {type === 'expense' ? '🔴 Gasto' : '🟢 Ingreso'}
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-xs font-medium text-finance-muted uppercase tracking-wide mb-1.5">Monto ($)</label>
          <input 
            className="input" 
            type="number" 
            step="0.01" 
            placeholder="0.00" 
            required 
            value={form.amount} 
            onChange={(e) => setForm({ ...form, amount: e.target.value })} 
          />
        </div>
        
        <div>
          <label className="block text-xs font-medium text-finance-muted uppercase tracking-wide mb-1.5">Fecha</label>
          <input 
            className="input" 
            type="date" 
            required 
            value={form.transaction_date} 
            onChange={(e) => setForm({ ...form, transaction_date: e.target.value })} 
          />
        </div>
        
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-finance-muted uppercase tracking-wide mb-1.5">Categoría</label>
          <select 
            className="select" 
            required 
            value={form.category_id} 
            onChange={(e) => setForm({ ...form, category_id: e.target.value })}
          >
            <option value="">Selecciona una categoría</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-finance-muted uppercase tracking-wide mb-1.5">Descripción</label>
          <input 
            className="input" 
            placeholder="Ej: Compra en supermercado" 
            value={form.description} 
            onChange={(e) => setForm({ ...form, description: e.target.value })} 
          />
        </div>
        
        {error && (
          <div className="sm:col-span-2 flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-accent-ruby text-sm">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}
        
        <button 
          type="submit" 
          className="sm:col-span-2 btn-primary py-3 font-semibold disabled:opacity-70"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              Guardando...
            </span>
          ) : '💾 Guardar movimiento'}
        </button>
      </form>
    </article>
  );
}
