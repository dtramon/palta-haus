"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { giroPalta } from "@/lib/sequences";
import { DURACION, extendToCajon } from "@/lib/cajon";
import { CajonCrate, CotizarEstatico, CotizarForm } from "./CajonLayer";

// Hojas flotantes: posición, tamaño, giro fijo y "profundidad" para el efecto de paralaje.
const hojas = [
  { src: "/paltas/hoja-2.webp", w: 649, h: 729, cls: "left-[6%] top-[40%] w-[clamp(64px,16vw,190px)] -rotate-[18deg] md:left-[3%] md:top-[8%] md:w-[clamp(64px,9vw,190px)]", depth: 1 },
  { src: "/paltas/hoja-4.webp", w: 522, h: 555, cls: "right-[8%] top-[46%] w-[clamp(56px,14vw,170px)] rotate-[14deg] md:right-[5%] md:top-[12%] md:w-[clamp(56px,8vw,170px)]", depth: 0.6 },
  { src: "/paltas/hoja-1.webp", w: 520, h: 377, cls: "max-md:hidden left-[9%] bottom-[9%] w-[clamp(56px,8vw,170px)] rotate-[10deg]", depth: 0.8 },
  { src: "/paltas/hoja-3.webp", w: 561, h: 581, cls: "max-md:hidden right-[8%] bottom-[7%] w-[clamp(64px,9vw,180px)] -rotate-[12deg]", depth: 1.2 },
];

const shadow = "drop-shadow-[0_22px_22px_rgba(22,51,30,.2)]";
const clamp01 = gsap.utils.clamp(0, 1);

export function ThreePaltas() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const sec = root.current!;

    // Las paltas y las hojas flotan suavemente; las hojas además se desplazan con el scroll (paralaje).
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-float]").forEach((el, i) => {
        gsap.to(el, { yPercent: i % 2 ? -5 : 5, duration: 2.6 + (i % 4) * 0.7, ease: "sine.inOut", yoyo: true, repeat: -1, delay: i * 0.3 });
      });
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        const d = Number(el.dataset.parallax);
        gsap.fromTo(el, { y: 50 * d }, { y: -50 * d, ease: "none", scrollTrigger: { trigger: sec, start: "top bottom", end: "bottom top", scrub: true } });
      });
    }, sec);

    // La palta protagonista de la escena 5 sigue bajando con el scroll hasta el divisor y queda como la palta central de
    // esta escena (la "viajera"); recién entonces suben las otras dos desde abajo. El traspaso es un cambio de elemento:
    // la protagonista se oculta y la viajera aparece en el mismo punto de la pantalla, con el mismo tamaño y giro.
    const mm = gsap.matchMedia(sec);
    const travel = (mobile: boolean) => {
      const viajera = sec.querySelector<HTMLElement>("[data-viajera]")!;
      const giro = viajera.querySelector<HTMLElement>("[data-giro]")!;
      const foto = viajera.querySelector<HTMLElement>("[data-foto]")!;
      const lados = gsap.utils.toArray<HTMLElement>("[data-lado]", sec);
      const prot = document.querySelector<HTMLElement>("[data-protagonista]");
      const ben = document.querySelector<HTMLElement>(".stage-section");
      const entrada = gsap.fromTo(lados, { y: 140, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1, stagger: 0.12, ease: "power3.out", paused: true });
      const stage = ben?.querySelector<HTMLElement>(".stage") ?? null;
      const stST = mobile ? ScrollTrigger.getAll().find((t) => t.pin === stage) : undefined;
      const protST = mobile ? undefined : ScrollTrigger.getAll().find((t) => t.trigger === ben && (t.animation as gsap.core.Tween | undefined)?.targets?.().includes(prot));
      if (!prot || !ben || (mobile ? !stST : !protST)) {
        entrada.progress(1); // sin protagonista a la que seguir: todo queda visible
        return;
      }

      const g = { Cn: 0, sL: 0, sH: 0, vc0: 0, sc0: 1, r0: 0, dx0: 0 };
      let on = false;
      let played = false;
      let last = "";

      const apply = (s: number) => {
        const ready = s >= g.sH && (!stST || (stST.animation?.progress() ?? 1) >= 0.999);
        const key = `${s}|${ready}`;
        if (key === last) return;
        last = key;
        if (ready !== on) {
          on = ready;
          gsap.set(viajera, { autoAlpha: ready ? 1 : 0 });
          gsap.set(prot, { autoAlpha: ready ? 0 : 1 });
        }
        if (!ready) return;
        const u = clamp01((s - g.sH) / (g.sL - g.sH));
        const docC = s < g.sL ? s + g.vc0 + (g.Cn - g.sL - g.vc0) * u : g.Cn; // centro de la viajera en coordenadas de documento
        gsap.set(viajera, { y: docC - g.Cn, x: g.dx0 * (1 - u), rotation: g.r0 * (1 - u), scale: g.sc0 + (1 - g.sc0) * u });
        if (!played && s >= g.sL - 0.08 * window.innerHeight) {
          played = true;
          entrada.play();
        }
      };

      const measure = () => {
        gsap.set(viajera, { x: 0, y: 0, rotation: 0, scale: 1 });
        const s = window.scrollY;
        const H = window.innerHeight;
        const r = viajera.getBoundingClientRect();
        const W = viajera.offsetWidth;
        g.Cn = r.top + s + r.height / 2;
        const holder = sec.parentElement?.classList.contains("pin-spacer") ? sec.parentElement : sec; // con la escena fija, el contenedor del pin conserva la posición original
        g.sL = holder.getBoundingClientRect().top + s; // la escena alineada con la pantalla: la viajera ya está en su sitio
        if (mobile) {
          g.sH = stST!.end; // fin de la escena fija: la protagonista queda arriba, a 7 % del alto
          g.vc0 = 0.07 * stage!.offsetHeight + prot.offsetHeight / 2;
          g.sc0 = prot.offsetWidth / W;
          g.r0 = 0;
          g.dx0 = 0;
        } else {
          // Mismos valores que el tween de escritorio de Benefits (rotación -16→22, x ±34, y ±38, escala .94→1).
          const st = protST!;
          const at = (v: number) => {
            const p = clamp01((v - st.start) / (st.end - st.start));
            return { x: -34 + 68 * p, y: -38 + 76 * p, r: -16 + 38 * p, sc: 0.94 + 0.06 * p };
          };
          const o = at(s);
          const pr = prot.getBoundingClientRect();
          const Cpy = pr.top + s + pr.height / 2 - o.y; // centro natural (sin transformaciones) de la protagonista
          const Cpx = pr.left + pr.width / 2 - o.x;
          g.sH = Cpy - 0.4 * H; // desde que está a 40 % de la altura, deja de subir y empieza a bajar
          const oh = at(g.sH);
          g.vc0 = Cpy + oh.y - g.sH;
          g.dx0 = Cpx + oh.x - (r.left + r.width / 2);
          g.r0 = oh.r;
          g.sc0 = (prot.offsetWidth * oh.sc) / W;
        }
        g.sH = Math.min(g.sH, g.sL - 1);
        last = "";
        apply(window.scrollY);
      };

      // En móvil la palta central es el último frame del giro (la misma que giró en la escena 5), no la foto: así no hay salto ni doble contorno.
      if (mobile) {
        gsap.set(giro, { opacity: 1 });
        gsap.set(foto, { opacity: 0 });
      }
      const tick = () => apply(window.scrollY);
      gsap.ticker.add(tick);
      ScrollTrigger.addEventListener("refresh", measure);
      measure();
      return () => {
        gsap.ticker.remove(tick);
        ScrollTrigger.removeEventListener("refresh", measure);
        gsap.set(viajera, { clearProps: "all" });
        gsap.set([foto, giro, prot], { clearProps: "opacity,visibility" });
      };
    };
    mm.add("(max-width: 767px)", () => travel(true));

    // Escena 7 en móvil: prolongación de esta misma pantalla. La escena se fija al quedar alineada y, con la palta central
    // (la viajera) quieta, todo lo demás sube y se va, llega el cajón, el círculo se cierra y sube el formulario.
    mm.add("(max-width: 767px)", () => {
      const q = <T extends Element>(s: string) => sec.querySelector<T>(s)!;
      const stage = q<HTMLElement>("[data-stage]");
      const paltas = q<HTMLElement>("[data-paltas]");
      const viajera = q<HTMLElement>("[data-viajera]");
      const H = () => window.innerHeight;
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: sec, start: "top top", end: () => `+=${DURACION * H()}`, scrub: 0.5, pin: true, anticipatePin: 1, invalidateOnRefresh: true },
      });
      const ex = extendToCajon(tl, {
        at: 0,
        stage,
        geo: () => {
          const a = paltas.getBoundingClientRect();
          const b = stage.getBoundingClientRect();
          return { cx: a.left - b.left + a.width / 2, bottom: a.bottom - b.top, w: viajera.offsetWidth };
        },
        shrink: q<HTMLElement>("[data-vin]"),
        shrinkOrigin: () => "50% 100%",
        world: [...gsap.utils.toArray<HTMLElement>("[data-world], [data-lw]", sec)],
        crate: q<HTMLElement>("[data-crate]"),
        front: q<HTMLElement>("[data-crate-front]"),
        card: q<HTMLElement>("[data-card]"),
        info: q<HTMLElement>("[data-info]"),
        anchorTo: () => tl.scrollTrigger!.end - H() * 0.4,
      });
      ScrollTrigger.addEventListener("refresh", ex.refresh);
      return () => {
        ScrollTrigger.removeEventListener("refresh", ex.refresh);
        ex.cleanup();
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    });

    return () => {
      mm.revert();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={root} style={{ clipPath: "inset(-150vh 0 0 0)" }} className="relative overflow-x-clip bg-primary md:hidden motion-reduce:md:block">
      <div data-stage className="relative flex min-h-svh flex-col items-center bg-background">
        {/* Todo lo que sube y se va al bajar la cámara (escena 7): hojas y título */}
        <div data-world className="absolute inset-0 flex flex-col items-center px-6 pt-[9svh] md:px-8 md:pt-[12svh]">
          {hojas.map((h) => (
            <div key={h.src} data-parallax={h.depth} aria-hidden="true" className={`pointer-events-none absolute z-0 ${h.cls}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img data-float src={h.src} width={h.w} height={h.h} alt="" loading="lazy" className={`h-auto w-full ${shadow}`} />
            </div>
          ))}

          <h2 className="display relative z-10 m-0 max-w-[1100px] text-balance text-center text-[17vw] leading-[.85] md:text-[clamp(60px,9.7vw,140px)] text-primary">
            Paltas en su punto.<br /><span className="text-foreground">¿Cuántas necesitas?</span>
          </h2>
        </div>

        <div data-paltas className="absolute inset-x-0 bottom-[4svh] z-[5] flex items-end justify-center">
          <div data-lw className="absolute bottom-0 left-[-22vw] w-[48vw] md:relative md:left-auto md:m-0 md:w-[clamp(84px,13vw,260px)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img data-float data-lado src="/paltas/palta-2.webp" width={764} height={1096} alt="Palta Hass madura" loading="lazy" className={`h-auto w-full -rotate-[9deg] ${shadow}`} />
          </div>
          {/* Palta central = la protagonista de la escena 5 que llega hasta aquí (ver efecto). */}
          <div data-viajera className="relative z-10 w-[56vw] md:w-[clamp(112px,18vw,360px)]">
            <div data-vin className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img data-foto src="/paltas/palta-1.webp" width={770} height={1093} alt="Palta Hass madura" className={`h-auto w-full ${shadow}`} />
              {/* Último frame del giro (solo móvil): es lo que muestra la protagonista al soltarse de la escena fija y queda como palta central. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img data-giro src={`${giroPalta.dir}/${String(giroPalta.count).padStart(4, "0")}.webp`} width={giroPalta.width} height={giroPalta.height} alt="" aria-hidden="true" className={`pointer-events-none absolute inset-0 size-full object-contain opacity-0 md:hidden ${shadow}`} />
            </div>
          </div>
          <div data-lw className="absolute bottom-0 right-[-22vw] w-[48vw] md:relative md:right-auto md:m-0 md:w-[clamp(90px,13vw,260px)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img data-float data-lado src="/paltas/media.webp" width={837} height={1227} alt="Media palta Hass con su carozo" loading="lazy" className={`h-auto w-full rotate-[8deg] ${shadow}`} />
          </div>
        </div>

        {/* Escena 7: el cajón, entre las paltas (z-5) y su frente */}
        <CajonCrate zBack="z-[4]" zFront="z-[6]" />
      </div>

      <CotizarForm z="z-30" />
      <CotizarEstatico />
    </section>
  );
}
