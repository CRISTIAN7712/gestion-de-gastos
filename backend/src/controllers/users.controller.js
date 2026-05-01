import bcrypt from 'bcryptjs';
import { pool } from '../db/pool.js';

export async function getMe(req, res) {
  const { rows } = await pool.query(
    'SELECT id, username, email, created_at FROM users WHERE id = $1',
    [req.user.id]
  );
  if (!rows[0]) return res.status(404).json({ message: 'Usuario no encontrado' });
  return res.json(rows[0]);
}

export async function updateMe(req, res) {
  const { username, email } = req.body;
  if (!username || !email) {
    return res.status(400).json({ message: 'username y email son obligatorios' });
  }

  try {
    const { rows } = await pool.query(
      `UPDATE users
       SET username = $1, email = $2
       WHERE id = $3
       RETURNING id, username, email, created_at`,
      [username, email, req.user.id]
    );

    if (!rows[0]) return res.status(404).json({ message: 'Usuario no encontrado' });
    return res.json(rows[0]);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ message: 'Usuario o email ya existe' });
    }
    return res.status(500).json({ message: 'No se pudo actualizar el usuario' });
  }
}

export async function changePassword(req, res) {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'currentPassword y newPassword son obligatorios' });
  }

  const userResult = await pool.query('SELECT password_hash FROM users WHERE id = $1', [req.user.id]);
  const user = userResult.rows[0];
  if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

  const valid = await bcrypt.compare(currentPassword, user.password_hash);
  if (!valid) return res.status(401).json({ message: 'Contraseña actual inválida' });

  const newHash = await bcrypt.hash(newPassword, 12);
  await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [newHash, req.user.id]);
  return res.status(204).send();
}
