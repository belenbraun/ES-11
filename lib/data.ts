import type { FeedItem, Friend } from "./types";

// ---------------------------------------------------------------
// CONTENIDO — portado 1:1 desde la versión Artifact (gota-de-alegria.html).
// Esto sigue siendo data de ejemplo/seed hasta que se conecte Supabase
// (ver supabase/schema.sql y el roadmap en el README). Reemplazar/ampliar
// cuando lleguen las respuestas reales del form o se migren estas listas
// a las tablas `friends` / `posts`.
//
// Los pilares/actividades semanales viven en lib/activities.ts (se
// dejaron de mostrar como tab fija — ahora son la base de las
// notificaciones rotativas).
// ---------------------------------------------------------------

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
// (o migrar a la tabla `friends` de Supabase). Belu ya tiene su
// ilustración estilo Pascualina — el resto queda pendiente de cargar
// en el mismo estilo.
export const FRIENDS: Friend[] = [
  {
    name: "Belu",
    fact: "La que arrancó todo esto por mail hace mil años",
    illustrationUrl: "/profiles/belu.jpg",
  },
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
