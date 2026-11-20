"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  hint: string;
  video: string | null;
  poster: string | null;
  alt: string;
  rotate: number;
  shift: number;
  overlap: string;
  z: string;
  shadow: string;
  /** Geometría en escritorio, en unidades u (1u = min(1vw, 1.7778vh)) */
  w: number;
  l: number;
  t: number;
  shu: number;
};

export function RecipeCard({ title, hint, video, poster, alt, rotate, shift, overlap, z, shadow, w, l, t, shu }: Props) {
  const ref = useRef<HTMLVideoElement>(null);

  // Videos mudos y en loop: solo se reproducen mientras están a la vista.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? el.play().catch(() => {}) : el.pause()), { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const vars = { "--r": `${rotate}deg`, "--sh": shift, "--w": w, "--l": l, "--t": t, "--shu": shu } as React.CSSProperties;

  return (
    <div
      style={vars}
      className={cn(
        // móvil y tablet: fila con tarjetas superpuestas
        "relative aspect-[9/16] min-w-0 flex-[0_1_clamp(130px,30vw,300px)] rounded-2xl bg-white p-2 [transform:rotate(var(--r))_translateY(calc(var(--sh)*1px))]",
        // escritorio: posición y tamaño proporcionales al viewport, sin tope de ancho
        "lg:absolute lg:m-0 lg:w-[calc(var(--u)*var(--w))] lg:flex-none lg:left-[calc(var(--u)*var(--l))] lg:top-[calc(var(--u)*var(--t))] lg:rounded-[calc(var(--u)*1.1)] lg:p-[calc(var(--u)*0.55)] lg:[transform:rotate(var(--r))_translateY(calc(var(--u)*var(--shu)))]",
        overlap,
        z,
        shadow,
      )}
    >
      <div className="relative size-full overflow-hidden rounded-[10px] lg:rounded-[calc(var(--u)*0.7)]">
        {video ? (
          <video ref={ref} className="size-full object-cover" src={video} poster={poster ?? undefined} muted loop playsInline preload="metadata" aria-label={alt} />
        ) : poster ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={poster} alt={alt} className="size-full object-cover" />
        ) : (
          <div className="placeholder-stripes flex size-full flex-col items-center justify-center gap-1.5 p-3 text-center">
            <span className="text-[11px] font-semibold tracking-[.12em] text-muted-foreground">VIDEO IA · 9:16</span>
            <span className="display text-[clamp(22px,2.4vw,34px)] leading-[.95] text-primary">{title}</span>
            <span className="text-[15px] text-muted-foreground">{hint}</span>
          </div>
        )}
      </div>
    </div>
  );
}
