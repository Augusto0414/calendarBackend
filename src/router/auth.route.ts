import { Router } from "express";
import { authController } from "../controller/auth.controller";
import { check } from "express-validator";
import { validateCampos } from "../middleware/validate-campos";
import { validarJWT } from "../middleware/validar-jwt";

const routes: Router = Router();

// check is middleware and check routes
routes.post(
  "/new",
  [
    check("name", "nombre de usuario es obligatorio").not().isEmpty(),
    check("email", "correo de usuario es obligatorio").not().isEmpty(),
    check("password", "contraseña de usuario es obligatorio").not().isEmpty(),
    check("password", "password del usuario debe de contener minimo 7 caracteres").isLength({ min: 7 }),
    validateCampos,
  ],
  authController.createUser
);

routes.post(
  "/auth",
  [
    check("email", "correo del usuario es obligatorio").not().isEmpty(),
    check("password", "password del usuario es obligatorio").not().isEmpty(),
    check("password", "password del usuario debe de contener minimo 7 caracteres").isLength({ min: 7 }),
    validateCampos,
  ],
  authController.loginUsuario
);
routes.get("/renew", validarJWT, authController.revalidateToken);

export default routes;
