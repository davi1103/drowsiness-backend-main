import express from 'express';
import { PrismaClient } from '@prisma/client';
import { autenticarToken } from '../middlewares/authMiddleware.js';

const prisma = new PrismaClient();
const router = express.Router();

// Registrar un evento requiere sesión activa del usuario autenticado
router.post('/', autenticarToken, async (req, res) => {
  const { tipo, timestamp, probabilidad, sesionId } = req.body || {};

  // Validaciones mínimas
  if (!tipo || !timestamp || probabilidad === undefined || !sesionId) {
    return res.status(400).json({ error: "Faltan campos requeridos" });
  }

  const fecha = new Date(timestamp);
  if (isNaN(fecha.getTime())) {
    return res.status(400).json({ error: "Timestamp inválido" });
  }

  try {
    //  Verificar que la sesión pertenece al usuario autenticado
    const sesion = await prisma.sesion.findUnique({
      where: { id: sesionId }
    });

    if (!sesion) {
      return res.status(404).json({ error: 'Sesión no encontrada' });
    }

    if (sesion.userId !== req.userId) {
      return res.status(403).json({ error: 'No autorizado para registrar en esta sesión' });
    }

    // Crear el evento
    const nuevoEvento = await prisma.evento.create({
      data: {
        tipo,
        timestamp: fecha,
        probabilidad,
        sesionId,
      }
    });

    res.status(201).json(nuevoEvento);
  } catch (error) {
    console.error('❌ Error al registrar evento:', error);
    res.status(500).json({ error: 'No se pudo registrar el evento' });
  }
});

export default router;
