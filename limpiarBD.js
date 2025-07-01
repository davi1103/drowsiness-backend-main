import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function limpiarBD() {
  try {
    // El orden es importante por las relaciones
    await prisma.evento.deleteMany({});
    await prisma.sesion.deleteMany({});
    await prisma.user.deleteMany({}); // ← Finalmente, borra los usuarios

    console.log("✅ Toda la base de datos ha sido limpiada (sin borrar tablas)");
  } catch (error) {
    console.error("❌ Error al limpiar la base de datos:", error);
  } finally {
    await prisma.$disconnect();
  }
}

limpiarBD();
