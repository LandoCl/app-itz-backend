import express from "express";
import multer from "multer";
import {
  createRestaurante,
  getRestaurante,
  searchRestaurante,
  updateRestaurante,
} from "../controllers/restauranteController.js";
import { jwtCheck, jwtParse } from "../middleware/auth.js";
import { validateRestauranteRequest } from "../middleware/validation.js";
import { param } from "express-validator";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, //5mb
  },
});
router.get("/", jwtCheck, jwtParse, getRestaurante);

router.post(
  "/",
  jwtCheck,
  jwtParse,
  upload.single("imageFile"),
  validateRestauranteRequest,
  createRestaurante,
);

router.put(
  "/",
  jwtCheck,
  jwtParse,
  upload.single("imageFile"),
  validateRestauranteRequest,
  updateRestaurante,
);

router.get(
  "/search/:city",
  param("city")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("El parametro ciudad debe ser un string valido"),
  searchRestaurante,
);

export default router;
