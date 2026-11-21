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

// Escena 7 (todo en una sola pantalla fija): la misma palta protagonista baja hasta el cajón (1,5 pantallas de scroll) y,
// mientras baja, un círculo se va cerrando sobre el cajón; al caer la palta el círculo termina de cerrarse dejando el verde
// oscuro y el formulario sube desde abajo hasta quedar en el centro de la pantalla.
export function Cajon() {
  const root = useRef<HTMLElement>(null);
  const disc = useRef<HTMLDivElement>(null);
  const crate = useRef<HTMLDivElement>(null);
  const palta = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const info = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.registerPlugin(ScrollTrigger);
    const d = disc.current!;
    const c = crate.current!;
    const p = palta.current!;

    // Posición final de la palta (px respecto al disco): asentada en el cajón, con su parte baja detrás del travesaño.
    const finalY = () => c.offsetTop + RIEL * c.offsetHeight + HUNDIDA * p.offsetHeight - p.offsetHeight;
    // Arranca asomando por el borde superior, para que la caída (y el círculo) se noten desde el primer scroll.
    const startY = () => -p.offsetHeight * 0.35;

    if (reduced) {
      gsap.set(p, { y: finalY });
      const onResize = () => gsap.set(p, { y: finalY() });
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }

    const H = () => window.innerHeight;
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
        const need = Math.hypot(0, cy - (y + p.offsetHeight / 2)) + Math.hypot(p.offsetWidth / 2, p.offsetHeight / 2) + 12;
        r = Math.max(r, need);
      }
      d.style.clipPath = `circle(${r}px at ${cx}px ${cy}px)`;
    };

    gsap.set(p, { y: startY, rotation: -16 });
    gsap.set(card.current, { y: () => H(), autoAlpha: 1 });
    gsap.set(info.current, { autoAlpha: 0 });
    setClip();

    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: root.current,
        start: "top top",
        end: () => `+=${3.7 * H()}`,
        scrub: 0.5,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onRefresh: setClip,
      },
    });
    // 1) la palta baja (1,5 pantallas de scroll, acelerando como una caída) y el círculo empieza a cerrarse a la vez
    tl.fromTo(p, { y: startY }, { y: finalY, rotation: 0, duration: 1.5, ease: "power1.in", immediateRender: false, onUpdate: setClip }, 0)
      .to(circ, { r: () => geo().rCajon / geo().r0, duration: 1.5, ease: "none", onUpdate: setClip }, 0)
      // 2) cae en el cajón y el círculo termina de cerrarse
      .to(circ, { r: 0, duration: 0.7, ease: "power1.in", onUpdate: setClip }, 1.5)
      // 3) el formulario sube y queda fijo en el centro de la pantalla
      .to(card.current, { y: 0, duration: 1, ease: "power2.out" }, 2.2)
      .to(info.current, { autoAlpha: 1, duration: 0.4 }, 2.8)
      .to({}, { duration: 0.4 }, 3.3);

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
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    <section ref={root} id="cotizar" className="relative h-svh min-h-[640px] overflow-hidden bg-primary motion-reduce:h-auto motion-reduce:min-h-0">
      <div
        ref={disc}
        style={{ "--cw": "min(88vw, 92svh)" } as React.CSSProperties}
        className="absolute inset-0 bg-background motion-reduce:relative motion-reduce:h-[70svh] motion-reduce:[--cw:min(88vw,60svh)]"
        role="img"
        aria-label="Una palta Hass cae en un cajón lleno de paltas"
      >
        {/* Cajón: copia completa al fondo y, encima de la palta, solo el frente (travesaños) para que la palta caiga "dentro". */}
        <div ref={crate} className="absolute bottom-[6svh] left-1/2 w-[var(--cw)] -translate-x-1/2" style={{ aspectRatio: "1400 / 824" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/paltas/cajon.webp" width={1400} height={824} alt="" className="absolute inset-0 size-full" />
        </div>
        <div className="absolute left-1/2 top-0 z-10 w-[calc(var(--cw)*0.27)] -translate-x-1/2" style={{ aspectRatio: "770 / 1093" }}>
          <div ref={palta} className={`size-full ${shadow}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/paltas/palta-1.webp" width={770} height={1093} alt="" className="size-full" />
          </div>
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[6svh] left-1/2 z-20 w-[var(--cw)] -translate-x-1/2"
          style={{ aspectRatio: "1400 / 824", clipPath: `inset(${RIEL * 100}% 0 0 0)` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/paltas/cajon.webp" width={1400} height={824} alt="" className="absolute inset-0 size-full" />
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 z-30 flex flex-col items-center justify-center gap-4 px-4 pt-14 motion-reduce:relative motion-reduce:py-16">
        <div ref={card} className="pointer-events-auto flex max-h-[calc(100svh-7rem)] w-[min(520px,100%)] overflow-y-auto rounded-[calc(var(--radius)+4px)] [&>*]:w-full">
          <QuoteForm />
        </div>
        <p ref={info} className="m-0 text-center text-base leading-snug text-secondary">
          Paltas de La Cruz, región de Valparaíso · Despachamos en {site.zonas} · Respondemos en {site.tiempoRespuesta}
        </p>
      </div>
    </section>
  );
}
