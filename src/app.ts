import express from "express";
import cors from "cors";
import router from "./router/index.routes";
import dotenv from "dotenv";
import { conectionDB } from "./database/config";

dotenv.config();
const app = express();
conectionDB();

const PORT = process.env.PORT || 3001;
app.use(cors());

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);
app.set("port", PORT);

export default app;
