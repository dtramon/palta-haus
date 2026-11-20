"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Card } from "./ui/card";
import { beneficios } from "@/lib/content";

type Item = { title: string; dato: string; texto: string };

function BenefitCard({ title, dato, texto }: Item) {
  return (
    <Card data-benefit className="flex flex-col gap-2.5 rounded-[calc(var(--radius)+8px)] p-7">
      <span aria-hidden="true" className="inline-flex size-[52px] items-center justify-center rounded-full border-2 border-dashed border-primary text-[10px] font-bold">ÍCONO</span>
      <h3 className="display m-0 text-[46px] leading-[.88] uppercase">{title}</h3>
      <p className="m-0 text-[22px] font-bold">{dato}</p>
      <p className="m-0 text-[19px] leading-[1.3] text-muted-foreground">{texto}</p>
    </Card>
  );
}

export function Benefits() {
  const root = useRef<HTMLElement>(null);

  // Las cards entran una a una, alternando lados.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-benefit]").forEach((el, i) => {
        gsap.from(el, {
          autoAlpha: 0,
          x: i % 2 === 0 ? -48 : 48,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="beneficios" className="relative overflow-hidden bg-muted pt-28 pb-24">
      <svg viewBox="0 0 1360 1000" preserveAspectRatio="none" aria-hidden="true" className="pointer-events-none absolute inset-0 size-full">
        <path d="M-20 140 C 300 40, 560 260, 700 420 S 1120 760, 1400 640" fill="none" stroke="#fff" strokeWidth="10" strokeLinecap="round" />
      </svg>

      <div className="relative z-10 mx-auto grid max-w-[1200px] grid-cols-[repeat(auto-fit,minmax(min(280px,100%),1fr))] items-start gap-8 px-8">
        <div className="flex flex-col gap-6">{beneficios.izquierda.map((b) => <BenefitCard key={b.title} {...b} />)}</div>

        <div className="flex flex-col items-center justify-center gap-4 py-10">
          <span className="text-center text-[13px] font-semibold tracking-[.14em] text-muted-foreground">PLACEHOLDER · PALTA PROTAGONISTA</span>
          <div className="flex aspect-[300/420] w-[min(300px,70vw)] items-center justify-center rounded-full border-2 border-primary bg-secondary p-6 text-center text-lg leading-snug font-semibold">
            Modelo 3D o frames de la palta, inclinada sobre la línea
          </div>
        </div>

        <div className="flex flex-col gap-6 pt-24">{beneficios.derecha.map((b) => <BenefitCard key={b.title} {...b} />)}</div>
      </div>

      <p className="relative z-10 mx-auto mt-12 max-w-[1200px] px-8 text-base text-muted-foreground">{beneficios.fuente}</p>
    </section>
  );
}
