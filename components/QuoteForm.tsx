"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { cotizacionSchema } from "@/lib/schema";

type Errors = Partial<Record<string, string[]>>;

export function QuoteForm() {
  const [state, setState] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [errors, setErrors] = useState<Errors>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const parsed = cotizacionSchema.safeParse(data);
    if (!parsed.success) {
      setErrors(parsed.error.flatten().fieldErrors);
      return;
    }
    setErrors({});
    setState("sending");
    try {
      const res = await fetch("/api/cotizar", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      setState(res.ok ? "ok" : "error");
    } catch {
      setState("error");
    }
  }

  const err = (k: string) => errors[k]?.[0];

  if (state === "ok") {
    return (
      <Card className="min-w-0 flex-[1_1_440px]">
        <CardHeader>
          <h3 className="display m-0 text-[40px] leading-[.95] font-semibold">¡Listo, recibimos tu solicitud!</h3>
        </CardHeader>
        <CardContent className="text-[17px] text-muted-foreground">Te respondemos por WhatsApp con precio y fecha de entrega.</CardContent>
      </Card>
    );
  }

  return (
    <Card className="min-w-0 flex-[1_1_440px]">
      <form onSubmit={onSubmit} noValidate>
        <CardHeader>
          <h3 className="display m-0 text-[40px] leading-[.95] font-semibold">Pide tu cotización</h3>
          <p className="m-0 text-[17px] text-muted-foreground">Te respondemos por WhatsApp.</p>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <fieldset className="m-0 flex flex-wrap items-center gap-x-6 gap-y-1 border-0 p-0">
            <legend className="mb-1.5 p-0 text-base font-medium">Soy</legend>
            <label className="inline-flex min-h-11 items-center gap-2.5 text-lg"><input type="radio" name="tipo" value="negocio" defaultChecked className="size-[18px] accent-primary" />Un negocio</label>
            <label className="inline-flex min-h-11 items-center gap-2.5 text-lg"><input type="radio" name="tipo" value="hogar" className="size-[18px] accent-primary" />Un hogar</label>
          </fieldset>

          {[
            { id: "nombre", label: "Nombre", type: "text", autoComplete: "name" },
            { id: "whatsapp", label: "WhatsApp", type: "tel", autoComplete: "tel" },
            { id: "comuna", label: "Comuna o ciudad", type: "text", autoComplete: "address-level2" },
            { id: "cantidad", label: "Cantidad aproximada", type: "text", placeholder: "Ej.: 5 cajas por semana, o 3 kilos" },
          ].map((f) => (
            <div key={f.id} className="flex flex-col gap-2">
              <Label htmlFor={f.id}>{f.label}</Label>
              <Input id={f.id} name={f.id} type={f.type} autoComplete={f.autoComplete} placeholder={f.placeholder} aria-invalid={!!err(f.id)} aria-describedby={err(f.id) ? `${f.id}-err` : undefined} />
              {err(f.id) && <span id={`${f.id}-err`} role="alert" className="text-base text-[#9b2c1f]">{err(f.id)}</span>}
            </div>
          ))}

          {/* honeypot anti-spam */}
          <input type="text" name="empresa" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 opacity-0" />

          <Button type="submit" disabled={state === "sending"} className="w-full">{state === "sending" ? "Enviando…" : "Pedir cotización"}</Button>
          {state === "error" && <span role="alert" className="text-base text-[#9b2c1f]">No pudimos enviar tu solicitud. Inténtalo de nuevo.</span>}
        </CardContent>
      </form>
    </Card>
  );
}
