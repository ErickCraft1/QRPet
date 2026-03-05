import { randomUUID } from "node:crypto";
import fs from "fs";

const FILE_PATH = "App/src/models/local/pets.json";

export class PetModel {
  static async createPet({
    petName,
    petBreed,
    petAge,
    petImage,
    ownerContact,
    ownerName,
  }) {
    const id = randomUUID();
    const newPet = {
      id,
      petName,
      petBreed,
      petAge,
      ownerContact,
      ownerName,
      petImage,
    };

    // Leer archivo existente o crear array vacío
    let data = [];
    try {
      if (fs.existsSync(FILE_PATH)) {
        data = JSON.parse(fs.readFileSync(FILE_PATH, "utf-8"));
      }

      // Agregar nueva mascota
      data.push(newPet);

      // Guardar de nuevo en el archivo
      fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
      return newPet;
    } catch (err) {
      throw new Error("Error al guardar la mascota");
    }
  }

  static async getPetById({ id }) {
    try {
      const data = JSON.parse(fs.readFileSync(FILE_PATH, "utf-8"));
      const pet = data.find((p) => p.id === id);
      return pet;
    } catch (err) {
      throw new Error("Error al leer las mascotas");
    }
  }

  static async getDebugData() {
    try {
      if (!fs.existsSync(FILE_PATH)) {
        return [];
      }
      const raw = fs.readFileSync(FILE_PATH, "utf-8");
      return JSON.parse(raw);
    } catch (err) {
      throw new Error("No se pudo leer/parsear pets.json");
    }
  }
}
