import { PetModel } from "../models/local/qr.model.js";
import { petSchema } from "../schemas/pet.schema.js";

export class PetController {
  static async getIndex(req, res) {
    res.status(200).sendFile("index.html", { root: "App/src/views" });
  }

  static async createPet(req, res) {
    try {
      const validated = petSchema.parse({
        ...req.body,
        petImage: req.file ? `/uploads/${req.file.filename}` : null,
      });
      const newPet = await PetModel.createPet(validated);
      res.status(201).json(newPet);
    } catch (error) {
      if (error.name === "ZodError") {
        return res.status(400).json({ errors: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  }

  static async getPetById(req, res) {
    try {
      const pet = await PetModel.getPetById({ id: req.params.id });
      if (!pet) {
        return res.status(404).json({ message: "Mascota no encontrada" });
      }

      // Enviar una página HTML con los datos de la mascota
      res.send(`
    <!DOCTYPE html>
    <html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pet.petName} - QRPet</title>
  <link rel="stylesheet" href="/styles.css">
</head>
    <body>
     <main class="pet-container">

    <header>
      <h1>¡Encontraste a ${pet.petName}!</h1>
      <p>Escaneaste para ayudarlo a volver a casa 🐾</p>
    </header>

    <section class="pet-card">

      ${
        pet.petImage
          ? `<figure>
            <img src="${pet.petImage}" alt="Foto de ${pet.petName}">
           </figure>`
          : ""
      }

      <ul class="pet-info">
        <li><strong>Raza:</strong> ${pet.petBreed}</li>
        <li><strong>Edad:</strong> ${pet.petAge} años</li>
      </ul>

      <button id="contactBtn">
        Contactar al dueño por WhatsApp
      </button>

    </section>
    </main>
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
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getDebugData(req, res) {
    const petData = await PetModel.getDebugData();
    res.json(petData);
    // try {
    //   const petData = await PetModel.getDebugData();
    //   res.json(petData);
    // } catch (error) {
    //   res.status(500).json({ error: error.message });
    // }
  }
}
