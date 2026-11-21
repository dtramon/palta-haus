import { Header } from "@/components/Header";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Opening } from "@/components/Opening";
import { Recipes } from "@/components/Recipes";
import { Benefits } from "@/components/Benefits";
import { Journey } from "@/components/Journey";
import { ThreePaltas } from "@/components/ThreePaltas";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <Header />
      <main>
        <Opening />
        <Recipes />
        <div id="beneficios" className="scroll-mt-16">
          <Journey />
          <Benefits />
        </div>
        <ThreePaltas />
      </main>
      <Footer />
    </>
  );
}
