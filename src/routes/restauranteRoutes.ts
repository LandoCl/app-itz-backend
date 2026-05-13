import express from "express";
import multer from "multer";
import {
  createRestaurante,
  getRestaurante,
  updateRestaurante,
} from "../controllers/restauranteController.js";
import { jwtCheck, jwtParse } from "../middleware/auth.js";
import { validateRestauranteRequest } from "../middleware/validation.js";

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

export default router;
