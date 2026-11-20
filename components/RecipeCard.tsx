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
  className?: string;
  shadow: string;
};

export function RecipeCard({ title, hint, video, poster, alt, rotate, shift, className, shadow }: Props) {
  const ref = useRef<HTMLVideoElement>(null);

  // Videos mudos y en loop: solo se reproducen mientras están a la vista.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? el.play().catch(() => {}) : el.pause()), { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      className={cn("aspect-[9/16] min-w-0 flex-[0_1_clamp(130px,19vw,260px)] rounded-2xl bg-white p-2", shadow, className)}
      style={{ transform: `rotate(${rotate}deg) translateY(${shift}px)` }}
    >
      <div className="relative size-full overflow-hidden rounded-[10px]">
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
        {poster && !video && (
          <span className="absolute bottom-2 left-2 inline-flex items-center rounded-full bg-background px-3 py-1 text-sm font-semibold">{title}</span>
        )}
      </div>
    </div>
  );
}
