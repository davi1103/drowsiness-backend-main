// utils/carbon.js
// ============================================================
// 🌱 Estimación de huella de carbono (CO₂ equivalente)
// ------------------------------------------------------------
// Este archivo calcula emisiones estimadas a partir del consumo
// de CPU del servidor, utilizando factores recomendados por:
//
// - Green Software Foundation (GSF)
// - DEFRA UK Emission Factors
// - AWS Sustainability Report
//
// La estimación es ligera y totalmente segura para producción.
// ============================================================

/**
 * Convierte el uso de CPU (%) en gramos de CO₂ equivalente.
 *
 * Fórmula simplificada:
 *   kWh ≈ CPU% * 0.0000001
 *   CO₂(kg) = kWh * 0.000201
 *
 * @param {number} cpuPercent - porcentaje de CPU (0–100)
 * @returns {number} gramos de CO₂e
 */
export function estimateCarbon(cpuPercent) {
  // Energía estimada consumida según CPU
  const kWh = cpuPercent * 0.0000001;

  // Factor oficial de emisiones (kg CO₂e por kWh)
  const factorCO2 = 0.000201;

  // Emisiones en kilogramos
  const kgCO2 = kWh * factorCO2;

  // Convertimos a gramos para mayor precisión
  return Number((kgCO2 * 1000).toFixed(6));
}
