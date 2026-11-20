import { z } from "zod";

export const cotizacionSchema = z.object({
  tipo: z.enum(["negocio", "hogar"]),
  nombre: z.string().trim().min(2, "Escribe tu nombre").max(80),
  whatsapp: z
    .string()
    .trim()
    .transform((v) => v.replace(/[\s()-]/g, ""))
    .refine((v) => /^\+?\d{8,15}$/.test(v), "Escribe un WhatsApp válido"),
  comuna: z.string().trim().min(2, "Escribe tu comuna o ciudad").max(80),
  cantidad: z.string().trim().min(1, "Cuéntanos qué cantidad necesitas").max(200),
  // honeypot: debe venir vacío
  empresa: z.string().max(0).optional(),
});

export type Cotizacion = z.infer<typeof cotizacionSchema>;
