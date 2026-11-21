import { describe, expect, it } from "vitest";
import { GIRO_LOOP, giroFrame } from "./giro";

describe("giroFrame", () => {
  it("empieza en el frame 0 y da una vuelta completa por cada entero", () => {
    expect(giroFrame(0)).toBe(0);
    expect(giroFrame(3)).toBe(0);
    expect(giroFrame(2.5)).toBeCloseTo(giroFrame(0.5), 6);
  });
  it("avanza siempre dentro del bucle, sin retroceder dentro de una vuelta", () => {
    let prev = -1;
    for (let k = 0; k < 1000; k++) {
      const f = giroFrame(k / 1000);
      expect(f).toBeGreaterThanOrEqual(prev);
      expect(f).toBeLessThan(GIRO_LOOP);
      prev = f;
    }
  });
});
