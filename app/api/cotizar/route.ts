import { NextResponse } from "next/server";
import { cotizacionSchema } from "@/lib/schema";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Solicitud inválida" }, { status: 400 });
  }
  const parsed = cotizacionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, errors: parsed.error.flatten().fieldErrors }, { status: 422 });
  }
  // TODO(David): guardar el lead en Supabase (tabla `leads`) y avisar por WhatsApp/correo.
  // Mientras no exista esa conexión, la solicitud se registra solo en el log del servidor.
  console.info("[cotizacion]", { ...parsed.data, empresa: undefined });
  return NextResponse.json({ ok: true });
}
