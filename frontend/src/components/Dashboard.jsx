import { useEffect, useMemo, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { api } from '../api/client';

const COLORS = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#14b8a6'];

export default function Dashboard() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, balance: 0, expensesByCategory: [] });

  useEffect(() => {
    api.get(`/reports/summary?year=${year}&month=${month}`).then((res) => setSummary(res.data));
  }, [year, month]);

  const chartData = useMemo(
    () => summary.expensesByCategory.map((item) => ({ name: item.name, value: Number(item.total) })),
    [summary.expensesByCategory]
  );

  return (
    <main className="space-y-6 p-4 md:p-6">
      <header className="flex flex-wrap items-center gap-2">
        <h1 className="text-2xl font-semibold">Dashboard financiero</h1>
        <select className="rounded border p-2" value={month} onChange={(e) => setMonth(Number(e.target.value))}>
          {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
        <input className="w-24 rounded border p-2" type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} />
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        <Card title="Ingresos" value={summary.totalIncome} tone="green" />
        <Card title="Gastos" value={summary.totalExpense} tone="red" />
        <Card title="Balance" value={summary.balance} tone="blue" />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-xl border bg-white p-4 shadow-sm">
          <h2 className="mb-2 text-lg font-medium">Gastos por categoría</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie dataKey="value" data={chartData} outerRadius={90} label>
                  {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </article>

        <QuickTransactionForm />
      </section>
    </main>
  );
}

function Card({ title, value, tone }) {
  const tones = { green: 'text-green-600', red: 'text-red-600', blue: 'text-blue-600' };
  return (
    <article className="rounded-xl border bg-white p-4 shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>
      <p className={`text-2xl font-semibold ${tones[tone]}`}>${Number(value).toFixed(2)}</p>
    </article>
  );
}

function QuickTransactionForm() {
  return (
    <article className="rounded-xl border bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-lg font-medium">Registrar movimiento rápido</h2>
      <form className="grid gap-2 sm:grid-cols-2">
        <input className="rounded border p-2" name="amount" type="number" step="0.01" placeholder="Monto" required />
        <select className="rounded border p-2" name="type" required>
          <option value="expense">Gasto</option>
          <option value="income">Ingreso</option>
        </select>
        <input className="rounded border p-2" name="date" type="date" required />
        <input className="rounded border p-2" name="category" placeholder="Categoría" required />
        <input className="sm:col-span-2 rounded border p-2" name="description" placeholder="Descripción" />
        <button className="sm:col-span-2 rounded bg-indigo-600 p-2 font-medium text-white">Guardar</button>
      </form>
    </article>
  );
}
