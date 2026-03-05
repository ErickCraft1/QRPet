import { Router } from "express";
import { PetController } from "../controllers/qr.controller.js";
import { upload } from "../utils/multer.js";

const qrRouter = Router();

qrRouter.get("/", PetController.getIndex);
qrRouter.post("/api/qr", upload.single("petImage"), PetController.createPet);
qrRouter.get("/mascota/:id", PetController.getPetById);
qrRouter.get("/api/debug", PetController.getDebugData);

export default qrRouter;
