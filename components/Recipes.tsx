import { RecipeCard } from "./RecipeCard";
import { CtaLink } from "./CtaLink";
import { Badge } from "./ui/badge";
import { etiquetas, recetas } from "@/lib/content";

/*
 * Proporciones como More Nutrition: en escritorio (≥1024 px) todo se mide en u = min(1vw, 1.7778vh),
 * es decir, el bloque escala como un lienzo 16:9 de 100u × 84,5u, sin ancho máximo.
 * En móvil y tablet vuelve a un flujo vertical normal.
 */
export function Recipes() {
  return (
    <section id="recetas" className="scroll-mt-16 relative overflow-hidden bg-background py-24 lg:py-0">
      <div className="[--u:min(1vw,1.7778vh)] relative mx-auto flex flex-col items-center gap-14 px-8 lg:block lg:h-[calc(var(--u)*84.5)] lg:w-[calc(var(--u)*100)] lg:px-0">
        <h2 className="display m-0 text-balance pt-8 text-center text-[clamp(56px,8vw,120px)] leading-[.88] lg:absolute lg:inset-x-0 lg:top-[calc(var(--u)*7)] lg:pt-0 lg:text-[length:calc(var(--u)*6.94)]">
          Una palta,<br /><span className="text-[#6f9a3a]">mil formas de comerla.</span>
        </h2>

        <div className="flex w-full min-w-0 items-center justify-center pt-10 pb-[60px] lg:contents">
          {recetas.map((r) => (
            <RecipeCard key={r.id} {...r} />
          ))}
        </div>

        <div className="flex max-w-[520px] min-w-0 flex-col gap-6 lg:absolute lg:left-[calc(var(--u)*72)] lg:top-[calc(var(--u)*30)] lg:w-[calc(var(--u)*26.5)] lg:max-w-none lg:gap-[calc(var(--u)*1.7)] lg:text-[length:calc(var(--u)*1.2)]">
          <p className="display m-0 text-balance text-[clamp(34px,5vw,50px)] leading-[.95] font-semibold text-primary lg:text-[length:calc(var(--u)*3.6)]">
            De la marraqueta de la once a la palta reina del domingo.
          </p>
          <p className="m-0 text-pretty text-[21px] leading-[1.3] text-muted-foreground lg:text-[length:calc(var(--u)*1.7)]">
            Dinos cuántas paltas necesitas y te las llevamos.
          </p>
          <ul aria-label="Recetas" className="m-0 flex list-none flex-wrap gap-2 p-0 text-base lg:gap-[calc(var(--u)*0.6)] lg:text-[length:calc(var(--u)*1.15)]">
            {etiquetas.map((e) => (
              <li key={e}><Badge>{e}</Badge></li>
            ))}
          </ul>
          <div><CtaLink href="#cotizar" className="lg:text-[length:calc(var(--u)*1.39)]">Cotizar paltas</CtaLink></div>
        </div>
      </div>
    </section>
  );
}
