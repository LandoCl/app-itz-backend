import type { Request, Response } from "express";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose, { mongo } from "mongoose";
import morgan from "morgan";
import { v2 as cloudinary } from "cloudinary";

//Iniciamos dotenv
dotenv.config();

//Importamos archivo de rutas para usuarios
import userRoutes from "./routes/userRoutes.js";

//importamos archivo de rutas para el restaurante
import restauranteRoutes from "./routes/restauranteRoutes.js";
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
//configuracion del cloudinary
const cloud_name = process.env.CLOUDINARY_CLOUD_NAME || "";
const api_key = process.env.CLOUDINARY_API_KEY || "";
const api_secret = process.env.CLOUDINARY_API_SECRET || "";
cloudinary.config({
  cloud_name: cloud_name,
  api_key: api_key,
  api_secret: api_secret,
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
app.use("/api/restaurante", restauranteRoutes);
const port = process.env.port || 3000;
app.listen(port, () => {
  console.log("App corriendo en el puerto: " + port);
});
