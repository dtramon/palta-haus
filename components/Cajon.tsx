"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Escena 7: la palta cae al cajón y un círculo se cierra sobre él (fuera del círculo, el fondo verde oscuro).
export function Cajon() {
  const root = useRef<HTMLElement>(null);
  const disc = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        disc.current,
        { clipPath: "circle(150% at 50% 50%)" },
        {
          clipPath: "circle(0% at 50% 50%)",
          ease: "power1.in",
          scrollTrigger: { trigger: root.current, start: "top top", end: "+=120%", scrub: 0.5, pin: true },
        },
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative flex h-screen min-h-[640px] items-center justify-center overflow-hidden bg-primary">
      <div ref={disc} className="placeholder-stripes absolute inset-0 flex flex-col items-center justify-center gap-3 px-8 text-center">
        <div className="flex h-[134px] w-24 items-center justify-center rounded-full border-2 border-primary bg-secondary text-sm font-semibold">PALTA</div>
        <span className="text-[13px] font-semibold tracking-[.14em] text-muted-foreground">PLACEHOLDER · FRAMES</span>
        <span className="display text-[clamp(30px,4vw,48px)] text-primary">Cajón de paltas</span>
        <span className="max-w-[320px] text-lg text-muted-foreground">El círculo se centra en el cajón y se cierra hasta cero.</span>
      </div>
    </section>
  );
}
