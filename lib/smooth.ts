import type Lenis from "lenis";

// Instancia de Lenis compartida (la crea SmoothScroll) para que otras escenas puedan hacer scroll programático.
export const smooth: { lenis: Lenis | null } = { lenis: null };
