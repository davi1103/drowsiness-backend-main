// utils/performance.js
// ============================================================
// 🔍 Métricas de uso del sistema (CPU y RAM)
// ------------------------------------------------------------
// Este módulo obtiene el uso actual de CPU y RAM utilizando
// la librería "os-utils", ideal para monitorear rendimiento
// en backends livianos como el tuyo.
// Compatible con ES Modules.
// ============================================================

import os from "os-utils";

/**
 * Obtiene porcentaje de CPU y RAM del sistema.
 * @returns {Promise<{cpu: string, ram: string}>} valores en porcentaje.
 */
export function getSystemUsage() {
  return new Promise((resolve) => {
    // El método cpuUsage retorna un valor entre 0 y 1
    os.cpuUsage((cpuPercent) => {
      resolve({
        cpu: (cpuPercent * 100).toFixed(2) + "%",              // CPU en %
        ram: (os.freememPercentage() * 100).toFixed(2) + "%",  // RAM libre en %
      });
    });
  });
}
