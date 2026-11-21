# paltahaus

Sitio de venta de paltas Hass de La Cruz (Valparaíso), al por mayor y al detalle. Storytelling "del árbol a tu mesa" guiado por scroll. Sin catálogo ni precios: el objetivo es que el visitante pida cotización.

## Stack
Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 · GSAP + ScrollTrigger · Lenis · zod · Vitest. Deploy en Vercel. Supabase pendiente (leads).

## Proceso (obligatorio)
- Antes de codear: revisar este archivo y los archivos relevantes con grep para detectar incoherencias, redundancias o choques con desarrollo anterior. Reportar cualquier conflicto antes de proceder.
- Buscar con grep primero y leer con offset+limit acotado; no leer archivos completos salvo que sea necesario.
- Antes de proponer un fix, mostrar el código real. No suponer cómo está implementado algo.
- Un commit por tarea/bloque. Tareas grandes con checkpoint explícito entre subtareas.
- Cierre de cada tarea: correr la skill `code-review-and-quality` y `npm test`, ambos en verde. Además `npm run typecheck` y `npm run build`.
- `scripts/backfill-source-url.mjs` NO se commitea nunca (está en .gitignore).
- La verificación real (navegador y SQL contra la DB) la hace David; un reporte de tests no la reemplaza.

## Diseño
- El mockup aprobado vive en el artefacto de Claude "Paltahaus.dc.html" (escenas 1–8). Se replica literal, no se reinterpreta.
- Tokens shadcn en `app/globals.css` (`--background`, `--primary`, `--accent`, `--border`, `--input`, `--radius`…), mapeados a Tailwind con `@theme inline`. Componentes UI en `components/ui` escritos a mano al estilo shadcn. Inputs de 44 px de alto (objetivo táctil).
- Tipografía: Archivo variable autohospedada (`@fontsource-variable/archivo/wdth.css`). Titulares con `.display` (`font-stretch: 62%`); cuerpo a 80 %.
- Español neutro con tuteo ("Contáctanos", "Pide tu cotización"). Nunca voseo ni modismos.
- Sin reseñas, estrellas ni testimonios inventados. Los videos de recetas son IA, mudos y en loop, con personas genéricas (no el creador real del TikTok de referencia).
- Respetar `prefers-reduced-motion` en toda animación.

## Pendientes conocidos
- Frames de las secuencias (`lib/sequences.ts`, `count: 0` = placeholder): `apertura` (escenas 1–3) YA CONECTADA (141 frames 1280×720 webp, 9,3 MB, más versión HD 1916×1080 de 14 MB en `apertura-hd` que se usa solo con ventana ≥1700 px: zoom del campo al árbol y caída de la palta; título que se desvanece en el 12 % inicial del scroll). Falta `cajon` (escena 7). Formato `public/frames/<nombre>/0001.webp…`.
- Videos de recetas: conectados (`public/recetas/{marraqueta,palta-reina,ensalada}.mp4`, 576 px de ancho, mudos, comprimidos para web; carátulas `*-poster.jpg`). Los originales 1080p quedaron solo en el historial de git. Revisar con David el loop y la persona nueva de la 2.ª toma de la marraqueta.
- Datos de contacto en `lib/site.ts` (`[TU NÚMERO]`, `[TU CORREO]`, `[@TU_USUARIO]`, `[TUS ZONAS]`, `[TIEMPO DE RESPUESTA]`). Con `whatsappE164` vacío el botón de WhatsApp no es enlace.
- `app/api/cotizar/route.ts` valida y registra en el log; falta guardar el lead en Supabase.
- Palta protagonista (escena 5) y 3 paltas (escena 6): CONECTADAS con fotos recortadas en `public/paltas/*.webp` (palta-1, palta-2, media, hoja-1…4; con transparencia). La protagonista gira y avanza con el scroll sobre la línea en escritorio; en móvil (<768 px) la escena 5 queda fija a pantalla completa con el giro completo en `public/frames/palta-giro` (73 frames webp con alfa, `giroPalta` en `lib/sequences.ts`; clip de Kling de 6 s sobre verde croma) mientras las cards suben y pasan por detrás de la palta, como en More; las paltas y hojas flotan (GSAP, respeta reduced-motion). Pendiente: íconos de beneficios (placeholders) y, a futuro, modelo 3D.
- Escritorio, escenas 5+6: `components/Journey.tsx` replica la secuencia de More (código leído de su app.js): contenedor de 840vh con pantalla fija; la palta queda en el centro y gira con los 73 frames de `palta-giro` mientras se achica; 5 cards alternan lados con la curva `cardPass` (stagger .85); 3 líneas blancas se dibujan y se borran con DrawSVG (trazados de More, stagger 1,35); al terminar las cards el título sube por detrás de la palta con las hojas sueltas; tras el último giro la palta baja recta al hueco central y las 2 paltas laterales suben desde abajo. Todo en una sola timeline con scrub. Escala: `--k` (= min(ancho/1440, alto/900), entre 0,62 y 2,2) escala palta, cards, tipografía y hojas desde el diseño de 1440×900; el ancho de card `--cw` = min(520·k, ancho/2 − 230·k) para que las cards nunca se solapen con la palta (se fijan en `setK`, en cada refresh). Con reduced-motion se muestran `Benefits`+`ThreePaltas` estáticos. El ancla `#beneficios` está en el contenedor de `app/page.tsx`.
- Móvil, escenas 5→6 (`Benefits` + `ThreePaltas`): la protagonista sigue bajando con el scroll hasta el divisor y queda como palta central de la escena 6 (`[data-viajera]` en `components/ThreePaltas.tsx`: el traspaso oculta `[data-protagonista]` y muestra la viajera en el mismo punto, tamaño y giro; en móvil usa el último frame del giro, en escritorio `palta-1.webp`). Las paltas laterales (`[data-lado]`) suben desde abajo recién al aterrizar. La sección 6 usa `clip-path: inset(-150vh 0 0 0)` (recorta abajo y a los lados, no arriba).
- Escena 7: el círculo se cierra con `clip-path` sobre un placeholder; falta la secuencia de la palta cayendo al cajón.
