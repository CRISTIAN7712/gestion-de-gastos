import { pool } from '../db/pool.js';

export async function listTransactions(req, res) {
  const { month, year } = req.query;
  const values = [req.user.id];
  let where = 'WHERE t.user_id = $1';

  if (month && year) {
    values.push(Number(year), Number(month));
    where += ' AND t.transaction_date >= make_date($2, $3, 1) AND t.transaction_date < (make_date($2, $3, 1) + INTERVAL \'1 month\')';
  }

  const sql = `
    SELECT t.*, c.name AS category_name, c.icon_name
    FROM transactions t
    JOIN categories c ON c.id = t.category_id AND c.user_id = t.user_id
    ${where}
    ORDER BY t.transaction_date DESC, t.created_at DESC
  `;

  const { rows } = await pool.query(sql, values);
  return res.json(rows);
}
