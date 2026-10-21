import "dotenv/config";
import cors from "cors";
import express from "express";
import { router } from "./routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

// Só as origens listadas em FRONTEND_URLS (separadas por vírgula) recebem os headers de CORS
const allowedOrigins = (process.env.FRONTEND_URLS ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(express.json());
app.use(cors({ origin: allowedOrigins }));

app.use(router);

app.use(errorHandler);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Servidor rodando na porta http://localhost:${port}`);
});
