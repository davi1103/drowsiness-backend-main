import { performance } from "perf_hooks";
import fs from "fs";
import { getSystemUsage } from "../utils/performance.js";

export async function performanceMiddleware(req, res, next) {
  const start = performance.now();

  res.on("finish", async () => {
    const duration = (performance.now() - start).toFixed(2);
    const usage = await getSystemUsage();

    const log = `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} | ${duration}ms | CPU: ${usage.cpu} | RAM: ${usage.ram}\n`;

    console.log(log);
    fs.appendFileSync("./performance.log", log);
  });

  next();
}
