import { site } from "@/lib/site";

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between gap-4 px-5 py-3 sm:px-8">
        <a href="#inicio" className="flex items-center gap-2.5 no-underline">
          <svg width="40" height="40" viewBox="0 0 40 40" role="img" aria-label={`Logo ${site.name}`}>
            <path d="M20 3 L37 17 V36 H3 V17 Z" className="fill-primary" />
            <circle cx="20" cy="25" r="7" className="fill-accent" />
          </svg>
          <span className="display text-[34px] leading-none">{site.name}</span>
        </a>
        <nav aria-label="Principal" className="flex items-center gap-x-7">
          <a href="#recetas" className="hidden min-h-11 items-center text-lg font-medium no-underline sm:inline-flex">Recetas</a>
          <a href="#beneficios" className="hidden min-h-11 items-center text-lg font-medium no-underline sm:inline-flex">Beneficios</a>
          <a href="#cotizar" className="inline-flex min-h-11 items-center rounded-full bg-primary px-6 text-lg font-semibold text-primary-foreground no-underline">Cotizar</a>
        </nav>
      </div>
    </header>
  );
}
