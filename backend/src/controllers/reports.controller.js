import { pool } from '../db/pool.js';

export async function getSummary(req, res) {
  const userId = req.user.id;
  const year = Number(req.query.year);
  const month = Number(req.query.month);

  if (!year || !month || month < 1 || month > 12) {
    return res.status(400).json({ message: 'Parámetros year y month válidos requeridos' });
  }

  const summarySql = `
    WITH monthly AS (
      SELECT amount, type, category_id
      FROM transactions
      WHERE user_id = $1
        AND transaction_date >= make_date($2, $3, 1)
        AND transaction_date < (make_date($2, $3, 1) + INTERVAL '1 month')
    )
    SELECT
      COALESCE(SUM(CASE WHEN type = 'income' THEN amount END), 0)::numeric(12,2) AS total_income,
      COALESCE(SUM(CASE WHEN type = 'expense' THEN amount END), 0)::numeric(12,2) AS total_expense,
      (COALESCE(SUM(CASE WHEN type = 'income' THEN amount END), 0) -
       COALESCE(SUM(CASE WHEN type = 'expense' THEN amount END), 0))::numeric(12,2) AS balance
    FROM monthly;
  `;

  const byCategorySql = `
    SELECT c.id, c.name, c.icon_name, SUM(t.amount)::numeric(12,2) AS total
    FROM transactions t
    INNER JOIN categories c ON c.id = t.category_id AND c.user_id = t.user_id
    WHERE t.user_id = $1
      AND t.type = 'expense'
      AND t.transaction_date >= make_date($2, $3, 1)
      AND t.transaction_date < (make_date($2, $3, 1) + INTERVAL '1 month')
    GROUP BY c.id, c.name, c.icon_name
    ORDER BY total DESC;
  `;

  const [summary, byCategory] = await Promise.all([
    pool.query(summarySql, [userId, year, month]),
    pool.query(byCategorySql, [userId, year, month])
  ]);

  return res.json({
    month,
    year,
    totalIncome: summary.rows[0].total_income,
    totalExpense: summary.rows[0].total_expense,
    balance: summary.rows[0].balance,
    expensesByCategory: byCategory.rows
  });
}
