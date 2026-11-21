"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { beneficios } from "@/lib/content";
import { giroPalta } from "@/lib/sequences";
import { BenefitCard } from "./Benefits";

/**
 * Escritorio, escenas 5 y 6 en una sola pantalla fija (como la secuencia de More): la palta queda en el centro y gira
 * con cada scroll; las cards pasan por los lados; tres líneas blancas se dibujan y se borran con el scroll; al terminar
 * las cards el título sube por detrás de la palta junto con las hojas sueltas; tras el último giro la palta baja recta
 * y entran las dos paltas laterales desde abajo. Con reduced-motion se muestran Benefits y ThreePaltas estáticos.
 */

// Trazados de las 3 líneas (los de More, con su viewBox) y su posición dentro de la pantalla fija.
const lineas = [
  { top: "11.9%", h: "76.2%", vb: "0 0 1440 691", d: "M-11 627.781C31.2318 652.606 151.814 698.642 199.05 645.884C264.5 572.781 199.05 472.107 47.547 363.054C-103.956 254 -52.529 150.083 24.5115 108.595C210.583 8.39218 434.763 502.251 720.049 329.362C981.436 170.957 1134 -69.7188 1490 2.78121" },
  { top: "12.3%", h: "75.2%", vb: "0 0 1440 682", d: "M1442.05 19.9995C1346.05 34.4995 1170.99 110.452 1098.05 191.999C975.047 329.499 1257.15 515.709 1159 626.498C1027 775.498 571.87 408.445 484.498 347.293C244.047 178.999 15 -12.5016 -102 87.9984" },
  { top: "8.7%", h: "82.8%", vb: "0 0 1440 750", d: "M-918.224 5.00043C-948.225 142 -730.728 264 -473.726 252.501C-271.374 243.446 29.7721 170.716 170.275 135.501C1143.77 -108.499 460.741 462.659 570.773 634.5C651.773 761 1056.77 396 1392.27 396C1513.27 396 1835.87 454.857 2022.77 607.501C2178.27 734.5 2312.44 743.001 2363.77 718.001" },
];

const hojas = [
  { src: "/paltas/hoja-2.webp", w: 649, h: 729, cls: "left-[3%] top-[8%] w-[calc(130px*var(--k))] -rotate-[18deg]" },
  { src: "/paltas/hoja-4.webp", w: 522, h: 555, cls: "right-[5%] top-[12%] w-[calc(115px*var(--k))] rotate-[14deg]" },
  { src: "/paltas/hoja-1.webp", w: 520, h: 377, cls: "left-[9%] bottom-[9%] w-[calc(115px*var(--k))] rotate-[10deg]" },
  { src: "/paltas/hoja-3.webp", w: 561, h: 581, cls: "right-[8%] bottom-[7%] w-[calc(130px*var(--k))] -rotate-[12deg]" },
];

// Las cards alternan lados empezando por la derecha, como en More.
const orden = [beneficios.derecha[0], beneficios.izquierda[0], beneficios.derecha[1], beneficios.izquierda[1], beneficios.izquierda[2]].filter(Boolean);
const shadow = "drop-shadow-[0_22px_22px_rgba(22,51,30,.2)]";

export function Journey() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger, CustomEase, DrawSVGPlugin);
    const sec = root.current!;
    const mm = gsap.matchMedia(sec);

    mm.add("(min-width: 768px)", () => {
      const q = <T extends Element>(s: string) => sec.querySelector<T>(s)!;
      const wrap = q<HTMLElement>("[data-wrap]");
      const sticky = q<HTMLElement>("[data-sticky]");
      const palta = q<HTMLElement>("[data-palta]");
      const canvas = q<HTMLCanvasElement>("[data-palta] canvas");
      const img = q<HTMLImageElement>("[data-palta] img");
      const spacer = q<HTMLElement>("[data-spacer]");
      const title = q<HTMLElement>("[data-titulo]");
      const cards = gsap.utils.toArray<HTMLElement>("[data-benefit]", sec);
      const paths = gsap.utils.toArray<SVGPathElement>("[data-linea] path", sec);
      const hojasEl = gsap.utils.toArray<HTMLElement>("[data-hoja]", sec);
      const lados = gsap.utils.toArray<HTMLElement>("[data-lado]", sec);
      const H = () => window.innerHeight;
      // Tamaño de todo el conjunto: proporcional al diseño de 1440×900 (según el lado que limite), entre 0,8 y 2,2.
      const setK = () => {
        const W = window.innerWidth;
        const k = gsap.utils.clamp(0.62, 2.2, Math.min(W / 1440, window.innerHeight / 900));
        // Cards: nunca más anchas que el espacio libre entre el borde y la palta (sin solapar).
        const cw = Math.min(520 * k, W / 2 - 230 * k);
        // Se acercan a la palta hasta 150 px (de diseño) respecto del borde, sin pasar de 20·k de distancia a la palta.
        const libre = W / 2 - 170 * k - 40 * k - cw;
        const m = 40 * k + Math.max(0, Math.min(150 * k, libre - 20 * k));
        sticky.style.setProperty("--m", `${m}px`);
        sticky.style.setProperty("--k", String(k));
        sticky.style.setProperty("--kf", String(Math.max(k, 0.8)));
        sticky.style.setProperty("--cw", `${cw}px`);
      };
      setK();
      ScrollTrigger.addEventListener("refreshInit", setK);

      // --- Giro: los frames avanzan con el scroll sobre un canvas (el img es la carátula hasta que carga el primero).
      const c2d = canvas.getContext("2d")!;
      canvas.width = giroPalta.width;
      canvas.height = giroPalta.height;
      const frames: HTMLImageElement[] = [];
      const state = { frame: 0 };
      let shown = false;
      const draw = () => {
        let i = Math.round(state.frame);
        while (i > 0 && !(frames[i]?.complete && frames[i].naturalWidth)) i--; // si ese frame aún no cargó, usa el anterior
        const f = frames[i];
        if (!f || !f.complete || !f.naturalWidth) return;
        c2d.clearRect(0, 0, canvas.width, canvas.height);
        c2d.drawImage(f, 0, 0, canvas.width, canvas.height);
        if (!shown) {
          shown = true;
          canvas.style.opacity = "1";
          img.style.opacity = "0";
        }
      };
      const load = () => {
        if (frames.length) return;
        for (let n = 0; n < giroPalta.count; n++) {
          const im = new Image();
          im.decoding = "async";
          im.onload = n === 0 ? draw : null;
          im.src = `${giroPalta.dir}/${String(n + 1).padStart(4, "0")}.webp`;
          frames.push(im);
        }
      };
      const loader = ScrollTrigger.create({ trigger: wrap, start: "top bottom+=1500", once: true, onEnter: load });

      // Destino de la palta: el hueco de la central entre las dos laterales, pegada abajo.
      const finalScale = () => spacer.offsetWidth / palta.offsetWidth;
      const finalY = () => {
        const sp = spacer.getBoundingClientRect();
        const st = sticky.getBoundingClientRect();
        return sp.bottom - st.top - (st.height / 2 + (palta.offsetHeight * finalScale()) / 2);
      };

      const pass = CustomEase.create("cardPass", "M0,0 C0,0.201 0.098,0.459 0.5,0.5 0.904,0.541 1,0.805 1,1");
      // Estado inicial (como More: set aparte; en una línea de tiempo con scroll los "desde" de lo que arranca más tarde no se aplican solos).
      gsap.set(cards, { yPercent: 50, y: H() * 0.6, xPercent: (i: number) => (i % 2 ? 4 : -4), rotation: 0 });
      gsap.set(title, { y: H(), scale: 0.8 });
      gsap.set(hojasEl, { y: H(), autoAlpha: 0, scale: 0.5 });
      gsap.set(lados, { y: H() * 0.6 });
      gsap.set(palta, { scale: 1.25 });
      const tl = gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: { trigger: wrap, start: "top 60%", end: "bottom bottom", scrub: 0.7 } });

      // 1) Cards: entran por abajo, se detienen un instante al centro y salen por arriba (curva y desfase de More).
      tl.to(cards, { yPercent: -50, y: -H() * 0.6, xPercent: 0, rotation: (i: number) => (i % 2 ? -1 : 1) * gsap.utils.random(2, 5), duration: 1, stagger: 0.85, ease: pass }, 0);
      // 2) Líneas: cada una se dibuja y se borra (la cabeza avanza hacia la izquierda), una tras otra.
      tl.fromTo(paths, { drawSVG: "100% 100%" }, { keyframes: [{ drawSVG: "0% 100%", duration: 0.5 }, { drawSVG: "0% 0%", duration: 0.5 }], stagger: 1.35 }, 0.3);
      // 3) Palta: gira con todo el scroll y se achica.
      tl.to(palta, { scale: 0.95, duration: 3.2 }, 0);
      tl.to(state, { frame: giroPalta.count - 1, duration: 6.1, onUpdate: draw }, 0);
      // 4) Al terminar las cards: el título sube por detrás de la palta y con él las hojas sueltas.
      tl.to(title, { y: 0, scale: 1, duration: 1.5, ease: "power2.out" }, 4.6);
      tl.to(hojasEl, { y: 0, autoAlpha: 1, scale: 1, duration: 1.4, ease: "power1.inOut", stagger: 0.1 }, 4.6);
      // 5) Último giro hecho: la palta baja recta a su sitio entre las laterales y estas suben desde abajo.
      tl.to(palta, { y: finalY, scale: finalScale, duration: 1, ease: "power2.inOut" }, 6.1);
      tl.to(lados, { y: 0, duration: 1, ease: "power2.out", stagger: 0.12 }, 6.35);

      // Las paltas y hojas flotan suavemente.
      const floats = gsap.utils.toArray<HTMLElement>("[data-float]", sec).map((el, i) =>
        gsap.to(el, { yPercent: i % 2 ? -5 : 5, duration: 2.6 + (i % 4) * 0.7, ease: "sine.inOut", yoyo: true, repeat: -1, delay: i * 0.3 }),
      );

      requestAnimationFrame(() => ScrollTrigger.refresh());
      return () => {
        loader.kill();
        ScrollTrigger.removeEventListener("refreshInit", setK);
        floats.forEach((f) => f.kill());
        canvas.style.opacity = "0";
        img.style.opacity = "1";
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={root} aria-label="Beneficios de la palta Hass" className="relative hidden bg-background md:block motion-reduce:md:hidden">
      <div data-wrap className="relative h-[840vh]">
        <div data-sticky style={{ "--k": 1, "--kf": 1, "--cw": "490px", "--m": "40px" } as React.CSSProperties} className="sticky top-0 h-screen overflow-hidden">
          {/* Líneas (detrás de todo) */}
          {lineas.map((l, i) => (
            <svg key={i} data-linea viewBox={l.vb} preserveAspectRatio="none" aria-hidden="true" style={{ top: l.top, height: l.h, overflow: "visible" }} className="pointer-events-none absolute left-0 z-0 w-full">
              <path d={l.d} fill="none" stroke="#fff" strokeWidth={40} style={{ strokeDasharray: "0 999999" }} />
            </svg>
          ))}

          {/* Hojas sueltas */}
          {hojas.map((h) => (
            <div key={h.src} data-hoja aria-hidden="true" className={`pointer-events-none absolute z-[1] ${h.cls}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img data-float src={h.src} width={h.w} height={h.h} alt="" loading="lazy" className={`h-auto w-full ${shadow}`} />
            </div>
          ))}

          {/* Título: sube por detrás de la palta */}
          <div className="pointer-events-none absolute inset-x-0 top-0 z-[5] flex justify-center px-8 pt-[12svh]">
            <h2 data-titulo className="display m-0 max-w-[calc(1100px*var(--k))] text-balance text-center text-[calc(140px*var(--k))] leading-[.85] text-primary">
              Paltas en su punto.<br /><span className="text-foreground">¿Cuántas necesitas?</span>
            </h2>
          </div>

          {/* Paltas laterales (suben al final) y hueco de la central */}
          <div className="pointer-events-none absolute inset-x-0 bottom-[calc(36px*var(--k))] z-[8] flex items-end justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img data-lado data-float src="/paltas/palta-2.webp" width={764} height={1096} alt="Palta Hass madura" loading="lazy" className={`relative h-auto w-[calc(187px*var(--k))] ${shadow}`} />
            <div data-spacer aria-hidden="true" className="w-[calc(259px*var(--k))]" style={{ aspectRatio: "770 / 1093" }} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img data-lado data-float src="/paltas/media.webp" width={837} height={1227} alt="Media palta Hass con su carozo" loading="lazy" className={`relative h-auto w-[calc(187px*var(--k))] ${shadow}`} />
          </div>

          {/* Cards: cada una en su fila centrada; alternan lados. Ancho = espacio libre hasta la palta (--cw), escalado por --k desde el diseño de 1440×900. */}
          {orden.map((b, i) => (
            <div key={b.title} className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
              <div className={`flex w-[calc(100vw-2*var(--m))] ${i % 2 ? "justify-start" : "justify-end"}`}>
                <div className="w-[var(--cw)]"><BenefitCard {...b} /></div>
              </div>
            </div>
          ))}

          {/* Palta protagonista: centrada y fija durante toda la escena */}
          <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
            <div data-palta style={{ aspectRatio: `${giroPalta.width} / ${giroPalta.height}` }} className={`relative w-[calc(340px*var(--k))] select-none ${shadow}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/paltas/palta-1.webp" width={770} height={1093} alt="Palta Hass madura" className="absolute inset-0 size-full object-contain" />
              <canvas aria-hidden="true" className="absolute inset-0 size-full opacity-0" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
