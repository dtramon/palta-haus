"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Props = {
  /** Carpeta pública con los frames, ej. "/frames/apertura" (archivos 0001.webp, 0002.webp…) */
  dir: string;
  /** Cantidad de frames. Con 0 se muestra `placeholder` y no hay animación. */
  count: number;
  ext?: string;
  /** Largo del recorrido de scroll mientras la escena queda fija */
  scrollLength?: string;
  placeholder: React.ReactNode;
  children?: React.ReactNode;
};

const pad = (n: number) => String(n).padStart(4, "0");

export function ScrollSequence({ dir, count, ext = "webp", scrollLength = "+=300%", placeholder, children }: Props) {
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (count <= 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
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

    for (let i = 1; i <= count; i++) {
      const img = new Image();
      img.src = `${dir}/${pad(i)}.${ext}`;
      if (i === 1) img.onload = () => draw(0);
      frames.push(img);
    }
    resize();
    window.addEventListener("resize", resize);

    const state = { frame: 0 };
    const tween = gsap.to(state, {
      frame: count - 1,
      ease: "none",
      onUpdate: () => draw(Math.round(state.frame)),
      scrollTrigger: { trigger: root.current, start: "top top", end: scrollLength, scrub: 0.5, pin: true },
    });

    return () => {
      window.removeEventListener("resize", resize);
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [dir, count, ext, scrollLength]);

  if (count <= 0) return <>{placeholder}</>;

  return (
    <section ref={root} id="inicio" className="relative h-screen w-full overflow-hidden bg-muted">
      <canvas ref={canvas} className="absolute inset-0 size-full" aria-hidden="true" />
      <div className="relative z-10 size-full">{children}</div>
    </section>
  );
}
