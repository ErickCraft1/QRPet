import multer from "multer";
import path from "path";
import { randomUUID } from "node:crypto";

const storage = multer.diskStorage({
  destination: "App/uploads",
  filename: (req, file, cb) => {
    const uniqueName = randomUUID() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

export const upload = multer({ storage });
