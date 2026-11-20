import { ScrollSequence } from "./ScrollSequence";
import { CtaLink } from "./CtaLink";
import { sequences } from "@/lib/sequences";

const Tag = ({ children }: { children: React.ReactNode }) => (
  <span className="text-[13px] font-semibold tracking-[.14em] text-muted-foreground">{children}</span>
);

function Overlay() {
  return (
    <div className="flex size-full flex-col justify-end">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-8 pb-14">
        <h1 className="display m-0 text-[clamp(84px,15vw,230px)] leading-[.82]">Del árbol<br />a tu mesa.</h1>
        <p className="m-0 max-w-[520px] text-2xl leading-tight text-primary">Paltas Hass de La Cruz, al por mayor y al detalle.</p>
        <div className="flex flex-wrap items-center gap-x-7 gap-y-4">
          <CtaLink href="#cotizar">Pedir cotización</CtaLink>
          <span className="inline-flex items-center gap-3 text-lg font-medium text-primary">
            <span className="inline-block h-10 w-0.5 bg-primary" />Desliza para bajar
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
    <ScrollSequence dir={s.dir} count={s.count} placeholder={<Placeholders />}>
      <Overlay />
    </ScrollSequence>
  );
}
