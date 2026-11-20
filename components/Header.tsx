import { site } from "@/lib/site";

export function Header() {
  return (
    <header className="[--u:min(1vw,1.7778vh)] fixed inset-x-0 top-0 z-50 bg-background/80 backdrop-blur-md">
      <div className="flex w-full items-center justify-between gap-4 px-5 py-3 sm:px-8 lg:px-[max(32px,calc(var(--u)*2.5))] lg:py-[max(12px,calc(var(--u)*0.7))]">
        <a href="#inicio" className="flex items-center no-underline">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logo.png" width={960} height={297} alt={`Logo ${site.name}`} className="h-11 w-auto lg:h-[max(44px,calc(var(--u)*2.4))]" />
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
