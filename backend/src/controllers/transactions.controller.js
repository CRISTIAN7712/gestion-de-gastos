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

export async function createTransaction(req, res) {
  try {
    const { amount, description, category_id, category, transaction_date, date, type } = req.body;
    const user_id = req.user.id;
    const normalizedAmount = Number(amount);
    const normalizedDate = transaction_date || date || new Date();

    // Validaciones
    if (!normalizedAmount || !type) {
      return res.status(400).json({ error: 'Amount and type are required' });
    }

    let resolvedCategoryId = category_id;

    if (!resolvedCategoryId && category) {
      const upsertCategory = await pool.query(
        `INSERT INTO categories (user_id, name, type)
         VALUES ($1, $2, $3)
         ON CONFLICT (user_id, name, type)
         DO UPDATE SET name = EXCLUDED.name
         RETURNING id`,
        [user_id, category.trim(), type]
      );
      resolvedCategoryId = upsertCategory.rows[0].id;
    }

    if (!resolvedCategoryId) {
      return res.status(400).json({ error: 'category_id or category is required' });
    }

    // Verificar que la categoría pertenece al usuario
    const categoryCheck = await pool.query(
      'SELECT id FROM categories WHERE id = $1 AND user_id = $2',
      [resolvedCategoryId, user_id]
    );
    
    if (categoryCheck.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid category' });
    }

    // Insertar transacción
    const result = await pool.query(
      `INSERT INTO transactions (user_id, amount, description, category_id, transaction_date, type)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [user_id, normalizedAmount, description || '', resolvedCategoryId, normalizedDate, type]
    );

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating transaction:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
