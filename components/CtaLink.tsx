import { cn } from "@/lib/utils";

// Medidas en em: con la fuente por defecto (20 px) equivale a 48 px de alto; escala si se cambia el tamaño de fuente.
export function CtaLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <a href={href} className={cn("inline-flex items-center gap-[0.2em] text-xl no-underline hover:opacity-90", className)}>
      <span aria-hidden="true" className="inline-flex size-[2.4em] items-center justify-center rounded-full bg-primary text-primary-foreground">
        <svg className="size-[0.9em]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 17 17 7M8 7h9v9" />
        </svg>
      </span>
      <span className="inline-flex h-[2.4em] items-center rounded-full bg-primary px-[1.4em] font-semibold text-primary-foreground">{children}</span>
    </a>
  );
}
