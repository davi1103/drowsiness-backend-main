import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import eventosRouter from './routes/eventos.js';
import sesionesRouter from './routes/sesiones.js';
import authRouter from './routes/auth.js';
import { performanceMiddleware } from "./middlewares/performanceMiddleware.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(performanceMiddleware); // Activación global

// Ruta de prueba para saber si el servidor está funcionando
app.get('/', (req, res) => {
  res.send('✅ API de detección de somnolencia funcionando');
});

// Montaje de rutas
app.use('/eventos', eventosRouter);
app.use('/sesiones', sesionesRouter);
app.use('/auth', authRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
