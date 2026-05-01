import { verifyToken } from '../utils/jwt.js';

export function authRequired(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token requerido' });
  }

  try {
    const token = authHeader.slice(7);
    const payload = verifyToken(token);
    req.user = { id: payload.sub, email: payload.email };
    return next();
  } catch {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
}
