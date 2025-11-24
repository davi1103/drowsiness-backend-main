// middlewares/performanceMiddleware.js
// ============================================================
// 📌 Middleware de Monitoreo de Rendimiento + Huella de Carbono
// ------------------------------------------------------------
// Este middleware se ejecuta automáticamente en cada request,
// registrando:
//
// ✔ Tiempo total de respuesta (ms)
// ✔ CPU actual del servidor
// ✔ RAM disponible
// ✔ CO₂ estimado generado durante el request
//
// Funciona perfectamente tanto en:
//   🚀 Railway (producción → logs en panel "Logs")
//   💻 Local (archivo performance.log)
// ============================================================

import { performance } from "perf_hooks";        // Para medir tiempo de ejecución
import fs from "fs";                             // Para escribir logs en archivo
import { getSystemUsage } from "../utils/performance.js"; // CPU y RAM
import { estimateCarbon } from "../utils/carbon.js";      // CO₂e estimado

export default async function performanceMiddleware(req, res, next) {
  // Tiempo inicial
  const start = performance.now();

  // Callback cuando la respuesta se complete
  res.on("finish", async () => {
    // Tiempo total de procesamiento del request
    const duration = (performance.now() - start).toFixed(2);

    // Métricas del sistema
    const usage = await getSystemUsage();

    // Convertimos "12.45%" → 12.45
    const cpuNumber = parseFloat(usage.cpu.replace("%", ""));

    // Cálculo del CO₂ en gramos
    const carbon = estimateCarbon(cpuNumber);

    // Texto del log
    const log = `[${new Date().toISOString()}] ${req.method} ${
      req.originalUrl
    } | Duración: ${duration}ms | CPU: ${usage.cpu} | RAM: ${usage.ram} | CO2: ${carbon} g\n`;

    // Mostrar en consola
    console.log(log);

    // Guardar en archivo local
    try {
      fs.appendFileSync("./performance.log", log);
    } catch (error) {
      console.error("❌ No se pudo guardar performance.log:", error.message);
    }
  });

  // Continuar con siguiente middleware
  next();
}
