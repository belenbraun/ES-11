import type { FeedItem } from "./types";

// ---------------------------------------------------------------
// Con Supabase ya conectado, `friends` y `posts`/`anon_posts` son la
// fuente real (ver lib/supabase/*). Lo que queda acá es solo:
//   - AVATAR_COLORS: paleta para los avatares de iniciales.
//   - FEED: contenido de ejemplo que se muestra únicamente si todavía
//     no hay ningún post real (ver components/tabs/FeedTab.tsx).
//
// La lista de las 22 (nombres, mails, fact, illustration_url) ya no
// vive acá — se carga directo en la tabla `friends` de Supabase (ver
// supabase/schema.sql). Belu ya tiene fila real con su ilustración en
// public/profiles/belu.jpg; el resto se agrega a mano o se auto-crea
// la primera vez que cada una entra con su magic link.
// ---------------------------------------------------------------

// Paleta de colores para avatares (se asignan por índice)
export const AVATAR_COLORS = [
  "#1FB6AC",
  "#FF6F59",
  "#F2A541",
  "#7C6FE0",
  "#3AA6FF",
  "#E0577C",
];

// Feed — EJEMPLOS de muestra para ver el formato final; se muestran
// solo mientras `posts`/`anon_posts` estén vacías en Supabase.
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
