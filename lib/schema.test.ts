import { describe, expect, it } from "vitest";
import { cotizacionSchema } from "./schema";

const ok = { tipo: "negocio", nombre: "Ana", whatsapp: "+56 9 1234 5678", comuna: "La Cruz", cantidad: "5 cajas por semana" };

describe("cotizacionSchema", () => {
  it("acepta una cotización válida y normaliza el WhatsApp", () => {
    const r = cotizacionSchema.safeParse(ok);
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.whatsapp).toBe("+56912345678");
  });
  it("rechaza WhatsApp inválido", () => {
    expect(cotizacionSchema.safeParse({ ...ok, whatsapp: "abc" }).success).toBe(false);
  });
  it("rechaza campos vacíos", () => {
    expect(cotizacionSchema.safeParse({ ...ok, nombre: "" }).success).toBe(false);
    expect(cotizacionSchema.safeParse({ ...ok, cantidad: "" }).success).toBe(false);
  });
  it("rechaza tipo desconocido y honeypot lleno", () => {
    expect(cotizacionSchema.safeParse({ ...ok, tipo: "otro" }).success).toBe(false);
    expect(cotizacionSchema.safeParse({ ...ok, empresa: "spam" }).success).toBe(false);
  });
});
