import type { FeedItem, Friend, Pilar } from "./types";

// ---------------------------------------------------------------
// CONTENIDO — portado 1:1 desde la versión Artifact (gota-de-alegria.html).
// Esto sigue siendo data de ejemplo/seed hasta que se conecte Supabase
// (ver supabase/schema.sql y el roadmap en el README). Reemplazar/ampliar
// cuando lleguen las respuestas reales del form o se migren estas listas
// a las tablas `friends` / `posts` / `pillar_schedule`.
// ---------------------------------------------------------------

export const FORM_URL = "https://forms.gle/REEMPLAZAR-CON-TU-LINK";
// Form APARTE, sin ninguna pregunta de nombre/email — para que spill the tea
// y las nominaciones a premios sean anónimas de verdad.
export const TEA_FORM_URL = "https://forms.gle/REEMPLAZAR-CON-TU-LINK-ANONIMO";

export const DEST_EMAIL = "belenbraun@gmail.com";

// Paleta de colores para avatares (se asignan por índice)
export const AVATAR_COLORS = [
  "#1FB6AC",
  "#FF6F59",
  "#F2A541",
  "#7C6FE0",
  "#3AA6FF",
  "#E0577C",
];

// Lista de las 22 — placeholder de ejemplo. Reemplazar con las reales
// (o migrar a la tabla `friends` de Supabase).
export const FRIENDS: Friend[] = [
  { name: "Belu", fact: "La que arrancó todo esto por mail hace mil años" },
  { name: "(cargar amiga 2)" },
  { name: "(cargar amiga 3)" },
  { name: "(cargar amiga 4)" },
  { name: "(cargar amiga 5)" },
  { name: "(cargar amiga 6)" },
  { name: "(cargar amiga 7)" },
  { name: "(cargar amiga 8)" },
  { name: "(cargar amiga 9)" },
  { name: "(cargar amiga 10)" },
  { name: "(cargar amiga 11)" },
  { name: "(cargar amiga 12)" },
  { name: "(cargar amiga 13)" },
  { name: "(cargar amiga 14)" },
  { name: "(cargar amiga 15)" },
  { name: "(cargar amiga 16)" },
  { name: "(cargar amiga 17)" },
  { name: "(cargar amiga 18)" },
  { name: "(cargar amiga 19)" },
  { name: "(cargar amiga 20)" },
  { name: "(cargar amiga 21)" },
  { name: "(cargar amiga 22)" },
];

// Feed — EJEMPLOS de muestra para ver el formato final; se reemplazan
// por las anécdotas/chismes reales que junten (o se leen de `posts`).
export const FEED: FeedItem[] = [
  {
    type: "onthisday",
    author: "Belu",
    when: "Hoy",
    text: "Un día como hoy, hace unos cuantos años, alguien de este grupo mandó el primer mail estilo Gossip Girl contando quién había hablado con quién en el boliche. Esto es la versión 2.0 de esa idea. (Ejemplo — reemplazar por una anécdota real cuando lleguen las respuestas del form)",
    reactions: "😂 — 🥹",
  },
  {
    type: "challenge",
    author: "Challenge activo",
    when: "Esta semana",
    text: "Mandá una selfie de lo que estás haciendo ahora mismo, tal cual estás. Sin arreglarte, sin pose. Ganamos todas si hay alguna en piyama a las 4 de la tarde.",
    cta: "Subí la tuya",
  },
  {
    type: "chisme",
    author: "Anónimo del grupo",
    when: "Ejemplo",
    text: "Este es un espacio para los chismes divertidos de toda la vida — lo que se cuentan cuando se ríen recordando viejas épocas. Cargá el primero desde 'Sumar'.",
  },
];

// Pilares de contenido semanales — la cadencia fija de LA GOTA.
// Cada pilar tiene su día sugerido + ejemplos de challenges dentro de ese pilar.
// Estos mismos 6 pilares son las filas semilla de `pillar_schedule` en Supabase.
export const PILARES: Pilar[] = [
  {
    dia: "Lunes",
    tag: "Diario de la semana",
    emoji: "📓",
    desc: "Tipo diario íntimo: qué pasó la semana pasada. Arrancamos semanal — si se hace pesado, lo pasamos a mensual.",
    ejemplos: [
      "Un momento bueno y uno de mierda de tu semana.",
      "Lo más random que te pasó de lunes a domingo.",
    ],
  },
  {
    dia: "Martes",
    tag: "Recomendaciones",
    emoji: "🍿",
    desc: "Peli, serie, libro, podcast, lo que sea — algo que estás consumiendo y valga la pena.",
    ejemplos: [
      "Una serie que no podés parar de ver.",
      "Un libro/podcast que te voló la cabeza últimamente.",
    ],
  },
  {
    dia: "Miércoles",
    tag: "Cringe challenge",
    emoji: "🤳",
    desc: "Reto random, sin filtro. Se trata de reírse, no de quedar bien.",
    ejemplos: [
      "Selfie de lo que estás haciendo AHORA, tal cual estás.",
      "Grabate cantando la primera canción que suene en tu playlist.",
    ],
  },
  {
    dia: "Viernes",
    tag: "Spill the tea",
    emoji: "🍵",
    desc: "Chisme o confesión — 100% ANÓNIMO, nadie sabe quién lo mandó. Va por un buzón aparte, sin nombre.",
    ejemplos: [
      "Contá el recuerdo más random que tengas de otra persona del grupo — que adivinen quién es.",
      "Confesá una mentira piadosa que le dijiste a alguna.",
    ],
  },
  {
    dia: "Rotativo",
    tag: "Carta a una pussie",
    emoji: "💌",
    desc: "Dedicarle algo lindo (o una cargada con amor) a otra del grupo.",
    ejemplos: [
      "Decile a otra pussie algo que nunca le dijiste.",
      "Contá por qué la sumaste al grupito en su momento.",
    ],
  },
  {
    dia: "Sin día fijo",
    tag: "Premios",
    emoji: "🏆",
    desc: "Entregas esporádicas, cuando dan ganas. Categorías random votadas o elegidas por LA GOTA.",
    ejemplos: [
      "Premio a la más cambiada del año.",
      "Premio a la mejor excusa para faltar a un plan.",
      "Premio a la que más memes manda.",
    ],
  },
];
