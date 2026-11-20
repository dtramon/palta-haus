import * as React from "react";
import { cn } from "@/lib/utils";

// Medidas en em: el tamaño lo define la fuente del contenedor.
export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("inline-flex items-center rounded-full border border-input px-[0.85em] py-[0.4em] font-medium", className)} {...props} />;
}
