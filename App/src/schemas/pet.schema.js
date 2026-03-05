import { z } from "zod";

export const petSchema = z.object({
  petName: z.string().min(1, "El nombre es obligatorio"),
  petBreed: z.string().min(1, "La raza es obligatoria"),
  petAge: z.coerce.number().int().min(0, "La edad debe ser positiva"),
  ownerContact: z.string().regex(/^\d{7,15}$/, "Número de contacto inválido"),
  ownerName: z.string().min(1, "El nombre del dueño es obligatorio"),
  petImage: z.string().nullable().optional(),
});
