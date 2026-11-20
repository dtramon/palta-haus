export const recetas = [
  {
    id: "marraqueta",
    title: "Marraqueta con palta",
    hint: "Primer plano del sándwich y corte a una persona común mordiéndolo",
    video: "/recetas/marraqueta.mp4" as string | null,
    poster: "/recetas/marraqueta-poster.jpg",
    alt: "Marraqueta con palta, jamón y huevo",
    rotate: -7,
    shift: 36,
    overlap: "mr-[-26px]",
    z: "z-0",
    shadow: "shadow-[0_10px_30px_rgba(22,51,30,.16)]",
  },
  {
    id: "palta-reina",
    title: "Palta reina",
    hint: "Persona común, estilo influencer, preparándola frente a cámara",
    video: "/recetas/palta-reina.mp4" as string | null,
    poster: "/recetas/palta-reina-poster.jpg",
    alt: "Palta reina rellena de pollo con mayonesa",
    rotate: 3,
    shift: -14,
    overlap: "",
    z: "z-20",
    shadow: "shadow-[0_14px_40px_rgba(22,51,30,.2)]",
  },
  {
    id: "ensalada",
    title: "Ensalada de palta",
    hint: "Ensalada con quinoa, garbanzos, huevo y tomate",
    video: "/recetas/ensalada.mp4" as string | null,
    poster: "/recetas/ensalada-poster.jpg",
    alt: "Ensalada de palta con quinoa, garbanzos, huevo y tomate",
    rotate: -3,
    shift: 30,
    overlap: "ml-[-26px]",
    z: "z-10",
    shadow: "shadow-[0_10px_30px_rgba(22,51,30,.16)]",
  },
];

export const etiquetas = ["Completo italiano", "Palta reina", "Marraqueta con palta", "Ensalada con palta"];

export const beneficios = {
  izquierda: [
    { title: "Más fibra", dato: "5,4 g por media palta", texto: "Te deja satisfecho por más tiempo y ayuda a tu digestión." },
    { title: "Más folato", dato: "32 % del valor diario por media palta", texto: "Tu cuerpo lo usa para renovar sus células, como los glóbulos rojos." },
    { title: "Cremosa y liviana", dato: "0 mg de colesterol, sodio 1 % VD", texto: "Cero colesterol y muy poca sal." },
  ],
  derecha: [
    { title: "Más potasio", dato: "388 mg por media palta", texto: "Ayuda a que tus nervios, tus músculos y tu corazón funcionen bien." },
    { title: "Grasas buenas", dato: "7,8 g de grasa monoinsaturada", texto: "Energía que te deja satisfecho, de grasa de origen vegetal." },
  ],
  fuente: "Fuente: 5 al día Chile · porción de 80 g (media palta)",
};
