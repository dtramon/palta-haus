"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { QuoteForm } from "./QuoteForm";
import { sequences } from "@/lib/sequences";
import { smooth } from "@/lib/smooth";
import { site } from "@/lib/site";

const { dir, count } = sequences.cajon;
const pad = (n: number) => String(n).padStart(4, "0");
const FW = 1280;
const FH = 720;
// Centro y radio del grupo cajón + palta asentada dentro del frame de 1280×720 (el círculo se cierra sobre él).
const CX = 640;
const CY = 539;

// Escena 7 (todo en una sola pantalla fija): la palta cae al cajón (1,5 pantallas de scroll), un círculo se cierra
// sobre el cajón dejando el verde oscuro y el formulario sube desde abajo hasta quedar en el centro de la pantalla.
export function Cajon() {
  const root = useRef<HTMLElement>(null);
  const disc = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const info = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.registerPlugin(ScrollTrigger);
    const cv = canvas.current!;
    const ctx = cv.getContext("2d")!;
    const frames: HTMLImageElement[] = [];
    let current = 0;

    // Encaje: cubre la pantalla, pero mostrando al menos el 62 % del ancho del frame (en vertical queda con bandas del color del fondo).
    const fit = () => {
      const w = cv.clientWidth;
      const h = cv.clientHeight;
      const s = Math.min(Math.max(w / FW, h / FH), w / (FW * 0.62));
      return { s, ox: (w - FW * s) / 2, oy: (h - FH * s) / 2, w, h };
    };
    const draw = (i: number) => {
      const img = frames[i];
      if (!img || !img.complete || !img.naturalWidth) return;
      const { s, ox, oy } = fit();
      const dpr = cv.width / cv.clientWidth;
      ctx.fillStyle = "#e8efe4";
      ctx.fillRect(0, 0, cv.width, cv.height);
      ctx.drawImage(img, ox * dpr, oy * dpr, FW * s * dpr, FH * s * dpr);
      current = i;
    };
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = cv.clientWidth * dpr;
      cv.height = cv.clientHeight * dpr;
      draw(current);
    };

    const total = reduced ? 1 : count;
    for (let i = 1; i <= total; i++) {
      const img = new Image();
      img.src = `${dir}/${pad(reduced ? count : i)}.webp`;
      if (i === 1) img.onload = () => draw(reduced ? 0 : 0);
      frames.push(img);
    }
    resize();
    window.addEventListener("resize", resize);
    if (reduced) return () => window.removeEventListener("resize", resize);

    const H = () => window.innerHeight;
    // Posición del círculo (px de pantalla) y radio inicial: cubre toda la pantalla.
    const geo = () => {
      const { s, ox, oy, w, h } = fit();
      const cx = ox + CX * s;
      const cy = oy + CY * s;
      return { cx, cy, r0: Math.hypot(Math.max(cx, w - cx), Math.max(cy, h - cy)) + 8 };
    };
    const circ = { r: 1 };
    const setClip = () => {
      const { cx, cy, r0 } = geo();
      disc.current!.style.clipPath = `circle(${circ.r * r0}px at ${cx}px ${cy}px)`;
    };

    const state = { frame: 0 };
    gsap.set(card.current, { y: () => H(), autoAlpha: 1 });
    gsap.set(info.current, { autoAlpha: 0 });
    setClip();

    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: root.current,
        start: "top top",
        end: () => `+=${3.9 * H()}`,
        scrub: 0.5,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onRefresh: setClip,
      },
    });
    // 1) la palta cae: 1,5 pantallas de scroll
    tl.to(state, { frame: count - 1, duration: 1.5, onUpdate: () => draw(Math.round(state.frame)) }, 0)
      // 2) el círculo se cierra sobre el cajón
      .to(circ, { r: 0, duration: 1, ease: "power1.in", onUpdate: setClip }, 1.5)
      // 3) el formulario sube y queda fijo en el centro de la pantalla
      .to(card.current, { y: 0, duration: 1, ease: "power2.out" }, 2.5)
      .to(info.current, { autoAlpha: 1, duration: 0.4 }, 3.1)
      .to({}, { duration: 0.4 }, 3.5);

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
      window.removeEventListener("resize", resize);
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    <section ref={root} id="cotizar" className="relative h-svh min-h-[640px] overflow-hidden bg-primary motion-reduce:h-auto motion-reduce:min-h-0">
      <div ref={disc} className="absolute inset-0 bg-background motion-reduce:relative motion-reduce:h-[70svh]">
        <canvas ref={canvas} className="absolute inset-0 size-full" role="img" aria-label="Una palta cae en un cajón lleno de paltas Hass" />
      </div>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-4 px-4 pt-14 motion-reduce:relative motion-reduce:py-16">
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
