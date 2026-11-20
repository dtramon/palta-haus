"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Hojas flotantes: posición, tamaño, giro fijo y "profundidad" para el efecto de paralaje.
const hojas = [
  { src: "/paltas/hoja-2.webp", w: 649, h: 729, cls: "left-[6%] top-[40%] w-[clamp(64px,16vw,190px)] -rotate-[18deg] md:left-[3%] md:top-[8%] md:w-[clamp(64px,9vw,190px)]", depth: 1 },
  { src: "/paltas/hoja-4.webp", w: 522, h: 555, cls: "right-[8%] top-[46%] w-[clamp(56px,14vw,170px)] rotate-[14deg] md:right-[5%] md:top-[12%] md:w-[clamp(56px,8vw,170px)]", depth: 0.6 },
  { src: "/paltas/hoja-1.webp", w: 520, h: 377, cls: "max-md:hidden left-[9%] bottom-[9%] w-[clamp(56px,8vw,170px)] rotate-[10deg]", depth: 0.8 },
  { src: "/paltas/hoja-3.webp", w: 561, h: 581, cls: "max-md:hidden right-[8%] bottom-[7%] w-[clamp(64px,9vw,180px)] -rotate-[12deg]", depth: 1.2 },
];

const shadow = "drop-shadow-[0_22px_22px_rgba(22,51,30,.2)]";

export function ThreePaltas() {
  const root = useRef<HTMLElement>(null);

  // Las paltas y las hojas flotan suavemente; las hojas además se desplazan con el scroll (paralaje).
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      // Móvil (como More): las 3 paltas suben juntas y las de los lados quedan cortadas por los bordes de la pantalla.
      if (window.matchMedia("(max-width: 767px)").matches) {
        gsap.from("[data-paltas] > img", { y: 140, autoAlpha: 0, duration: 1, stagger: 0.12, ease: "power3.out", scrollTrigger: { trigger: "[data-paltas]", start: "top 85%", once: true } });
      }
      gsap.utils.toArray<HTMLElement>("[data-float]").forEach((el, i) => {
        gsap.to(el, { yPercent: i % 2 ? -5 : 5, duration: 2.6 + (i % 4) * 0.7, ease: "sine.inOut", yoyo: true, repeat: -1, delay: i * 0.3 });
      });
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        const d = Number(el.dataset.parallax);
        gsap.fromTo(el, { y: 50 * d }, { y: -50 * d, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative flex min-h-svh flex-col items-center overflow-hidden bg-background px-6 pt-[9svh] md:px-8 md:pt-[12svh]">
      {hojas.map((h) => (
        <div key={h.src} data-parallax={h.depth} aria-hidden="true" className={`pointer-events-none absolute z-0 ${h.cls}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img data-float src={h.src} width={h.w} height={h.h} alt="" loading="lazy" className={`h-auto w-full ${shadow}`} />
        </div>
      ))}

      <h2 className="display relative z-10 m-0 max-w-[1100px] text-balance text-center text-[17vw] leading-[.85] md:text-[clamp(60px,9.7vw,140px)] text-primary">
        Paltas en su punto.<br /><span className="text-foreground">¿Cuántas necesitas?</span>
      </h2>

      <div data-paltas className="absolute inset-x-0 bottom-0 z-10 flex translate-y-[3%] items-end justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img data-float src="/paltas/palta-2.webp" width={764} height={1096} alt="Palta Hass madura" loading="lazy" className={`absolute bottom-0 left-[-22vw] h-auto w-[48vw] translate-y-[12%] -rotate-[9deg] md:relative md:left-auto md:m-0 md:w-[clamp(84px,13vw,260px)] md:translate-y-[6%] ${shadow}`} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img data-float src="/paltas/palta-1.webp" width={770} height={1093} alt="Palta Hass madura" loading="lazy" className={`relative z-10 h-auto w-[56vw] md:w-[clamp(112px,18vw,360px)] ${shadow}`} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img data-float src="/paltas/media.webp" width={837} height={1227} alt="Media palta Hass con su carozo" loading="lazy" className={`absolute bottom-0 right-[-22vw] h-auto w-[48vw] translate-y-[12%] rotate-[8deg] md:relative md:right-auto md:m-0 md:w-[clamp(90px,13vw,260px)] md:translate-y-[6%] ${shadow}`} />
      </div>
    </section>
  );
}
