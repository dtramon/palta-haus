import * as React from "react";
import { cn } from "@/lib/utils";

// Altura 44 px (objetivo táctil), mayor que el h-10 estándar de shadcn.
export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-md border border-input bg-background px-3 text-lg text-foreground placeholder:text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}
