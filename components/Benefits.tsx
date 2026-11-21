"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";
import { Card } from "./ui/card";
import { beneficios } from "@/lib/content";
import { giroPalta } from "@/lib/sequences";
import { GIRO_RHO, giroFrame } from "@/lib/giro";

export type Item = { title: string; icono: string; dato: string; texto: string };

export function BenefitCard({ title, icono, dato, texto }: Item) {
  return (
    <Card data-benefit className="stage-card flex flex-col items-center gap-2 rounded-[calc(var(--radius)+8px)] border-0 bg-[#b6cba5] p-6 text-center text-foreground md:gap-[calc(10px*var(--kf,1))] md:p-[calc(28px*var(--kf,1))]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={icono} alt="" aria-hidden="true" width={128} height={128} loading="lazy" className="size-16 md:size-[calc(72px*var(--kf,1))]" />
      <h3 className="display m-0 text-[46px] leading-[.88] text-white uppercase md:text-[calc(46px*var(--kf,1))]">{title}</h3>
      <p className="m-0 text-[22px] font-bold md:text-[calc(22px*var(--kf,1))]">{dato}</p>
      <p className="m-0 text-[19px] leading-[1.3] md:text-[calc(19px*var(--kf,1))]">{texto}</p>
    </Card>
  );
}

export function Benefits() {
  const root = useRef<HTMLElement>(null);

  // Las cards entran una a una, alternando lados.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia(root.current!);
    // Móvil (como More): escena fija a pantalla completa. La palta queda centrada y se inclina con el scroll
    // mientras las cards suben desde abajo, se detienen un instante bajo ella y salen por arriba.
    mm.add("(max-width: 767px)", () => {
      const sec = root.current!;
      gsap.registerPlugin(CustomEase);
      sec.dataset.stage = "true";
      const stage = sec.querySelector<HTMLElement>(".stage")!;
      const cards = gsap.utils.toArray<HTMLElement>("[data-benefit]", sec);
      const palta = sec.querySelector<HTMLElement>("[data-protagonista]")!;
      const H = () => window.innerHeight;
      const pass = CustomEase.create("cardPass", "M0,0 C0,0.201 0.098,0.459 0.5,0.5 0.904,0.541 1,0.805 1,1");
      const STEP = 0.85;

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: stage, start: "top top", end: () => "+=" + Math.round(H() * 3.7), scrub: 0.7, pin: true, anticipatePin: 1, invalidateOnRefresh: true },
      });
      tl.fromTo(
        cards,
        { yPercent: 50, y: () => H() * 0.6, xPercent: (i: number) => (i % 2 ? -4 : 4), rotation: 0 },
        { yPercent: -50, y: () => -H() * 0.6, xPercent: 0, rotation: (i: number) => (i % 2 ? 1 : -1) * (2 + (i % 3)), duration: 1, stagger: STEP, ease: pass },
        0,
      );
      // Entrada de la palta: sube grande e inclinada y se asienta en el centro.
      tl.fromTo(palta, { y: () => H() * 0.28, scale: 1.3, rotation: -10 }, { y: 0, scale: 1, rotation: 0, duration: 0.7, ease: "power2.out" }, 0);
      // Giro completo: los frames avanzan con el scroll durante toda la escena (una vuelta mientras pasan las cards).
      const canvas = palta.querySelector<HTMLCanvasElement>("canvas")!;
      const img = palta.querySelector<HTMLImageElement>("img")!;
      const c2d = canvas.getContext("2d")!;
      const frames: HTMLImageElement[] = [];
      const state = { frame: 0 };
      let shown = false;
      const fit = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.round(palta.offsetWidth * dpr);
        canvas.height = Math.round(palta.offsetHeight * dpr);
        draw();
      };
      const draw = () => {
        let i = Math.round(state.frame);
        while (i > 0 && !(frames[i]?.complete && frames[i].naturalWidth)) i--; // si aún no cargó ese frame, usa el anterior
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
      // Giro desde el primer instante y a velocidad constante respecto al scroll (la escena fija dura 3,7 alturas): sigue en el descenso y en el cajón.
      const vueltas = { v: 0 };
      tl.to(vueltas, { v: GIRO_RHO * 3.7, duration: 4.4, ease: "none", onUpdate: () => { state.frame = giroFrame(vueltas.v); draw(); } }, 0);
      const loader = ScrollTrigger.create({ trigger: stage, start: "top bottom+=1500", once: true, onEnter: load });
      ScrollTrigger.addEventListener("refresh", fit);
      gsap.set(palta, { transformPerspective: 900 });
      requestAnimationFrame(() => ScrollTrigger.refresh());
      return () => {
        loader.kill();
        ScrollTrigger.removeEventListener("refresh", fit);
        canvas.style.opacity = "0";
        img.style.opacity = "1";
        delete sec.dataset.stage;
      };
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={root} className="stage-section relative overflow-hidden bg-background pt-20 pb-16 md:hidden md:pt-28 md:pb-24 motion-reduce:md:block">
      <svg viewBox="0 0 1360 1000" preserveAspectRatio="none" aria-hidden="true" className="pointer-events-none absolute inset-0 hidden size-full md:block">
        <path d="M-20 140 C 300 40, 560 260, 700 420 S 1120 760, 1400 640" fill="none" stroke="#fff" strokeWidth="10" strokeLinecap="round" />
      </svg>

      <div className="stage relative z-10 mx-auto grid max-w-[1200px] grid-cols-[repeat(auto-fit,minmax(min(280px,100%),1fr))] items-start gap-8 px-8">
        <div className="stage-col flex flex-col gap-4 md:gap-6">{beneficios.izquierda.map((b) => <BenefitCard key={b.title} {...b} />)}</div>

        <div className="stage-palta order-first flex items-center justify-center py-2 md:order-none md:py-10">
          <div
            data-protagonista
            style={{ aspectRatio: `${giroPalta.width} / ${giroPalta.height}` }}
            className="relative w-[min(270px,70vw)] select-none drop-shadow-[0_28px_28px_rgba(22,51,30,.22)] md:w-[min(340px,70vw)] md:motion-reduce:rotate-[12deg]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/paltas/palta-1.webp" width={770} height={1093} alt="Palta Hass madura" className="absolute inset-0 size-full object-contain" />
            <canvas aria-hidden="true" className="pointer-events-none absolute inset-0 size-full opacity-0" />
          </div>
        </div>

        <div className="stage-col flex flex-col gap-4 md:gap-6 md:pt-24">{beneficios.derecha.map((b) => <BenefitCard key={b.title} {...b} />)}</div>
      </div>

      <p className="relative z-10 mx-auto mt-12 max-w-[1200px] px-8 text-base text-muted-foreground">{beneficios.fuente}</p>
    </section>
  );
}
