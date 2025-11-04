// ===========================================================
// 🔐 RUTAS DE AUTENTICACIÓN (Registro y Login con username)
// ===========================================================

import express from "express";
import bcrypt from "bcryptjs";          // Para encriptar contraseñas
import jwt from "jsonwebtoken";         // Para generar tokens de sesión
import { PrismaClient } from "@prisma/client"; // ORM para conectar con PostgreSQL

const router = express.Router();
const prisma = new PrismaClient();

// ====================== CONFIGURACIÓN ======================
// Se obtiene la clave secreta del archivo .env
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("❌ JWT_SECRET no está definida en las variables de entorno.");
}

// ===================== VALIDACIÓN USERNAME =================
// Solo permite letras, números y guiones bajos, entre 4 y 16 caracteres.
function validarUsername(username) {
  const regex = /^[a-zA-Z0-9_]{4,16}$/;
  return regex.test(username);
}

// ===================== REGISTRO =============================
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Verifica que ambos campos estén completos
    if (!username || !password) {
      return res.status(400).json({ error: "Usuario y contraseña son requeridos." });
    }

    // Valida el formato del username
    if (!validarUsername(username)) {
      return res.status(400).json({
        error:
          "El nombre de usuario debe tener entre 4 y 16 caracteres y solo puede contener letras, números o guiones bajos.",
      });
    }

    // Busca si ya existe el usuario en la base de datos
    const usuarioExistente = await prisma.user.findUnique({ where: { username } });
    if (usuarioExistente) {
      return res.status(409).json({ error: "El nombre de usuario ya está en uso." });
    }

    // Encripta la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crea el nuevo usuario en la base de datos
    await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    res.json({ message: "✅ Usuario registrado correctamente." });
  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({ error: "Error al registrar el usuario." });
  }
});

// ===================== LOGIN ================================
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Verifica que ambos campos estén completos
    if (!username || !password) {
      return res.status(400).json({ error: "Usuario y contraseña son requeridos." });
    }

    // Busca el usuario en la base de datos
    const usuario = await prisma.user.findUnique({ where: { username } });
    if (!usuario) {
      return res.status(401).json({ error: "Credenciales inválidas." });
    }

    // Compara la contraseña ingresada con la guardada (hash)
    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida) {
      return res.status(401).json({ error: "Credenciales inválidas." });
    }

    // Genera un token JWT válido por 12 horas
    const token = jwt.sign(
      { userId: usuario.id, username: usuario.username },
      JWT_SECRET,
      { expiresIn: "12h" }
    );

    // ✅ Devuelve token, userId y username
    res.json({
      message: "Inicio de sesión exitoso.",
      token,
      userId: usuario.id,          // 👈 agregado
      username: usuario.username,  // 👈 alias visible
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ error: "Error al iniciar sesión." });
  }
});


// ===========================================================
// Exportar el router para usarlo en app.js o server.js
// ===========================================================
export default router;
