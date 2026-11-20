// Secuencias de frames del scroll. `count: 0` = aún no hay frames y se muestra el placeholder del mockup.
// Cuando existan, guardar los frames como /public/frames/<nombre>/0001.webp, 0002.webp… y poner aquí la cantidad.
// `dirHd` (opcional): misma secuencia en mayor resolución, solo se descarga en pantallas anchas.
export const sequences = {
  apertura: { dir: "/frames/apertura", dirHd: "/frames/apertura-hd", count: 141 }, // campo → zoom al árbol → cae la palta (escenas 1–3). 1280×720 webp; dirHd = 1916×1080 para pantallas ≥1700 px (clips de Kling a 12 fps)
  cajon: { dir: "/frames/cajon", count: 0 }, // la palta cae al cajón (escena 7)
};
