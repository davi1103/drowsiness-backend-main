import express from 'express';
import { PrismaClient } from '@prisma/client';
import { autenticarToken } from '../middlewares/authMiddleware.js';

const prisma = new PrismaClient();
const router = express.Router();

// Obtener todas las sesiones del usuario autenticado
router.get('/', autenticarToken, async (req, res) => {
  try {
    const sesiones = await prisma.sesion.findMany({
      where: { userId: req.userId },
      include: { eventos: true },
      orderBy: { fechaInicio: 'desc' }
    });
    res.status(200).json(sesiones);
  } catch (error) {
    console.error('❌ Error al obtener sesiones:', error);
    res.status(500).json({ error: 'No se pudieron obtener las sesiones' });
  }
});

// Obtener una sesión por ID
router.get('/:id', autenticarToken, async (req, res) => {
  const { id } = req.params;
  try {
    const sesion = await prisma.sesion.findUnique({
      where: { id },
      include: { eventos: true }
    });

    if (!sesion || sesion.userId !== req.userId) {
      return res.status(404).json({ error: 'Sesión no encontrada o no autorizada' });
    }

    res.status(200).json(sesion);
  } catch (error) {
    console.error('❌ Error al obtener la sesión:', error);
    res.status(500).json({ error: 'No se pudo obtener la sesión' });
  }
});

// Iniciar una nueva sesión
router.post('/', autenticarToken, async (req, res) => {
  try {
    const sesionActiva = await prisma.sesion.findFirst({
      where: {
        userId: req.userId,
        fechaFin: null,
      },
    });

    if (sesionActiva) {
      console.warn(`⚠️ Usuario ${req.userId} ya tiene una sesión activa (${sesionActiva.id})`);
      return res.status(400).json({
        error: 'Ya hay una sesión activa',
        id: sesionActiva.id,
      });
    }

    const nuevaSesion = await prisma.sesion.create({
      data: {
        fechaInicio: new Date(),
        userId: req.userId,
      },
    });

    res.status(201).json(nuevaSesion);
  } catch (error) {
    console.error('❌ Error al crear sesión:', error);
    res.status(500).json({ error: 'No se pudo crear la sesión' });
  }
});

// Finalizar sesión
router.patch('/:id/finalizar', autenticarToken, async (req, res) => {
  const { id } = req.params;
  const {
    fechaFin,
    duracion,
    nivelMax,
    promedio,
    eventosTotales
  } = req.body || {};

  // Validación básica
  if (!fechaFin || duracion == null || nivelMax == null || promedio == null || eventosTotales == null) {
    return res.status(400).json({ error: 'Faltan campos obligatorios para finalizar sesión' });
  }

  try {
    const sesion = await prisma.sesion.findUnique({
      where: { id }
    });

    if (!sesion || sesion.userId !== req.userId) {
      return res.status(404).json({ error: 'Sesión no encontrada o no autorizada' });
    }

    const sesionFinalizada = await prisma.sesion.update({
      where: { id },
      data: {
        fechaFin: new Date(fechaFin),
        duracion,
        nivelMax,
        promedio,
        eventosTotales
      },
    });

    res.status(200).json(sesionFinalizada);
  } catch (error) {
    console.error('❌ Error al finalizar sesión:', error);
    res.status(500).json({ error: 'No se pudo finalizar la sesión' });
  }
});

export default router;
