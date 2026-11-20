"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Props = {
  /** Carpeta pública con los frames, ej. "/frames/apertura" (archivos 0001.webp, 0002.webp…) */
  dir: string;
  /** Misma secuencia en mayor resolución; se usa si el ancho de la ventana es ≥ `hdMinWidth` */
  dirHd?: string;
  hdMinWidth?: number;
  /** Cantidad de frames. Con 0 se muestra `placeholder` y no hay animación. */
  count: number;
  ext?: string;
  /** Largo del recorrido de scroll mientras la escena queda fija */
  scrollLength?: string;
  /** Fracción inicial del recorrido (0–1) en la que el contenido (children) se desvanece. Sin valor = no se desvanece. */
  fadeChildren?: number;
  placeholder: React.ReactNode;
  children?: React.ReactNode;
};

const pad = (n: number) => String(n).padStart(4, "0");

export function ScrollSequence({ dir, dirHd, hdMinWidth = 1700, count, ext = "webp", scrollLength = "+=300%", fadeChildren, placeholder, children }: Props) {
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const overlay = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (count <= 0) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.registerPlugin(ScrollTrigger);

    const cv = canvas.current!;
    const ctx = cv.getContext("2d")!;
    const frames: HTMLImageElement[] = [];
    let current = -1;

    const draw = (i: number) => {
      const img = frames[i];
      if (!img || !img.complete || !img.naturalWidth) return;
      const { width: cw, height: ch } = cv;
      const s = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      const w = img.naturalWidth * s;
      const h = img.naturalHeight * s;
      ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
      current = i;
    };
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = cv.clientWidth * dpr;
      cv.height = cv.clientHeight * dpr;
      if (current >= 0) draw(current);
    };

    // Con movimiento reducido solo se carga y dibuja el primer frame: sin pin ni animación.
    const base = dirHd && window.innerWidth >= hdMinWidth ? dirHd : dir;
    const total = reduced ? 1 : count;
    for (let i = 1; i <= total; i++) {
      const img = new Image();
      img.src = `${base}/${pad(i)}.${ext}`;
      if (i === 1) img.onload = () => draw(0);
      frames.push(img);
    }
    resize();
    window.addEventListener("resize", resize);
    if (reduced) return () => window.removeEventListener("resize", resize);

    const state = { frame: 0 };
    let tween: gsap.core.Tween | undefined;
    tween = gsap.to(state, {
      frame: count - 1,
      ease: "none",
      onUpdate: () => {
        draw(Math.round(state.frame));
        if (fadeChildren && overlay.current) {
          const k = Math.min(1, (tween?.scrollTrigger?.progress ?? 0) / fadeChildren);
          gsap.set(overlay.current, { autoAlpha: 1 - k, y: -48 * k });
        }
      },
      scrollTrigger: { trigger: root.current, start: "top top", end: scrollLength, scrub: 0.5, pin: true },
    });

    return () => {
      window.removeEventListener("resize", resize);
      tween?.scrollTrigger?.kill();
      tween?.kill();
    };
  }, [dir, dirHd, hdMinWidth, count, ext, scrollLength, fadeChildren]);

  if (count <= 0) return <>{placeholder}</>;

  return (
    <section ref={root} id="inicio" className="relative h-screen w-full overflow-hidden bg-muted">
      <canvas ref={canvas} className="absolute inset-0 size-full" aria-hidden="true" />
      <div ref={overlay} className="relative z-10 size-full">{children}</div>
    </section>
  );
}
