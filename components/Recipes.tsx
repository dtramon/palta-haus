import { RecipeCard } from "./RecipeCard";
import { CtaLink } from "./CtaLink";
import { Badge } from "./ui/badge";
import { etiquetas, recetas } from "@/lib/content";

export function Recipes() {
  return (
    <section id="recetas" className="relative overflow-hidden bg-background pt-32 pb-24">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-14 px-8">
        <h2 className="display m-0 text-balance text-center text-[clamp(56px,8vw,120px)] leading-[.88]">
          Una palta,<br /><span className="text-[#6f9a3a]">mil formas de comerla.</span>
        </h2>

        <div className="flex w-full flex-wrap items-center justify-center gap-x-16 gap-y-12">
          <div className="flex min-w-0 flex-[1_1_440px] items-center justify-center pt-10 pb-[60px]">
            {recetas.map((r) => (
              <RecipeCard key={r.id} {...r} className={`${r.overlap} ${r.z} relative`} />
            ))}
          </div>

          <div className="flex min-w-0 max-w-[520px] flex-[1_1_360px] flex-col gap-6">
            <p className="display m-0 text-balance text-[clamp(34px,3.6vw,50px)] leading-[.95] font-semibold text-primary">
              De la marraqueta de la once a la palta reina del domingo.
            </p>
            <p className="m-0 text-pretty text-[21px] leading-[1.3] text-muted-foreground">Dinos cuántas paltas necesitas y te las llevamos.</p>
            <ul aria-label="Recetas" className="m-0 flex list-none flex-wrap gap-2 p-0">
              {etiquetas.map((e) => (
                <li key={e}><Badge>{e}</Badge></li>
              ))}
            </ul>
            <div><CtaLink href="#cotizar">Cotizar paltas</CtaLink></div>
          </div>
        </div>
      </div>
    </section>
  );
}
