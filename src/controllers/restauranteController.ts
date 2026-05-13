import Restaurante from "../models/restauranteModels.js";
import type { Request, Response } from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import mongoose from "mongoose";

export const getRestaurante = async (req: Request, res: Response) => {
  try {
    const restaurante = await Restaurante.findOne({ user: req.userId });
    if (!restaurante) {
      res.status(404).json({ message: "Restaurante no encontrado" });
    }
    res.json(restaurante);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error al obtener los datos de un restaurante" });
  }
};

export const createRestaurante = async (req: Request, res: Response) => {
  try {
    const existingRestaurante = await Restaurante.findOne({ user: req.userId });

    if (existingRestaurante) {
      return res
        .status(409)
        .json({ message: "El restaurante para este usuario ya existe" });
    }

    const imageUrl = await uploadImage(req.file as Express.Multer.File);

    const restaurante = new Restaurante(req.body);
    restaurante.imageUrl = imageUrl;
    restaurante.user = new mongoose.Types.ObjectId(req.userId);
    restaurante.lastUpdated = new Date();

    await restaurante.save();
    res.status(201).json(restaurante);
  } catch (error) {
    console.error("Error al crear el restaurante:", error);
    res.status(500).json({ message: "Error al crear el restaurante" });
  }
};

export const updateRestaurante = async (req: Request, res: Response) => {
  try {
    let restaurante = await Restaurante.findOne({ user: req.userId });

    if (!restaurante) {
      res.status(404).json({ message: "Restaurante no encontrado" });
    }
    restaurante!.restauranteName = req.body.restauranteName;
    restaurante!.city = req.body.city;
    restaurante!.country = req.body.country;
    restaurante!.deliverPrice = req.body.deliverPrice;
    restaurante!.estimatedDeliveryTime = req.body.estimatedDeliveryTime;
    restaurante!.cuisines = req.body.cuisines;
    restaurante!.menuItems = req.body.menuItems;
    restaurante!.lastUpdated = new Date();
    if (req.file) {
      const imageUrl = await uploadImage(req.file as Express.Multer.File);
      restaurante!.imageUrl = imageUrl;
    }

    await restaurante?.save();
    res.status(200).send(restaurante);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al actualizar el restaurante" });
  }
};

const uploadImage = async (file: Express.Multer.File) => {
  const image = file;
  const base64Image = Buffer.from(image.buffer).toString("base64");
  const dataUri = "data:" + image.mimetype + ";base64," + base64Image;

  const uploadResponse = await cloudinary.v2.uploader.upload(dataUri);

  return uploadResponse.url;
};
