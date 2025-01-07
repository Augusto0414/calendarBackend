import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JWTPayload {
  name: string;
  uid: string;
}

declare global {
  namespace Express {
    interface Request {
      uid?: string;
      name?: string;
    }
  }
}

const validarJWT = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("x-token");

  if (!token) {
    res.status(401).json({ ok: false, message: "Token requerido" });
    return;
  }

  if (!process.env.JWT_SECRET) {
    res.status(500).json({
      ok: false,
      message: "No se ha configurado la variable de entorno SECRET_JWT_SEED",
    });
    return;
  }

  try {
    const { name, uid } = jwt.verify(token, process.env.JWT_SECRET) as JWTPayload;
    req.uid = uid;
    req.name = name;
    next();
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "Error de verificación del token",
    });
    return;
  }
};

export { validarJWT };
