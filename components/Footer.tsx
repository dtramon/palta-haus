import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="bg-primary py-12 text-primary-foreground">
      <div className="mx-auto flex max-w-[1200px] flex-wrap justify-between gap-6 px-8">
        <div className="flex items-center gap-2.5">
          <svg width="36" height="36" viewBox="0 0 40 40" aria-hidden="true">
            <path d="M20 3 L37 17 V36 H3 V17 Z" className="fill-accent" />
            <circle cx="20" cy="25" r="7" className="fill-primary" />
          </svg>
          <span className="display text-[32px] leading-none">{site.name}</span>
        </div>
        <div className="flex flex-col gap-1.5 text-lg leading-snug text-secondary">
          <span>WhatsApp: {site.whatsappDisplay}</span>
          <span>Correo: {site.email}</span>
          <span>Instagram: {site.instagram}</span>
        </div>
      </div>
    </footer>
  );
}
