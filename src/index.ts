import type { Request, Response } from "express";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose, { mongo } from "mongoose";
import morgan from "morgan";

//Iniciamos dotenv
dotenv.config();

//Importamos archivo de rutas para usuarios
import userRoutes from "./routes/userRoutes.js";
//Nos nocectamos a la BD
mongoose
  .connect(process.env.DB_CONNECTION_STRING as string)
  .then(() => {
    console.log("Base de datos conectada correctamente");
    console.log(process.env.DB_CONNECTION_STRING);
  })
  .catch((error) => {
    console.log("Error al conectar a la base de datos");
    console.log(error);
  });

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.get("/health", async (req: Request, res: Response) => {
  res.send({ message: "!Servidor OK!" });
});
//Request objeto para recibir datos del front
//Response objeto para enviar datos de respuesta al Front
app.get("/", async (req: Request, res: Response) => {
  res.redirect("/health");
});
app.use("/api/user", userRoutes);
const port = process.env.port || 3000;
app.listen(port, () => {
  console.log("App corriendo en el puerto: " + port);
});
