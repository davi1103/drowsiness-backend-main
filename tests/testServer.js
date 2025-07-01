
import express from "express";
import dotenv from "dotenv";
import authRoutes from "../routes/auth.js";
import eventoRoutes from "../routes/eventos.js";
import sesionRoutes from "../routes/sesiones.js";
import { autenticarToken } from "../middlewares/authMiddleware.js";


dotenv.config();

const app = express();

// Middlewares
app.use(express.json());

// Rutas
app.use("/auth", authRoutes);
app.use("/eventos", autenticarToken, eventoRoutes);
app.use("/sesiones", autenticarToken, sesionRoutes);


export default app;
