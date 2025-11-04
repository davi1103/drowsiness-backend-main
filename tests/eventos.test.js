import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import app from './testServer.js';

const prisma = new PrismaClient();
const JWT_SECRET = 'mi_super_clave_ultra_segura_456';

describe('📌 Pruebas de la ruta /eventos', () => {
  let user;
  let token;
  let sesion;

  beforeAll(async () => {
    // 🧼 Eliminar usuarios específicos de pruebas (si existen)
    await prisma.evento.deleteMany({
      where: {
        sesion: {
          user: {
            email: { in: ['evento@test.com', 'otro@test.com'] },
          },
        },
      },
    });

    await prisma.sesion.deleteMany({
      where: {
        user: {
          email: { in: ['evento@test.com', 'otro@test.com'] },
        },
      },
    });

    await prisma.user.deleteMany({
      where: {
        email: { in: ['evento@test.com', 'otro@test.com'] },
      },
    });

    // 👤 Crear usuario principal
    const hashed = await bcrypt.hash('123456', 10);
    user = await prisma.user.create({
      data: { email: 'evento@test.com', password: hashed },
    });

    // 🕒 Crear sesión para el usuario
    sesion = await prisma.sesion.create({
      data: {
        userId: user.id,
        fechaInicio: new Date(),
      },
    });

    // 🔐 Token válido
    token = jwt.sign({ userId: user.id }, JWT_SECRET);
  });

  afterAll(async () => {
    // 🧼 Eliminar solo lo creado por esta prueba
    await prisma.evento.deleteMany({
      where: {
        sesionId: sesion.id,
      },
    });

    await prisma.sesion.delete({
      where: {
        id: sesion.id,
      },
    });

    await prisma.user.delete({
      where: {
        id: user.id,
      },
    });

    // También borra el otro usuario si se creó
    await prisma.user.deleteMany({
      where: {
        email: 'otro@test.com',
      },
    });

    await prisma.$disconnect();
  });

  test('✅ Registrar evento correctamente', async () => {
    const res = await request(app)
      .post('/eventos')
      .set('Authorization', `Bearer ${token}`)
      .send({
        tipo: 'bostezo',
        timestamp: new Date().toISOString(),
        probabilidad: 80,
        sesionId: sesion.id,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.tipo).toBe('bostezo');
    expect(res.body.probabilidad).toBe(80);
  });

  test('❌ Error si falta campo requerido', async () => {
    const res = await request(app)
      .post('/eventos')
      .set('Authorization', `Bearer ${token}`)
      .send({
        tipo: 'parpadeo',
        timestamp: new Date().toISOString(),
        // falta sesionId
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  test('❌ Error si la sesión no pertenece al usuario', async () => {
    const otro = await prisma.user.create({
      data: { email: 'otro@test.com', password: await bcrypt.hash('123456', 10) },
    });

    const sesionAjena = await prisma.sesion.create({
      data: {
        userId: otro.id,
        fechaInicio: new Date(),
      },
    });

    const res = await request(app)
      .post('/eventos')
      .set('Authorization', `Bearer ${token}`)
      .send({
        tipo: 'microsueno',
        timestamp: new Date().toISOString(),
        probabilidad: 90,
        sesionId: sesionAjena.id,
      });

    expect(res.statusCode).toBe(403);
    expect(res.body.error).toBe('No autorizado para registrar en esta sesión');

    // 🧼 Limpieza de la sesión ajena
    await prisma.evento.deleteMany({ where: { sesionId: sesionAjena.id } });
    await prisma.sesion.delete({ where: { id: sesionAjena.id } });
  });
});
