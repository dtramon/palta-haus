import { QuoteForm } from "./QuoteForm";
import { RIEL } from "@/lib/cajon";
import { site } from "@/lib/site";

// Piezas de la escena 7 (prolongación de la escena 6). Las dibuja `Journey` (escritorio) y `ThreePaltas` (móvil) dentro de su
// pantalla fija; `lib/cajon.ts` las coloca y anima. Con reduced-motion no se muestran (la escena 6 queda estática).

const ratio = { aspectRatio: "1400 / 824" };

/** Cajón en dos capas: el cajón completo detrás de la palta y, delante de ella, solo el frente (desde el travesaño), para que caiga "dentro". */
export function CajonCrate({ zBack, zFront }: { zBack: string; zFront: string }) {
  return (
    <>
      <div data-crate aria-hidden="true" className={`pointer-events-none absolute motion-reduce:hidden ${zBack}`} style={{ ...ratio, width: 0, left: 0, top: "100%" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/paltas/cajon.webp" width={1400} height={824} alt="" className="absolute inset-0 size-full" />
      </div>
      <div data-crate-front aria-hidden="true" className={`pointer-events-none absolute motion-reduce:hidden ${zFront}`} style={{ ...ratio, width: 0, left: 0, top: "100%", clipPath: `inset(${RIEL * 100}% 0 0 0)` }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/paltas/cajon.webp" width={1400} height={824} alt="" className="absolute inset-0 size-full" />
      </div>
    </>
  );
}

/** Tarjeta del formulario + línea de zonas: suben desde abajo y quedan fijas al centro de la pantalla. */
export function CotizarForm({ z }: { z: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-4 px-4 pt-14 motion-reduce:hidden ${z}`}>
      <div data-card style={{ transform: "translateY(100vh)" }} className="pointer-events-auto flex max-h-[calc(100svh-7rem)] w-[min(520px,100%)] overflow-y-auto rounded-[calc(var(--radius)+4px)] [&>*]:w-full">
        <QuoteForm />
      </div>
      <p data-info style={{ opacity: 0 }} className="m-0 text-center text-base leading-snug text-secondary">
        Paltas de La Cruz, región de Valparaíso · Despachamos en {site.zonas} · Respondemos en {site.tiempoRespuesta}
      </p>
    </div>
  );
}

/** Versión estática (reduced-motion): el formulario sobre verde oscuro, sin animación. */
export function CotizarEstatico() {
  return (
    <div id="cotizar" className="hidden flex-col items-center gap-4 bg-primary px-4 py-16 motion-reduce:flex">
      <div className="w-[min(520px,100%)] [&>*]:w-full"><QuoteForm /></div>
      <p className="m-0 text-center text-base leading-snug text-secondary">
        Paltas de La Cruz, región de Valparaíso · Despachamos en {site.zonas} · Respondemos en {site.tiempoRespuesta}
      </p>
    </div>
  );
}
