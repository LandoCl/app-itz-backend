import { Router } from "express";
import {
  createUser,
  getUser,
  updateUser,
} from "../controllers/userController.js";
import { jwtCheck, jwtParse } from "../middleware/auth.js";
import { validateUserRequest } from "../middleware/validation.js";

const router = Router();
//ruta para crear el usuario
router.post("/", jwtCheck, createUser);

//ruta para actualizar el usuario
router.put("/", jwtCheck, jwtParse, validateUserRequest, updateUser);

//ruta pra obtener un usuario
router.get("/", jwtCheck, jwtParse, getUser);
export default router;
