import { giroPalta } from "@/lib/sequences";

/**
 * Giro continuo de la palta. El clip de 73 frames da UNA vuelta en los primeros 67 (el resto es el frenado final, casi sin
 * movimiento) y arranca y frena suave; si se reproduce tal cual, la palta parece detenerse. Aquí la vuelta se trata como un
 * bucle de 67 frames y `GIRO_TABLA` reparte los frames para que el giro visible tenga velocidad pareja
 * (acumulado normalizado de la diferencia entre frames consecutivos).
 */
export const GIRO_LOOP = 67;
/** Vueltas por alto de pantalla de scroll en móvil (la escena fija, el descenso y la bajada al cajón usan la misma). */
export const GIRO_RHO = 0.3;
const GIRO_TABLA = [0.0000, 0.0063, 0.0137, 0.0231, 0.0346, 0.0480, 0.0625, 0.0779, 0.0939, 0.1104, 0.1271, 0.1441, 0.1611, 0.1784, 0.1957, 0.2132, 0.2307, 0.2483, 0.2660, 0.2835, 0.3010, 0.3184, 0.3356, 0.3527, 0.3695, 0.3861, 0.4025, 0.4186, 0.4348, 0.4507, 0.4664, 0.4818, 0.4967, 0.5109, 0.5246, 0.5379, 0.5510, 0.5641, 0.5776, 0.5914, 0.6057, 0.6204, 0.6355, 0.6507, 0.6662, 0.6817, 0.6972, 0.7127, 0.7284, 0.7443, 0.7605, 0.7768, 0.7932, 0.8099, 0.8265, 0.8432, 0.8597, 0.8762, 0.8924, 0.9086, 0.9244, 0.9397, 0.9541, 0.9671, 0.9782, 0.9871, 0.9940, 1.0000];

/** Frame (fraccionario, 0…GIRO_LOOP) que corresponde a `turns` vueltas (cualquier real; 1 = una vuelta completa). */
export function giroFrame(turns: number): number {
  const f = turns - Math.floor(turns);
  let lo = 0;
  let hi = GIRO_LOOP;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (GIRO_TABLA[mid] <= f) lo = mid;
    else hi = mid;
  }
  const a = GIRO_TABLA[lo];
  const b = GIRO_TABLA[lo + 1];
  return lo + (b > a ? (f - a) / (b - a) : 0);
}

/** Canvas que dibuja el frame del giro correspondiente a las vueltas dadas; al primer dibujo reemplaza a `cover`. */
export function createGiroCanvas(canvas: HTMLCanvasElement, cover: HTMLElement) {
  const c2d = canvas.getContext("2d")!;
  canvas.width = giroPalta.width;
  canvas.height = giroPalta.height;
  const frames: HTMLImageElement[] = [];
  let shown = false;
  const draw = (turns: number) => {
    let i = Math.round(giroFrame(turns)) % GIRO_LOOP;
    while (i > 0 && !(frames[i]?.complete && frames[i].naturalWidth)) i--; // si ese frame aún no cargó, usa el anterior
    const f = frames[i];
    if (!f || !f.complete || !f.naturalWidth) return;
    c2d.clearRect(0, 0, canvas.width, canvas.height);
    c2d.drawImage(f, 0, 0, canvas.width, canvas.height);
    if (!shown) {
      shown = true;
      canvas.style.opacity = "1";
      cover.style.visibility = "hidden";
    }
  };
  const load = () => {
    if (frames.length) return;
    for (let n = 0; n < GIRO_LOOP; n++) {
      const im = new Image();
      im.decoding = "async";
      im.src = `${giroPalta.dir}/${String(n + 1).padStart(4, "0")}.webp`;
      frames.push(im);
    }
  };
  const reset = () => {
    shown = false;
    canvas.style.opacity = "0";
    cover.style.visibility = "";
  };
  return { draw, load, reset };
}
