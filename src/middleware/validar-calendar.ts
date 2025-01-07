import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

export const validateCalendar = (req: Request, res: Response, next: NextFunction) => {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    res.status(400).json({ ok: false, error: err.mapped() });
    return;
  }
  next();
};
