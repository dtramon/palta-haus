import { site } from "@/lib/site";

export function Header() {
  return (
    <header className="[--u:min(1vw,1.7778vh)] fixed inset-x-0 top-0 z-50 bg-background/80 backdrop-blur-md">
      <div className="flex w-full items-center justify-between gap-4 px-5 py-3 sm:px-8 lg:px-[max(32px,calc(var(--u)*2.5))] lg:py-[max(12px,calc(var(--u)*0.7))]">
        <a href="#inicio" className="flex items-center gap-2.5 no-underline">
          <svg viewBox="0 0 40 40" className="size-10 lg:size-[max(40px,calc(var(--u)*2.1))]" role="img" aria-label={`Logo ${site.name}`}>
            <path d="M20 3 L37 17 V36 H3 V17 Z" className="fill-primary" />
            <circle cx="20" cy="25" r="7" className="fill-accent" />
          </svg>
          <span className="display text-[34px] leading-none lg:text-[length:max(34px,calc(var(--u)*1.77))]">{site.name}</span>
        </a>
        <nav aria-label="Principal" className="flex items-center gap-x-7 lg:gap-x-[max(28px,calc(var(--u)*1.5))]">
          <a href="#recetas" className="hidden min-h-11 items-center text-lg font-medium no-underline sm:inline-flex lg:text-[length:max(18px,calc(var(--u)*0.94))]">Recetas</a>
          <a href="#beneficios" className="hidden min-h-11 items-center text-lg font-medium no-underline sm:inline-flex lg:text-[length:max(18px,calc(var(--u)*0.94))]">Beneficios</a>
          <a href="#cotizar" className="inline-flex min-h-11 items-center rounded-full bg-primary px-6 text-lg font-semibold text-primary-foreground no-underline lg:min-h-[max(44px,calc(var(--u)*2.3))] lg:px-[max(24px,calc(var(--u)*1.25))] lg:text-[length:max(18px,calc(var(--u)*0.94))]">Cotizar</a>
        </nav>
      </div>
    </header>
  );
}
