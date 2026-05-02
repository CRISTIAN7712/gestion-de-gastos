import { pool } from '../db/pool.js';

export async function listCategories(req, res) {
  const { type } = req.query;
  const values = [req.user.id];
  let sql = 'SELECT id, name, type, icon_name, created_at FROM categories WHERE user_id = $1';
  if (type) {
    values.push(type);
    sql += ' AND type = $2';
  }
  sql += ' ORDER BY name ASC';
  const { rows } = await pool.query(sql, values);
  return res.json(rows);
}

export async function createCategory(req, res) {
  const { name, type, icon_name } = req.body;
  if (!name || !type) return res.status(400).json({ message: 'name y type son obligatorios' });

  try {
    const { rows } = await pool.query(
      `INSERT INTO categories (user_id, name, type, icon_name)
       VALUES ($1, $2, $3, $4)
       RETURNING id, user_id, name, type, icon_name, created_at`,
      [req.user.id, name.trim(), type, icon_name || null]
    );
    return res.status(201).json(rows[0]);
  } catch (error) {
    if (error.code === '23505') return res.status(409).json({ message: 'Categoría duplicada para este usuario' });
    return res.status(500).json({ message: 'No se pudo crear categoría' });
  }
}
