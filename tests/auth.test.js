import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import app from './testServer.js'; 

const prisma = new PrismaClient();

describe("\uD83D\uDD2A Rutas de autenticaci\u00f3n (/auth)", () => {
  const testEmail = "test@example.com";
  const testPassword = "123456";

  // Limpia el usuario antes de cada test
  beforeEach(async () => {
    await prisma.user.deleteMany({ where: { email: testEmail } });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test("\u2705 Registro exitoso", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({ email: testEmail, password: testPassword });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Usuario registrado correctamente");

    const userInDb = await prisma.user.findUnique({ where: { email: testEmail } });
    expect(userInDb).not.toBeNull();
    expect(await bcrypt.compare(testPassword, userInDb.password)).toBe(true);
  });

  test("\u274C Registro con email existente", async () => {
    // Primero se registra correctamente
    await prisma.user.create({
      data: {
        email: testEmail,
        password: await bcrypt.hash(testPassword, 10),
      },
    });

    // Intenta registrar con el mismo email
    const res = await request(app)
      .post("/auth/register")
      .send({ email: testEmail, password: testPassword });

    expect(res.statusCode).toBe(409);
    expect(res.body.error).toBe("El email ya est\u00e1 registrado");
  });

  test("\u2705 Login exitoso", async () => {
    const hashed = await bcrypt.hash(testPassword, 10);
    const user = await prisma.user.create({
      data: { email: testEmail, password: hashed },
    });

    const res = await request(app)
      .post("/auth/login")
      .send({ email: testEmail, password: testPassword });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.userId).toBe(user.id);
  });

  test("\u274C Login con contrase\u00f1a incorrecta", async () => {
    const hashed = await bcrypt.hash(testPassword, 10);
    await prisma.user.create({
      data: { email: testEmail, password: hashed },
    });

    const res = await request(app)
      .post("/auth/login")
      .send({ email: testEmail, password: "wrongpass" });

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe("Credenciales inv\u00e1lidas");
  });

  test("\u274C Login con usuario no existente", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "noexiste@x.com", password: "1234" });

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe("Credenciales inv\u00e1lidas");
  });
});
