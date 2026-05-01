import bcrypt from 'bcryptjs';
import { pool } from '../db/pool.js';
import { signToken } from '../utils/jwt.js';

export async function register(req, res) {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'username, email y password son obligatorios' });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const query = `
    INSERT INTO users (username, email, password_hash)
    VALUES ($1, $2, $3)
    RETURNING id, username, email, created_at
  `;

  try {
    const { rows } = await pool.query(query, [username, email, passwordHash]);
    const token = signToken(rows[0]);
    return res.status(201).json({ user: rows[0], token });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ message: 'Usuario o email ya existe' });
    }
    return res.status(500).json({ message: 'Error al registrar usuario' });
  }
}

export async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'email y password son obligatorios' });
  }

  const { rows } = await pool.query('SELECT id, username, email, password_hash FROM users WHERE email = $1', [email]);
  const user = rows[0];
  if (!user) return res.status(401).json({ message: 'Credenciales inválidas' });

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ message: 'Credenciales inválidas' });

  const token = signToken(user);
  return res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
}
