export function ThreePaltas() {
  const oval = "flex items-center justify-center rounded-full border-2 border-primary bg-secondary text-lg font-semibold text-center";
  return (
    <section className="relative flex min-h-[760px] flex-col items-center justify-center gap-10 overflow-hidden bg-muted px-8 py-24">
      <h2 className="display m-0 max-w-[1000px] text-balance text-center text-[clamp(60px,9vw,140px)] leading-[.85] text-primary">
        Paltas en su punto.<br /><span className="text-foreground">¿Cuántas necesitas?</span>
      </h2>
      <div className="flex flex-wrap items-end justify-center gap-6">
        <div className={`${oval} h-[210px] w-[150px]`}>PALTA</div>
        <div className={`${oval} h-[280px] w-[200px]`}>PALTA<br />PROTAGONISTA</div>
        <div className={`${oval} h-[210px] w-[150px]`}>PALTA</div>
      </div>
      <span className="text-center text-[13px] font-semibold tracking-[.14em] text-muted-foreground">PLACEHOLDER · 3 PALTAS (MODELO 3D) · ELEMENTOS FLOTANTES A DEFINIR</span>
    </section>
  );
}
