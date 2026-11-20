// Datos de contacto. Los valores entre corchetes son pendientes de David.
export const site = {
  name: "paltahaus",
  whatsappDisplay: "[TU NÚMERO]",
  whatsappE164: "", // ej. "56912345678"; vacío = el botón de WhatsApp no se muestra como enlace
  email: "[TU CORREO]",
  instagram: "[@TU_USUARIO]",
  zonas: "[TUS ZONAS]",
  tiempoRespuesta: "[TIEMPO DE RESPUESTA]",
};

export function whatsappUrl(text?: string) {
  if (!site.whatsappE164) return null;
  const q = text ? `?text=${encodeURIComponent(text)}` : "";
  return `https://wa.me/${site.whatsappE164}${q}`;
}
