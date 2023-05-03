import { Request, Response, NextFunction } from "express";
import { body, validationResult, param } from "express-validator";
import { responseApp } from "../helpers/utils";


export const validateAuth = [
    body('email')
        .notEmpty().withMessage('El campo email es obligatorio')
        .isEmail().withMessage("El email no es valido"),
    body('password')
        .notEmpty().withMessage('El campo contraseña es obligatorio')
        .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) return res.json(responseApp(false, "Parametros no validos", "n/a", errors.array()))

        next();
    }
]

