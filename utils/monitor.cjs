// ============================================================
// 🧪 MONITOR DE CONSUMO DE RECURSOS (CPU + RAM)
// ------------------------------------------------------------
// Este script permite medir el uso promedio de recursos del
// backend como evidencia de eficiencia energética.
//
// ✔ Se usa solo cuando se necesita
// ✔ No afecta el rendimiento de la API
// ✔ Compatible con Railway y entorno local
// ============================================================

const os = require("os-utils");

// Intervalo de medición en segundos
const INTERVALO = 5;

console.log("\n=== MONITOR DE CONSUMO DEL BACKEND ===\n");

setInterval(() => {
  os.cpuUsage(cpu => {
    const cpuPercent = (cpu * 100).toFixed(2);
    const ramPercent = ((1 - os.freememPercentage()) * 100).toFixed(2);
    const fecha = new Date().toLocaleString();

    console.log(`[${fecha}] CPU: ${cpuPercent}% | RAM: ${ramPercent}%`);
  });
}, INTERVALO * 1000);
