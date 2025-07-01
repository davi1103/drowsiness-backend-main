-- CreateTable
CREATE TABLE "Sesion" (
    "id" TEXT NOT NULL,
    "fechaInicio" TIMESTAMP(3) NOT NULL,
    "fechaFin" TIMESTAMP(3),
    "duracion" INTEGER,
    "nivelMax" INTEGER,
    "promedio" DOUBLE PRECISION,
    "eventosTotales" INTEGER,

    CONSTRAINT "Sesion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Evento" (
    "id" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "probabilidad" INTEGER NOT NULL,
    "sesionId" TEXT NOT NULL,

    CONSTRAINT "Evento_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Evento" ADD CONSTRAINT "Evento_sesionId_fkey" FOREIGN KEY ("sesionId") REFERENCES "Sesion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
