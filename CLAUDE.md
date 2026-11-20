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
- Frames de las secuencias (`lib/sequences.ts`, `count: 0` = placeholder): `apertura` (escenas 1–3) YA CONECTADA (141 frames 1280×720 webp, 9,3 MB: zoom del campo al árbol y caída de la palta; título que se desvanece en el 12 % inicial del scroll). Falta `cajon` (escena 7). Formato `public/frames/<nombre>/0001.webp…`.
- Videos de recetas: conectados (`public/recetas/{marraqueta,palta-reina,ensalada}.mp4`, 576 px de ancho, mudos, comprimidos para web; carátulas `*-poster.jpg`). Los originales 1080p quedaron solo en el historial de git. Revisar con David el loop y la persona nueva de la 2.ª toma de la marraqueta.
- Datos de contacto en `lib/site.ts` (`[TU NÚMERO]`, `[TU CORREO]`, `[@TU_USUARIO]`, `[TUS ZONAS]`, `[TIEMPO DE RESPUESTA]`). Con `whatsappE164` vacío el botón de WhatsApp no es enlace.
- `app/api/cotizar/route.ts` valida y registra en el log; falta guardar el lead en Supabase.
- Palta protagonista, 3 paltas (escena 6) e íconos de beneficios: placeholders hasta tener modelo 3D/frames.
- Escena 7: el círculo se cierra con `clip-path` sobre un placeholder; falta la secuencia de la palta cayendo al cajón.
