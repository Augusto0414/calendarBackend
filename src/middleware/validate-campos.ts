import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { validateEmail } from "../lib/email-validator";

const validateCampos = (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  const err = validationResult(req);

  if (!err.isEmpty()) {
    res.status(400).json({ ok: false, errors: err.mapped() });
    return;
  }
  if (!validateEmail(email)) {
    res.status(400).json({ error: "email inválido!" });
    return;
  }

  next();
};

export { validateCampos };
