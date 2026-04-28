import { body, validationResult } from "express-validator";
import { type Request, type Response, type NextFunction } from "express";

const handleValidationErrors = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    //si hay errores en los datos del request
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const validateUserRequest = [
  body("name")
    .isString()
    .notEmpty()
    .withMessage("El nombre debe ser un string"),
  body("address")
    .isString()
    .notEmpty()
    .withMessage("La direccion debe ser un string"),
  body("city")
    .isString()
    .notEmpty()
    .withMessage("La ciudad debe ser un string"),
  body("country")
    .isString()
    .notEmpty()
    .withMessage("El pais debe ser un string"),
  handleValidationErrors,
];
