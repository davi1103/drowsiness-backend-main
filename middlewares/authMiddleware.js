import jwt from 'jsonwebtoken';

const JWT_SECRET = 'mi_super_clave_secreta_123'; // ⚠️ Deberías mover esto a variables de entorno

export function autenticarToken(req, res, next) {
  try {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Encabezado de autorización inválido o ausente' });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, JWT_SECRET, (err, payload) => {
      if (err) {
        return res.status(403).json({ error: 'Token inválido o expirado' });
      }

      req.userId = payload.userId;
      next();
    });

  } catch (error) {
    console.error('❌ Error en autenticarToken:', error);
    return res.status(500).json({ error: 'Error al verificar el token' });
  }
}
