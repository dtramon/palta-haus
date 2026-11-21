import { gsap } from "gsap";
import { smooth } from "./smooth";

// Escena 7 = prolongación de la escena 6: la misma pantalla fija, la misma palta protagonista y la misma línea de tiempo.
// "La cámara baja siguiendo a la palta": todo lo demás de la escena 6 (título, hojas, paltas laterales) sube y se va, un cajón
// sube desde abajo y la palta, que no se mueve, queda dentro de él (su parte baja detrás del travesaño frontal). A la vez un
// círculo se cierra sobre el cajón (verde oscuro) y el formulario sube hasta quedar fijo en el centro de la pantalla.

/** Línea del travesaño frontal del cajón (fracción de su alto). */
export const RIEL = 0.618;
/** Parte de la palta que queda escondida detrás del travesaño (fracción de su alto). */
export const HUNDIDA = 0.2;
/** Alto / ancho de la foto de la palta. */
export const ASPECT = 1093 / 770;
/** Duración (en unidades de la línea de tiempo) que añade la escena 7 a la 6. */
export const DURACION = 3.6;

/** Rectángulo visible de la palta al terminar la escena 6, en px de la pantalla fija (`stage`). */
export type Geo = { cx: number; bottom: number; w: number };

export type CajonOpts = {
  at: number;
  /** Contenedor de toda la escena (con fondo claro): se recorta con el círculo y deja ver el verde oscuro de detrás. */
  stage: HTMLElement;
  geo: () => Geo;
  /** Elemento que contiene a la palta y que se encoge hacia su base (escala desde abajo al centro). */
  shrink: HTMLElement;
  shrinkOrigin: (g: Geo) => string;
  /** Todo lo que sube y se va. */
  world: gsap.TweenTarget;
  crate: HTMLElement;
  front: HTMLElement;
  card: HTMLElement;
  info: HTMLElement;
  /** Scroll (px) al que llevar los enlaces a #cotizar. */
  anchorTo: () => number;
};

export function extendToCajon(tl: gsap.core.Timeline, o: CajonOpts) {
  const H = () => window.innerHeight;
  const D = () => H() + 80;
  const crates = [o.crate, o.front];

  const L = () => {
    const W = o.stage.clientWidth;
    const Hs = o.stage.clientHeight;
    const g = o.geo();
    const cw = Math.min(W * 0.9, g.w * 2.7);
    const ch = (cw * 824) / 1400;
    const sf = Math.min(1, (0.3 * cw) / g.w); // la palta se achica para quedar a escala de las del cajón
    const ws = g.w * sf;
    const hv = ws * ASPECT;
    // El cajón queda entero en pantalla (su base a 6 % del borde); la palta sube lo justo para quedar hundida en él.
    const top = Math.min(g.bottom - HUNDIDA * hv - RIEL * ch, Hs * 0.94 - ch);
    const pb = top + RIEL * ch + HUNDIDA * hv; // base final de la palta
    const dy = pb - g.bottom;
    const pTop = pb - hv;
    const cx = g.cx;
    const cy = top + ch / 2;
    const r0 = Math.hypot(Math.max(cx, W - cx), Math.max(cy, Hs - cy)) + 8;
    const rc = Math.max(Math.hypot(cw / 2, ch / 2) * 1.04, Math.hypot(ws / 2, Math.abs(cy - pTop)) + 12);
    return { g, cw, ch, sf, dy, top, cx, cy, r0, rc };
  };
  const place = () => {
    const l = L();
    crates.forEach((el) => Object.assign(el.style, { left: `${l.cx - l.cw / 2}px`, top: `${l.top}px`, width: `${l.cw}px` }));
    gsap.set(o.shrink, { transformOrigin: o.shrinkOrigin(l.g) });
    return l;
  };

  const circ = { r: 1 };
  const setClip = () => {
    if (circ.r >= 0.9995) {
      o.stage.style.clipPath = "";
      return;
    }
    const l = L();
    o.stage.style.clipPath = `circle(${Math.max(0, circ.r * l.r0)}px at ${l.cx}px ${l.cy}px)`;
  };

  place();
  const ext = gsap.timeline({ defaults: { ease: "none" } });
  ext
    // 1) la cámara baja con la palta: todo sube y se va, el cajón llega desde abajo, la palta se encoge y el círculo empieza a cerrarse
    .to(o.world, { y: () => -D(), duration: 1.5, ease: "power1.inOut" }, 0)
    .fromTo(crates, { y: () => D() }, { y: 0, duration: 1.5, ease: "power1.inOut" }, 0)
    .to(o.shrink, { scale: () => L().sf, y: () => L().dy, duration: 1.5, ease: "power1.inOut" }, 0)
    .to(circ, { r: () => L().rc / L().r0, duration: 1.5, onUpdate: setClip }, 0)
    // 2) la palta ya está en el cajón: el círculo termina de cerrarse
    .to(circ, { r: 0, duration: 0.7, ease: "power1.in", onUpdate: setClip }, 1.5)
    // 3) el formulario sube y queda fijo en el centro de la pantalla
    .fromTo(o.card, { y: () => H() }, { y: 0, duration: 1, ease: "power2.out" }, 2.2)
    .fromTo(o.info, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }, 2.8)
    .to({}, { duration: 0.4 }, 3.2);
  tl.add(ext, o.at);

  // Los valores con función (alturas, medidas) se recalculan porque la línea de tiempo principal usa invalidateOnRefresh.
  const onRefresh = () => {
    place();
    setClip();
  };

  // Enlaces a #cotizar: llevan al final del recorrido (formulario ya centrado), no al inicio de la escena.
  const onClick = (e: MouseEvent) => {
    const a = (e.target as Element).closest<HTMLAnchorElement>('a[href="#cotizar"]');
    if (!a) return;
    e.preventDefault();
    e.stopPropagation();
    if (smooth.lenis) smooth.lenis.scrollTo(o.anchorTo(), { duration: 1.6 });
    else window.scrollTo({ top: o.anchorTo(), behavior: "smooth" });
  };
  document.addEventListener("click", onClick, true);

  return {
    /** Llamar en cada refresh de ScrollTrigger (después de fijar las medidas de la escena 6). */
    refresh: onRefresh,
    cleanup() {
      document.removeEventListener("click", onClick, true);
      ext.kill();
      o.stage.style.clipPath = "";
      crates.forEach((el) => {
        Object.assign(el.style, { left: "", top: "", width: "" });
        gsap.set(el, { clearProps: "transform" });
      });
    },
  };
}
