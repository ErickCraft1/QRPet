import express from "express";
import {
  getIndex,
  saveQR,
  getPetById,
  upload,
  getDebugData,
} from "../controllers/qr.controller.js";

const router = express.Router();

router.get("/", getIndex);
router.post("/api/qr", upload.single("petImage"), saveQR);
router.get("/mascota/:id", getPetById);
router.get("/api/debug", getDebugData);

export default router;
