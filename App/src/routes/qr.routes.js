import express from "express";
import {
  getIndex,
  saveQR,
  getPetById,
  upload,
} from "../controllers/qr.controller.js";

const router = express.Router();

router.get("/", getIndex);
router.post("/api/qr", upload.single("petImage"), saveQR);
router.get("/mascota/:id", getPetById);

export default router;
