"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Hojas flotantes: posición, tamaño, giro fijo y "profundidad" para el efecto de paralaje.
const hojas = [
  { src: "/paltas/hoja-2.webp", w: 649, h: 729, cls: "left-[3%] top-[8%] w-[clamp(64px,9vw,190px)] -rotate-[18deg]", depth: 1 },
  { src: "/paltas/hoja-4.webp", w: 522, h: 555, cls: "right-[5%] top-[12%] w-[clamp(56px,8vw,170px)] rotate-[14deg]", depth: 0.6 },
  { src: "/paltas/hoja-1.webp", w: 520, h: 377, cls: "left-[9%] bottom-[9%] w-[clamp(56px,8vw,170px)] rotate-[10deg]", depth: 0.8 },
  { src: "/paltas/hoja-3.webp", w: 561, h: 581, cls: "right-[8%] bottom-[7%] w-[clamp(64px,9vw,180px)] -rotate-[12deg]", depth: 1.2 },
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
    <section ref={root} className="relative flex min-h-[760px] flex-col items-center justify-center gap-10 overflow-hidden bg-background px-8 pb-24 pt-10 md:py-24">
      {hojas.map((h) => (
        <div key={h.src} data-parallax={h.depth} aria-hidden="true" className={`pointer-events-none absolute z-0 ${h.cls}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img data-float src={h.src} width={h.w} height={h.h} alt="" loading="lazy" className={`h-auto w-full ${shadow}`} />
        </div>
      ))}

      <h2 className="display relative z-10 m-0 max-w-[1000px] text-balance text-center text-[clamp(60px,9vw,140px)] leading-[.85] text-primary">
        Paltas en su punto.<br /><span className="text-foreground">¿Cuántas necesitas?</span>
      </h2>

      <div data-paltas className="relative z-10 flex w-[calc(100%+4rem)] items-end justify-start md:w-auto md:flex-wrap md:justify-center md:gap-[clamp(6px,2vw,48px)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img data-float src="/paltas/palta-2.webp" width={764} height={1096} alt="Palta Hass madura" loading="lazy" className={`h-auto relative z-0 -ml-[14vw] w-[46vw] shrink-0 -rotate-[9deg] md:m-0 md:w-[clamp(84px,16vw,320px)] ${shadow}`} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img data-float src="/paltas/palta-1.webp" width={770} height={1093} alt="Palta Hass madura" loading="lazy" className={`h-auto relative z-10 -ml-[8vw] w-[56vw] shrink-0 md:m-0 md:w-[clamp(112px,22vw,440px)] ${shadow}`} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img data-float src="/paltas/media.webp" width={837} height={1227} alt="Media palta Hass con su carozo" loading="lazy" className={`h-auto relative z-0 -ml-[8vw] w-[48vw] shrink-0 rotate-[8deg] md:m-0 md:w-[clamp(90px,18vw,360px)] ${shadow}`} />
      </div>
    </section>
  );
}
