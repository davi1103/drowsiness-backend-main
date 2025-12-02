# 📘 Registro de Prácticas Sostenibles  
## Proyecto: Sistema de Detección de Somnolencia en Tiempo Real  
### Última actualización: 2025-11-24  

Este documento consolida todas las prácticas sostenibles implementadas en el backend del sistema, así como las mejoras progresivas orientadas a optimizar el consumo energético, reducir la huella de carbono, minimizar la transferencia de datos y mantener un mantenimiento verde continuo.  

---

# 1. 🌱 Prácticas sostenibles aplicadas

## 1.1 Perfilado energético y monitoreo automático (Fase 3.2 y 5.1)
**Fecha:** 2025-11-18  
**Archivos relacionados:**  
- `middlewares/performanceMiddleware.js`  
- `utils/performance.js`  

**Implementación:**  
- Se añadió un middleware de perfilado energético que registra por cada request:  
  - Tiempo de respuesta  
  - Uso de CPU  
  - Uso de memoria RAM  
- Los registros se envían a consola (Railway) y a `performance.log` en local.  
- Permite identificar picos de consumo y optimizar funciones críticas.  

**Evidencia:**  
- Figuras de perfilado incluidas en el informe (muestras de logs).  

---

## 1.2 Estimación inicial de huella de carbono (Fase 5.1)
**Fecha:** 2025-11-18  
**Archivos:**  
- `utils/carbon.js`  

**Implementación:**  
- Se añadió una función que calcula una estimación aproximada de emisiones en gCO₂eq basadas en el uso de CPU.  
- Actualmente funciona como monitoreo informativo y base para futuras integraciones con APIs oficiales.

---

## 1.3 Reducción de transferencia de datos (Fase 4.4)
**Fecha:** 2025-11-19  

**Implementación:**  
- Las respuestas del backend se mantienen en formato **JSON liviano**, evitando estructuras pesadas.  
- No se transmiten imágenes ni archivos multimedia.  
- Se beneficia de la **compresión HTTP automática** activada por Railway.

**Impacto:**  
- Menor tráfico de red.  
- Menor consumo energético asociado a transmisión de datos.

---

## 1.4 Optimización del pool de conexiones (Fase 4.3)
**Fecha:** 2025-11-20  
**Cambios:**  
- Se configuró la variable `DATABASE_POOL_SIZE = 5` en Railway.  
- Prisma gestiona un pool reducido, evitando asignación excesiva de recursos.  

**Resultado:**  
- Menor uso de CPU en periodos de carga.  
- Latencia más estable.  

---

## 1.5 Uso de proveedores cloud con energía renovable (Fase 4.1 y 5.3)
**Fecha:** 2025-11-21  

**Implementación:**  
- **Backend alojado en Railway**, corriendo sobre infraestructura de **Google Cloud / AWS**, ambos con compromisos públicos de reducción de carbono.  
- **Frontend alojado en Vercel**, que usa arquitectura serverless de bajo consumo en reposo.  

**Referencias:**  
- AWS Sustainability (2023)  
- Microsoft Environmental Sustainability (2023)  
- Vercel Green Energy Policy (2023)

---

## 1.6 Activación de métricas del proveedor (Fase 5.5)
**Fecha:** 2025-11-23  
**Acciones:**  
- Se activaron las métricas de Railway para monitorear:  
  - CPU  
  - RAM  
  - Tráfico de red  
  - Solicitudes  
  - Latencia  
  - Tasa de errores  

**Evidencias:**  
- Capturas incluidas en el informe (CPU, RAM, red y requests).  
- Datos usados para validar estabilidad energética y oportunidades de mejora.

---

# 2. 🔄 Actualizaciones sostenibles realizadas

## 2.1 Modularización y refactorización (Fase 3.3)
**Fecha:** 2025-11-18  
- Código reorganizado en módulos pequeños.  
- Eliminación de duplicaciones.  
- Mejoras en rendimiento de operaciones repetitivas.  
- Incremento de mantenibilidad y reducción de deuda técnica.  

---

## 2.2 Restricción de sesiones concurrentes (Fase 3.3)
**Fecha:** 2025-11-19  
- Se evita crear múltiples sesiones activas por usuario.  
- Reduce almacenamiento innecesario y procesos paralelos innecesarios.

---

## 2.3 Optimización de consultas Prisma
**Fecha:** 2025-11-20  
- Uso de `include` selectivo en consultas.  
- Reducción de lecturas innecesarias a la base de datos.

---

# 3. 📊 Evidencias internas de sostenibilidad

## 3.1 Registros de rendimiento
- Guardados automáticamente en `performance.log` (solo local).  
- Railway guarda los logs en su consola interna.  

## 3.2 Gráficos del proveedor  
- CPU promedio estable entre **0 % – 0.6 %**.  
- Memoria alrededor de **50 MB – 80 MB**, comportamiento estable.  
- Tráfico reducido (<300 KB).  
- Respuestas en menos de 100 ms en p50/p90.  

---

# 4. 🧭 Plan de mejoras sostenibles futuras (Roadmap Verde)

- Integrar medición de huella de carbono mediante APIs certificadas.  
- Implementar rotación de logs para evitar archivos pesados.  
- Agregar dashboards internos de eficiencia energética.  
- Evaluar moversión a infraestructura **carbon-neutral regions** en Google Cloud.  
- Alertas automáticas cuando el consumo exceda umbrales definidos.

---

# 5. 📝 Declaración final

Este registro funciona como documentación continua del mantenimiento verde del proyecto, complementando el capítulo de Software Verde del informe final. Todas las prácticas descritas están implementadas, activas y verificadas en el entorno de producción (Railway) y desarrollo local.

