import express from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const router = express.Router();

// Clave secreta para JWT (en producción debe ir en variable de entorno)
const JWT_SECRET = 'mi_super_clave_secreta_123';

// Registro de usuario
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: 'Email y contraseña son requeridos' });

  try {
    const usuarioExistente = await prisma.user.findUnique({ where: { email } });
    if (usuarioExistente)
      return res.status(409).json({ error: 'El email ya está registrado' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const nuevoUsuario = await prisma.user.create({
      data: {
        email,
        password: hashedPassword
      }
    });

    res.json({ message: 'Usuario registrado correctamente' });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error al registrar el usuario' });
  }
});

// Login de usuario
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: 'Email y contraseña son requeridos' });

  try {
    const usuario = await prisma.user.findUnique({ where: { email } });
    if (!usuario)
      return res.status(401).json({ error: 'Credenciales inválidas' });

    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida)
      return res.status(401).json({ error: 'Credenciales inválidas' });

    const token = jwt.sign({ userId: usuario.id }, JWT_SECRET, { expiresIn: '7d' });

    // ✅ Aquí retornamos también el userId
    res.json({ token, userId: usuario.id });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});
export default router;
