import { Request, Response } from "express";
import User from "../models/userModel.js";
//Funcion para crear un usuario
export const createUser = async (req: Request, res: Response): Promise<any> => {
  //1. Verificar sl el usuario ya existe
  //2. Crear el usuario si no existe
  //3. Regresar los datos del usuario al cliente (frontend) -> Response
  try {
    const { auth0Id } = req.body;
    const existingUser = await User.findOne({ auth0Id });
    if (existingUser) {
      return res.status(200).json(existingUser.toObject());
    }
    const newUser = new User(req.body);
    await newUser.save();
    return res.status(201).json(newUser.toObject());
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error al crear el usuario" });
  }
};
//Funcion para actualizar el perfil del usuario
export const updateUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, address, city, country } = req.body;
    //Obtenemos los datos del usuario que inicio sesion
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }
    user!.name = name;
    user!.address = address;
    user!.city = city;
    user!.country = country;
    //Guardamos el usuario en la base de datos
    await user.save();
    res.send(user); //Enviamos al frontend los datos del usuario guardado
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error al actualizar el usuario" });
  }
};
//funcion para obtener los datos de un usuario
export const getUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const currentUser = await User.findById({ _id: req.userId });

    if (!currentUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json(currentUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al obtener el usuario" });
  }
};
