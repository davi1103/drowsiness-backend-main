import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import app from './testServer.js';

const prisma = new PrismaClient();
const JWT_SECRET = 'mi_super_clave_secreta_123';

describe('📌 Pruebas de la ruta /sesiones', () => {
  let user;
  let token;
  let sesionId;

  beforeAll(async () => {
    // Elimina solo los datos de prueba (usuarios específicos)
    await prisma.evento.deleteMany({
      where: {
        sesion: {
          user: {
            email: { in: ['sesion@test.com'] }
          }
        }
      }
    });

    await prisma.sesion.deleteMany({
      where: {
        user: {
          email: 'sesion@test.com'
        }
      }
    });

    await prisma.user.deleteMany({
      where: {
        email: 'sesion@test.com'
      }
    });

    // Crear usuario
    const hashed = await bcrypt.hash('123456', 10);
    user = await prisma.user.create({
      data: { email: 'sesion@test.com', password: hashed }
    });

    token = jwt.sign({ userId: user.id }, JWT_SECRET);
  });

  afterAll(async () => {
    // Limpieza al terminar
    await prisma.evento.deleteMany({
      where: {
        sesion: {
          userId: user.id
        }
      }
    });
    await prisma.sesion.deleteMany({ where: { userId: user.id } });
    await prisma.user.delete({ where: { id: user.id } });
    await prisma.$disconnect();
  });

  test('✅ Crear nueva sesión', async () => {
    const res = await request(app)
      .post('/sesiones')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(201);
    expect(res.body.userId).toBe(user.id);
    sesionId = res.body.id;
  });

  test('❌ No permitir sesión duplicada activa', async () => {
    const res = await request(app)
      .post('/sesiones')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Ya hay una sesión activa');
  });

  test('✅ Obtener todas las sesiones del usuario', async () => {
    const res = await request(app)
      .get('/sesiones')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].userId).toBe(user.id);
  });

  test('✅ Obtener sesión específica por ID', async () => {
    const res = await request(app)
      .get(`/sesiones/${sesionId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(sesionId);
  });

  test('✅ Finalizar sesión correctamente', async () => {
    const res = await request(app)
      .patch(`/sesiones/${sesionId}/finalizar`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        fechaFin: new Date().toISOString(),
        duracion: 360,
        nivelMax: 85,
        promedio: 56.5,
        eventosTotales: 12
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.fechaFin).toBeDefined();
    expect(res.body.duracion).toBe(360);
  });
});
