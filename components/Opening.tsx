import { ScrollSequence } from "./ScrollSequence";
import { CtaLink } from "./CtaLink";
import { sequences } from "@/lib/sequences";

const Tag = ({ children }: { children: React.ReactNode }) => (
  <span className="text-[13px] font-semibold tracking-[.14em] text-muted-foreground">{children}</span>
);

// En escritorio (≥1024 px) todo se mide en la unidad u = min(1vw, 1.7778vh), igual que Recetas, y se alinea con el header.
function Overlay({ scrim = false }: { scrim?: boolean }) {
  return (
    <div className="[--u:min(1vw,1.7778vh)] relative flex size-full flex-col justify-end">
      {scrim && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-background/75 via-background/35 to-transparent" />
      )}
      <div className="relative flex w-full flex-col gap-6 px-5 pb-14 sm:px-8 lg:gap-[calc(var(--u)*1.2)] lg:px-[max(32px,calc(var(--u)*2.5))] lg:pb-[max(56px,calc(var(--u)*3.5))]">
        <h1 className="display m-0 text-[clamp(84px,15vw,230px)] leading-[.82] lg:whitespace-nowrap lg:text-[length:calc(var(--u)*11)]">
          Del árbol <br className="lg:hidden" />a tu mesa.
        </h1>
        <p className="m-0 max-w-[520px] text-2xl leading-tight text-primary lg:max-w-none lg:text-[length:max(24px,calc(var(--u)*1.25))]">
          Paltas Hass de La Cruz, al por mayor y al detalle.
        </p>
        <div className="flex flex-wrap items-center gap-x-7 gap-y-4 lg:gap-x-[max(28px,calc(var(--u)*1.5))]">
          <CtaLink href="#cotizar" className="lg:text-[length:max(20px,calc(var(--u)*1.04))]">Pedir cotización</CtaLink>
          <span className="inline-flex items-center gap-3 text-lg font-medium text-primary lg:text-[length:max(18px,calc(var(--u)*0.94))]">
            <span className="inline-block h-10 w-0.5 bg-primary lg:h-[max(40px,calc(var(--u)*2.1))]" />Desliza para bajar
          </span>
        </div>
      </div>
    </div>
  );
}

// Mientras no existan los frames, se muestran las escenas 1–3 del mockup como placeholders.
function Placeholders() {
  return (
    <>
      <section id="inicio" className="placeholder-stripes relative flex min-h-[840px] flex-col justify-end overflow-hidden">
        <div className="absolute inset-x-0 top-0 bottom-[340px] flex flex-col items-center justify-center gap-2.5 px-8 text-center">
          <Tag>PLACEHOLDER · FRAMES</Tag>
          <span className="display text-[clamp(30px,4vw,48px)] text-primary">Campo de paltas, valle de La Cruz</span>
          <span className="max-w-[480px] text-lg text-muted-foreground">Plano abierto, sin mangueras. Es el primer frame de la secuencia.</span>
        </div>
        <div className="relative z-10"><Overlay /></div>
      </section>
      <section className="placeholder-stripes flex min-h-[700px] items-center justify-center px-8">
        <div className="flex flex-col items-center gap-2.5 text-center">
          <Tag>PLACEHOLDER · FRAMES</Tag>
          <span className="display text-[clamp(30px,4vw,48px)] text-primary">El zoom avanza hasta un solo árbol</span>
        </div>
      </section>
      <section className="placeholder-stripes flex min-h-[720px] flex-col items-center justify-center px-8 py-20">
        <Tag>PLACEHOLDER · FRAMES</Tag>
        <div className="mt-4 flex h-[210px] w-[150px] items-center justify-center rounded-full border-2 border-primary bg-secondary text-lg font-semibold">PALTA</div>
        <div className="my-3 h-[150px] w-0 border-l-2 border-dashed border-primary" />
        <span className="text-lg font-semibold text-primary">Cae y sale del cuadro</span>
      </section>
    </>
  );
}

export function Opening() {
  const s = sequences.apertura;
  return (
    <ScrollSequence dir={s.dir} dirHd={s.dirHd} count={s.count} scrollLength="+=500%" fadeChildren={0.12} placeholder={<Placeholders />}>
      <Overlay scrim />
    </ScrollSequence>
  );
}
