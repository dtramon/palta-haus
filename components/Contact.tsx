import { QuoteForm } from "./QuoteForm";
import { buttonVariants } from "./ui/button";
import { site, whatsappUrl } from "@/lib/site";

export function Contact() {
  const wa = whatsappUrl("Hola, quiero cotizar paltas.");
  return (
    <section id="cotizar" className="relative bg-background pt-28 pb-24">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-start gap-14 px-8">
        <div className="flex min-w-0 flex-[1_1_380px] flex-col gap-6">
          <h2 className="display m-0 text-balance text-[clamp(60px,8vw,124px)] leading-[.86]">Contáctanos para precios minorista y mayorista.</h2>
          <p className="m-0 max-w-[440px] text-pretty text-[22px] leading-[1.3] text-muted-foreground">Cuéntanos qué necesitas y te respondemos con precio y fecha de entrega.</p>
          <p className="m-0 text-lg leading-normal text-muted-foreground">
            Paltas de La Cruz, región de Valparaíso<br />Despachamos en {site.zonas}<br />Respondemos en {site.tiempoRespuesta}
          </p>
          {wa ? (
            <a href={wa} className={`${buttonVariants({ variant: "outline", size: "nav" })} self-start no-underline`}>Escribir por WhatsApp · {site.whatsappDisplay}</a>
          ) : (
            <span className={`${buttonVariants({ variant: "outline", size: "nav" })} self-start`}>Escribir por WhatsApp · {site.whatsappDisplay}</span>
          )}
        </div>
        <QuoteForm />
      </div>
    </section>
  );
}
