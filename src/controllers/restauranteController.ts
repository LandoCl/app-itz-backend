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

export const searchRestaurante = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const city = req.params.city as string;
    const searchQuery = (req.query.searchQuery as string) || "";
    const selectedCuisines = (req.query.selectedCuisines as string) || "";
    const sortOptions = (req.query.sortOptions as string) || "lastUpdated";
    const page = parseInt(req.query.page as string) || 1;

    let query: any = {};

    query["city"] = new RegExp(city, "i");

    const cityCheck = await Restaurante.countDocuments(query);

    if (cityCheck === 0) {
      return res.status(404).json({
        data: [],
        pagination: {
          total: 0,
          page: 1,
          pages: 1,
        },
      });
    }

    if (selectedCuisines) {
      const cuisinesArray = selectedCuisines
        .split(",")
        .map((cuisine) => new RegExp(cuisine, "i"));
      query["cuisines"] = { $all: cuisinesArray };
    }

    if (searchQuery) {
      const searchRegex = new RegExp(searchQuery, "i");
      query["$or"] = [
        { restauranteName: searchRegex },
        { cuisines: { $in: [searchRegex] } },
      ];
    }
    const pageSize = 10;

    const skip = (page - 1) * pageSize;

    const restaurantsSearchResult = await Restaurante.find(query)
      .sort({ [sortOptions]: 1 })
      .skip(skip)
      .limit(pageSize)
      .lean();
    const total = await Restaurante.countDocuments(query);

    const response = {
      data: restaurantsSearchResult,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / pageSize),
      },
    };
    res.json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al buscar el restaurante" });
  }
};
