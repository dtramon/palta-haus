import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="bg-primary py-12 text-primary-foreground">
      <div className="mx-auto flex max-w-[1200px] flex-wrap justify-between gap-6 px-8">
        <div className="flex items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logo-icon.png" width={179} height={256} alt="" aria-hidden="true" className="h-11 w-auto" />
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
