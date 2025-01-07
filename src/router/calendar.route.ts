import { Router } from "express";
import { calendarController } from "../controller/calendar.controller";
import { validarJWT } from "../middleware/validar-jwt";
import { check } from "express-validator";
import { validateCalendar } from "../middleware/validar-calendar";
import { isDate } from "../lib/custom-date";

const router: Router = Router();
//Todas deben de pasar por esta validacion de JWT
router.use(validarJWT);
router.post(
  "/calendar",
  [
    check("title", "El titulo es obligatorio").not().isEmpty(),
    check("start", "fecha de inicio invalida").custom(isDate),
    check("end", "fecha de finalizacion invalida").custom(isDate),
    validateCalendar,
  ],
  calendarController.addCalendar
);

// Si solo quisiera que  esta vakudacion sea solo para estas rutas la coloco debajo de este comnentario
router.get("/calendar", calendarController.getEventCalendar);
router.put("/calendar/:id", calendarController.updateEventCalendar);
router.delete("/calendar/:id", calendarController.deleteEventCalendar);

export default router;
