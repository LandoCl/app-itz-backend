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

export const validateRestauranteRequest = [
  body("restauranteName")
    .notEmpty()
    .withMessage("El nombre del restaurante es requerido"),
  body("city").notEmpty().withMessage("La ciudad es requerida"),
  body("country").notEmpty().withMessage("El pais es requerido"),
  body("deliverPrice")
    .isFloat({ min: 0 })
    .withMessage("El precio de entrega debe ser un numero positivo"),
  body("estimatedDeliveryTime")
    .isFloat({ min: 0 })
    .withMessage("El tiempo de entrega debe ser un numero positivo"),
  body("cuisines")
    .isArray()
    .withMessage("El tipo se cocina debe ser un arreglo")
    .not()
    .isEmpty()
    .withMessage("El arreglo de cocinas no puede estar vacio"),
  body("menuItems").isArray().withMessage("Los platillos deben ser un arreglo"),
  body("menuItems.*.name")
    .notEmpty()
    .withMessage("El nombre del item del menu es requerido"),
  body("menuItems.*.price")
    .notEmpty()
    .withMessage("El precio del item del menu es requerido"),
  handleValidationErrors,
];
