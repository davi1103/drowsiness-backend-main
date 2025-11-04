// middlewares/authMiddleware.js
import jwt from 'jsonwebtoken';

export function autenticarToken(req, res, next) {
  try {
    // 1️⃣ Obtener el encabezado Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(403).json({ error: 'Token ausente o malformado' });
    }

    // 2️⃣ Extraer el token
    const token = authHeader.split(' ')[1];

    // 3️⃣ Verificar el token con la misma clave usada en auth.js
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('❌ JWT_SECRET no está definida en .env');
      return res.status(500).json({ error: 'Configuración del servidor inválida' });
    }

    const decoded = jwt.verify(token, secret);

    // 4️⃣ Asignar el ID del usuario a req.userId
    req.userId = decoded.userId;

    // 5️⃣ Continuar
    next();
  } catch (error) {
    console.error('❌ Error al verificar token:', error.message);
    return res.status(403).json({ error: 'Token inválido o expirado' });
  }
}
