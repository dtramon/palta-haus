"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { QuoteForm } from "./QuoteForm";
import { smooth } from "@/lib/smooth";
import { site } from "@/lib/site";

const shadow = "drop-shadow-[0_22px_22px_rgba(22,51,30,.2)]";
// Línea del travesaño frontal del cajón (fracción de su alto): por delante de ella la palta queda tapada, como si cayera dentro.
const RIEL = 0.618;
// Cuánto de la palta queda escondida detrás del travesaño al asentarse (fracción de su alto).
const HUNDIDA = 0.2;

// Escena 7 (una sola pantalla fija que se superpone a los últimos 100 svh de la escena 6). La MISMA palta protagonista
// continúa la bajada: en el instante del traspaso se oculta la palta central de la escena 6 y esta aparece exactamente en su
// sitio y tamaño; mientras el resto de la escena 6 sube y se va, la palta sigue cayendo, sale por abajo y reaparece arriba
// ya con el tamaño del cajón, cayendo 1,5 scrolls hasta él mientras el círculo se cierra. Luego el círculo termina de
// cerrarse (verde oscuro) y el formulario sube hasta quedar fijo al centro de la pantalla.
const ASPECT = 1093 / 770;

// Rectángulo (px de pantalla) de la palta central de la escena 6 cuando ya llegó a su sitio, en escritorio o móvil.
function origen() {
  const H = window.innerHeight;
  const sp = document.querySelector<HTMLElement>("[data-spacer]");
  const st = sp?.closest<HTMLElement>("[data-sticky]");
  if (sp && st && sp.offsetParent) {
    const a = sp.getBoundingClientRect();
    const b = st.getBoundingClientRect();
    const w = a.width * 0.9755; // el cuadro del giro es algo más ancho que la foto (object-contain)
    return { x: a.left - b.left + (a.width - w) / 2, bottom: a.bottom - b.top, w };
  }
  const v = document.querySelector<HTMLElement>("[data-viajera]");
  const sec = v?.closest("section");
  const base = sec?.querySelector<HTMLElement>("[data-paltas]"); // contenedor fijo de las 3 paltas (sin transformaciones)
  if (v && sec && base && v.offsetParent) {
    const w = v.offsetWidth;
    return { x: (window.innerWidth - w) / 2, bottom: H - (sec.getBoundingClientRect().bottom - base.getBoundingClientRect().bottom), w };
  }
  const w = Math.min(window.innerWidth * 0.18, 360);
  return { x: (window.innerWidth - w) / 2, bottom: H - 40, w };
}

export function Cajon() {
  const root = useRef<HTMLElement>(null);
  const dark = useRef<HTMLDivElement>(null);
  const disc = useRef<HTMLDivElement>(null);
  const crate = useRef<HTMLDivElement>(null);
  const front = useRef<HTMLDivElement>(null);
  const palta = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const info = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.registerPlugin(ScrollTrigger);
    const d = disc.current!;
    const c = crate.current!;
    const p = palta.current!;
    const crates = [c, front.current!];

    // Geometría final de la palta: asentada en el cajón, con su parte baja detrás del travesaño.
    const fin = () => {
      const w = c.offsetWidth * 0.27;
      const h = w * ASPECT;
      return { w, h, x: (d.clientWidth - w) / 2, y: c.offsetTop + RIEL * c.offsetHeight + HUNDIDA * h - h };
    };

    if (reduced) {
      const place = () => {
        const f = fin();
        p.style.width = `${f.w}px`;
        gsap.set(p, { x: f.x, y: f.y, scale: 1 });
      };
      place();
      window.addEventListener("resize", place);
      return () => window.removeEventListener("resize", place);
    }

    const H = () => window.innerHeight;
    gsap.set(p, { transformOrigin: "0 0" });
    // Círculo: centrado en el cajón; radio inicial = hasta la esquina más lejana (cubre toda la pantalla).
    const geo = () => {
      const cx = d.clientWidth / 2;
      const cy = c.offsetTop + c.offsetHeight / 2;
      const r0 = Math.hypot(Math.max(cx, d.clientWidth - cx), Math.max(cy, d.clientHeight - cy)) + 8;
      const rCajon = Math.hypot(c.offsetWidth / 2, c.offsetHeight / 2) * 1.04;
      return { cx, cy, r0, rCajon };
    };
    const circ = { r: 1 };
    const setClip = () => {
      const { cx, cy, r0, rCajon } = geo();
      let r = circ.r * r0;
      if (r > rCajon * 1.001) {
        // Mientras cae, el círculo nunca se cierra más que lo que necesita la palta para seguir a la vista.
        const y = Number(gsap.getProperty(p, "y")) || 0;
        const sc = Number(gsap.getProperty(p, "scale")) || 1;
        const hh = p.offsetHeight * sc;
        const need = Math.abs(cy - (y + hh / 2)) + Math.hypot(p.offsetWidth * sc, hh) / 2 + 12;
        r = Math.max(r, need);
      }
      d.style.clipPath = `circle(${r}px at ${cx}px ${cy}px)`;
    };
    // Mientras el traspaso está activo se oculta la palta central de la escena 6 (esta ocupa su lugar).
    const takeover = (on: boolean) => document.documentElement.toggleAttribute("data-cajon", on);

    const sync = () => {
      const o = origen();
      p.style.width = `${o.w}px`;
      setClip();
    };
    gsap.set(card.current, { y: () => H(), autoAlpha: 1 });
    gsap.set(info.current, { autoAlpha: 0 });
    gsap.set(dark.current, { autoAlpha: 0 });
    gsap.set(d, { backgroundColor: "rgba(232,239,228,0)" });
    gsap.set(crates, { y: () => H() * 0.75, autoAlpha: 0 });
    sync();

    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: root.current,
        start: "top top",
        end: () => `+=${4.45 * H()}`,
        scrub: 0.5,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onRefresh: sync,
        onUpdate: (self) => takeover(self.progress > 0),
        onLeaveBack: () => takeover(false),
      },
    });
    // 1) traspaso: la palta sigue donde estaba (misma posición y tamaño) y continúa bajando mientras la escena 6 sube y se va
    tl.fromTo(p, { x: () => origen().x, y: () => origen().bottom - origen().w * ASPECT, scale: 1 }, { y: () => H() + 40, duration: 0.8, ease: "power2.in", immediateRender: false }, 0)
      // 2) la pantalla ya está vacía: aparece el fondo del círculo y la palta reaparece arriba, con el tamaño del cajón
      .set(d, { backgroundColor: "rgba(232,239,228,1)" }, 1)
      .set(dark.current, { autoAlpha: 1 }, 1)
      .set(p, { x: () => fin().x, scale: () => fin().w / p.offsetWidth, y: () => -fin().h - 30 }, 0.85)
      // 3) el cajón sube desde abajo; la palta cae 1,5 scrolls y el círculo empieza a cerrarse a la vez
      .to(crates, { y: 0, autoAlpha: 1, duration: 0.7, ease: "power2.out" }, 0.85)
      .to(p, { y: () => fin().y, duration: 1.5, ease: "power1.in", onUpdate: setClip }, 0.85)
      .to(circ, { r: () => geo().rCajon / geo().r0, duration: 1.5, ease: "none", onUpdate: setClip }, 0.85)
      // 4) cae en el cajón y el círculo termina de cerrarse
      .to(circ, { r: 0, duration: 0.7, ease: "power1.in", onUpdate: setClip }, 2.35)
      // 5) el formulario sube y queda fijo en el centro de la pantalla
      .to(card.current, { y: 0, duration: 1, ease: "power2.out" }, 3.05)
      .to(info.current, { autoAlpha: 1, duration: 0.4 }, 3.65)
      .to({}, { duration: 0.4 }, 4.05);

    // Enlaces a #cotizar: llevan al final del recorrido (formulario ya centrado), no al inicio de la escena.
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element).closest<HTMLAnchorElement>('a[href="#cotizar"]');
      if (!a || !tl.scrollTrigger) return;
      e.preventDefault();
      e.stopPropagation();
      const end = tl.scrollTrigger.end - H() * 0.4;
      if (smooth.lenis) smooth.lenis.scrollTo(end, { duration: 1.6 });
      else window.scrollTo({ top: end, behavior: "smooth" });
    };
    document.addEventListener("click", onClick, true);

    return () => {
      document.removeEventListener("click", onClick, true);
      takeover(false);
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    <div className="pointer-events-none relative z-10 -mt-[max(100svh,640px)] motion-reduce:mt-0">
      <section ref={root} id="cotizar" className="relative h-svh min-h-[640px] overflow-hidden motion-reduce:h-auto motion-reduce:min-h-0 motion-reduce:bg-primary">
        <div ref={dark} className="absolute inset-0 bg-primary motion-reduce:hidden" />
        <div
          ref={disc}
          style={{ "--cw": "min(88vw, 92svh)" } as React.CSSProperties}
          className="absolute inset-0 motion-reduce:relative motion-reduce:h-[70svh] motion-reduce:bg-background motion-reduce:[--cw:min(88vw,60svh)]"
          role="img"
          aria-label="Una palta Hass cae en un cajón lleno de paltas"
        >
          {/* Cajón: copia completa al fondo y, encima de la palta, solo el frente (travesaños) para que la palta caiga "dentro". */}
          <div ref={crate} className="absolute bottom-[6svh] left-1/2 w-[var(--cw)] -translate-x-1/2" style={{ aspectRatio: "1400 / 824" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/paltas/cajon.webp" width={1400} height={824} alt="" className="absolute inset-0 size-full" />
          </div>
          <div ref={palta} className={`absolute left-0 top-0 z-10 ${shadow}`} style={{ aspectRatio: "770 / 1093" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/paltas/palta-1.webp" width={770} height={1093} alt="" className="size-full" />
          </div>
          <div
            ref={front}
            aria-hidden="true"
            className="absolute bottom-[6svh] left-1/2 z-20 w-[var(--cw)] -translate-x-1/2"
            style={{ aspectRatio: "1400 / 824", clipPath: `inset(${RIEL * 100}% 0 0 0)` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/paltas/cajon.webp" width={1400} height={824} alt="" className="absolute inset-0 size-full" />
          </div>
        </div>
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-4 px-4 pt-14 motion-reduce:relative motion-reduce:py-16">
          <div ref={card} className="pointer-events-auto flex max-h-[calc(100svh-7rem)] w-[min(520px,100%)] overflow-y-auto rounded-[calc(var(--radius)+4px)] [&>*]:w-full">
            <QuoteForm />
          </div>
          <p ref={info} className="m-0 text-center text-base leading-snug text-secondary">
            Paltas de La Cruz, región de Valparaíso · Despachamos en {site.zonas} · Respondemos en {site.tiempoRespuesta}
          </p>
        </div>
      </section>
    </div>
  );
}
