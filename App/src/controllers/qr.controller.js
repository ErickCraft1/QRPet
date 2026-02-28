import multer from "multer";
import path from "path";

import fs from "fs";
import crypto from "crypto";

export const getIndex = (req, res) => {
  res.sendFile("index.html", { root: "App/src/views" });
};

const storage = multer.diskStorage({
  destination: "App/src/models/local/uploads",
  filename: (req, file, cb) => {
    const uniqueName = crypto.randomUUID() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const FILE_PATH = "App/src/models/local/pets.json";

export const saveQR = (req, res) => {
  const { petName, petBreed, petAge, ownerContact } = req.body;
  const id = crypto.randomUUID();
  // Leer archivo existente o crear array vacío
  let data = [];
  if (fs.existsSync(FILE_PATH)) {
    data = JSON.parse(fs.readFileSync(FILE_PATH));
  }

  const petImage = req.file ? `/uploads/${req.file.filename}` : null;

  //Agregar nueva mascota
  data.push({ id, petName, petBreed, petAge, ownerContact, petImage });

  // Guardar de nuevo en el archivo
  fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
  res.json({ id, message: "Mascota guardada exitosamente" });
};

export const getPetById = (req, res) => {
  const { id } = req.params;
  const data = JSON.parse(fs.readFileSync(FILE_PATH, "utf-8"));
  const pet = data.find((p) => p.id === id);
  if (!pet) return res.status(404).json({ message: "Mascota no encontrada" });

  // Enviar una página HTML con los datos de la mascota
  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head><meta charset="UTF-8"><title>${pet.petName} - QRPet</title></head>
    <body>
      <h1>¡Encontraste a ${pet.petName}!</h1>
      <figure>
        ${pet.petImage ? `<img src="${pet.petImage}" alt="${pet.petName}" width="300">` : ""}
      </figure>
      <p>Raza: ${pet.petBreed}</p>
      <p>Edad: ${pet.petAge} años</p>
      <button id="contactBtn">Contactar al dueño por WhatsApp</button>
      <script>
        document.getElementById("contactBtn").addEventListener("click", () => {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              const { latitude, longitude } = pos.coords;
              const msg = encodeURIComponent(
                "Hola, encontré a tu mascota ${pet.petName}. Estoy en https://www.google.com/maps?q=" + latitude + "," + longitude
              );
              window.open("https://wa.me/${pet.ownerContact}?text=" + msg);
            },
            () => {
              const msg = encodeURIComponent("Hola, encontré a tu mascota ${pet.petName}.");
              window.open("https://wa.me/${pet.ownerContact}?text=" + msg);
            }
          );
        });
      </script>
    </body>
    </html>
  `);
};

export const upload = multer({ storage });
