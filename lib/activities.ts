import type { Activity, PilarId } from "./types";

// ---------------------------------------------------------------
// Actividades de LA GOTA — antes vivían en una tab fija ("Challenges").
// Ahora son la base de las NOTIFICACIONES: cada semana se activan 3,
// rotando, para que nadie sepa de antemano cuál toca. El mismo array
// es la semilla de `pillar_schedule` en Supabase.
//
// Las primeras 6 son las confirmadas en el brief. Las últimas 3 son
// PROPUESTAS nuevas — quedan afuera de la rotación (`proposed: true`)
// hasta que se confirmen; no se disparan solas.
// ---------------------------------------------------------------

export const ACTIVITIES: Activity[] = [
  {
    id: "diario",
    dia: "Lunes",
    tag: "Diario de la semana",
    emoji: "📓",
    desc: "Tipo diario íntimo: qué pasó la semana pasada. Arrancamos semanal — si se hace pesado, lo pasamos a mensual.",
    ejemplos: [
      "Un momento bueno y uno de mierda de tu semana.",
      "Lo más random que te pasó de lunes a domingo.",
    ],
    anonimo: false,
  },
  {
    id: "recomendaciones",
    dia: "Martes",
    tag: "Recomendaciones",
    emoji: "🍿",
    desc: "Peli, serie, libro, podcast, lo que sea — algo que estás consumiendo y valga la pena.",
    ejemplos: [
      "Una serie que no podés parar de ver.",
      "Un libro/podcast que te voló la cabeza últimamente.",
    ],
    anonimo: false,
  },
  {
    id: "cringe",
    dia: "Miércoles",
    tag: "Cringe challenge",
    emoji: "🤳",
    desc: "Reto random, sin filtro. Se trata de reírse, no de quedar bien.",
    ejemplos: [
      "Selfie de lo que estás haciendo AHORA, tal cual estás.",
      "Grabate cantando la primera canción que suene en tu playlist.",
    ],
    anonimo: false,
  },
  {
    id: "tea",
    dia: "Viernes",
    tag: "Spill the tea",
    emoji: "🍵",
    desc: "Chisme o confesión — 100% ANÓNIMO, nadie sabe quién lo mandó. Va por un buzón aparte, sin nombre.",
    ejemplos: [
      "Contá el recuerdo más random que tengas de otra persona del grupo — que adivinen quién es.",
      "Confesá una mentira piadosa que le dijiste a alguna.",
    ],
    anonimo: true,
  },
  {
    id: "carta",
    dia: "Rotativo",
    tag: "Carta a una pussie",
    emoji: "💌",
    desc: "Dedicarle algo lindo (o una cargada con amor) a otra del grupo.",
    ejemplos: [
      "Decile a otra pussie algo que nunca le dijiste.",
      "Contá por qué la sumaste al grupito en su momento.",
    ],
    anonimo: false,
  },
  {
    id: "premio",
    dia: "Sin día fijo",
    tag: "Premios",
    emoji: "🏆",
    desc: "Entregas esporádicas, cuando dan ganas. Categorías random votadas o elegidas por LA GOTA.",
    ejemplos: [
      "Premio a la más cambiada del año.",
      "Premio a la mejor excusa para faltar a un plan.",
      "Premio a la que más memes manda.",
    ],
    anonimo: true,
  },

  // --- Propuestas nuevas (a confirmar con la usuaria) ---
  {
    id: "encuesta",
    dia: "Rotativo",
    tag: "Encuesta relámpago",
    emoji: "🗳️",
    desc: "Una pregunta random tipo A o B sobre el grupo — se contesta en 5 segundos y el resultado agregado se comparte en el feed.",
    ejemplos: ["¿Team asado o team sushi?", "¿Playa o montaña para el próximo viaje grupal?"],
    anonimo: false,
    proposed: true,
  },
  {
    id: "capsula",
    dia: "Rotativo",
    tag: "Cápsula del tiempo",
    emoji: "📼",
    desc: "Subir una foto vieja del grupo (o de vos en otra época) con un par de líneas sobre ese momento.",
    ejemplos: ["Una foto de hace 10 años con la primera anécdota que se te venga a la cabeza."],
    anonimo: false,
    proposed: true,
  },
  {
    id: "playlist",
    dia: "Rotativo",
    tag: "Playlist colectiva",
    emoji: "🎧",
    desc: "Cada una suma una canción a una playlist compartida del mes.",
    ejemplos: ["Sumá la canción que más escuchaste esta semana, con una línea de por qué."],
    anonimo: false,
    proposed: true,
  },
];

const CONFIRMED = ACTIVITIES.filter((a) => !a.proposed);

function isoWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

/**
 * Las 3 actividades que "tocan" esta semana — 3 notificaciones por
 * semana, rotando de forma determinística (misma semana = mismo
 * resultado para las 22) por las confirmadas. Con 6 confirmadas y 3
 * por semana, cada una vuelve a aparecer cada dos semanas.
 */
export function getWeekActivities(date: Date = new Date(), count = 3): Activity[] {
  const pool = CONFIRMED;
  const offset = isoWeekNumber(date) % pool.length;
  return Array.from({ length: count }, (_, i) => pool[(offset + i) % pool.length]);
}

export function getActivity(id: PilarId): Activity | undefined {
  return ACTIVITIES.find((a) => a.id === id);
}
