import calendarRoutes from "./calendar.route";
import authRoutes from "./auth.route";
import { Router } from "express";

const routes: Router = Router();

routes.use(authRoutes);
routes.use(calendarRoutes);

export default routes;
