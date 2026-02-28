import express from "express";
import cors from "cors";
import qrRoutes from "./routes/qr.routes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("App/src/views"));
app.use("/uploads", express.static("App/src/models/local/uploads"));

// Rutas
app.use("/", qrRoutes);

export default app;
