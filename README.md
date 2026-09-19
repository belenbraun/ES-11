# La Gota de Alegría

App social privada para el grupo de "las pussies" — feed + actividades rotativas +
perfiles, con la estética diario íntimo/agenda de los 2000. Ver `brief-la-gota.md`
(en el chat original) para el contexto completo del producto.

Esta es la reconstrucción como PWA real de la primera versión (un Claude Artifact
100% estático). El diseño, copy y estructura de contenido de esa versión ya están
validados — se portaron a componentes, ajustando navegación/onboarding según feedback
de la usuaria en la segunda vuelta.

## Stack

- **Next.js 14** (App Router) + TypeScript — frontend y futuras API routes/serverless
  functions para Web Push.
- **Supabase** (Postgres + Auth + Storage) — backend compartido entre las 22, sin
  depender de ninguna organización corporativa.
- **PWA manual** — `public/manifest.webmanifest` + `public/sw.js` (service worker
  escrito a mano, sin `next-pwa`, para tener control directo sobre el manejo de
  Web Push).
- **Vercel** (sugerido) para el deploy — free tier alcanza de sobra.

## Navegación

4 tabs fijas (`components/TabBar.tsx`):

- **Feed** — el diario + un card "Esta semana en LA GOTA" con las 3 actividades que
  tocan (ver Notificaciones).
- **Mi perfil** — tu ilustración (si ya la tenés cargada) + una ficha editable en
  cualquier momento, no solo en el onboarding.
- **Pussies** — grid con las 22.
- **Sumar** — composer único (elegís el pilar, escribís, sumás una foto si aplica).

## Onboarding

Pantalla completa (`components/LandingOnboarding.tsx`) con la estética de la
ilustración de marca ("pequeñas cosas, grandes días"). Se muestra **una sola vez**
por dispositivo (se guarda el nombre en `localStorage`); después de elegir nombre no
vuelve a aparecer. Cualquier dato adicional (apodo, secreto, etc.) se completa
después, desde "Mi perfil", y se puede volver a editar cuando quieras.

## Notificaciones = actividades rotativas

Los 6 pilares del brief (`lib/activities.ts`) ya no viven en una tab fija — son la
base de las notificaciones: **3 por semana, rotando**. `getWeekActivities()` elige
determinísticamente cuáles tocan según el número de semana ISO, así todas ven la
misma "tanda" esa semana (clave para que la notificación push, cuando se conecte,
sea consistente entre las 22). Con 6 confirmadas y 3 por semana, cada una vuelve
cada dos semanas.

Sumé 3 **propuestas nuevas** (marcadas `proposed: true`, fuera de la rotación hasta
que las confirmes):

- 🗳️ **Encuesta relámpago** — pregunta tipo A/B sobre el grupo, resultado agregado en
  el feed.
- 📼 **Cápsula del tiempo** — subir una foto vieja del grupo con un par de líneas.
- 🎧 **Playlist colectiva** — cada una suma una canción a una playlist del mes.

Si querés sumar alguna a la rotación real, se activa cambiando `proposed` a
`undefined`/`false` en `lib/activities.ts` (y `active` en el seed de
`pillar_schedule`).

## Sumar (con foto)

El composer de "Sumar" ya está completo en UI: elegís pilar, escribís, y si el pilar
no es anónimo podés adjuntar una foto (con preview en el momento, antes de mandar).
**Todavía no se guarda en ningún lado de verdad** — es intencional: la foto recién
se sube a Supabase Storage cuando se conecte Supabase (paso 2 del roadmap). Mientras
tanto, el composer también deja mandarlo por mail como plan B (sin la foto adjunta
automática — eso no lo permite `mailto`, hay que adjuntarla a mano en el mail).

Los pilares anónimos (spill the tea, premios) **no muestran la opción de subir
foto** a propósito: una imagen podría de-anonimizar a quien lo manda.

## Perfiles con ilustración

Cada perfil puede tener una ilustración estilo Pascualina/agenda (`Friend.illustrationUrl`
en `lib/data.ts`). Belu ya tiene la suya (`public/profiles/belu.jpg`) y se ve tanto en
el grid de "Pussies" como en "Mi perfil". Las otras 21 quedan con el avatar de
iniciales hasta que se sumen las ilustraciones — son piezas de arte por encargo/generadas
a medida, no algo que la usuaria suba desde la app.

## Estado actual (esqueleto)

- ✅ Proyecto Next.js + TypeScript funcionando, con las 4 tabs, landing de onboarding,
  actividades rotativas y composer de Sumar con foto (preview local).
- ✅ Manifest + service worker instalables, con manejo de `push`/`notificationclick`
  ya armado (falta conectarlo a un backend real que dispare notificaciones).
- ✅ Esquema de Supabase propuesto en `supabase/schema.sql`, con el diseño de
  anonimato real para "spill the tea" y "premios" (tabla `anon_posts` separada,
  sin ninguna columna que permita reconstruir el autor), más columnas de ficha e
  ilustración en `friends`.
- ⏳ **Todavía no conectado**: Feed/Pussies siguen leyendo de `lib/data.ts`, y la
  ficha de "Mi perfil" se guarda en `localStorage` (no en Supabase todavía). Es el
  próximo paso.
- ⏳ Auth liviana (magic link o PIN de grupo) — no implementada todavía.
- ⏳ Subida real de fotos (Supabase Storage) y envío real de Web Push (VAPID +
  función serverless que dispare por actividad activa) — el service worker ya sabe
  recibir y mostrar el push, falta quién lo mande.
- ⏳ Íconos reales de la PWA: hoy `public/icons/icon.svg` es un placeholder
  (la gota con el gradiente de marca). Para que iOS muestre un ícono lindo en la
  pantalla de inicio hace falta generar PNGs (`180x180` apple-touch-icon,
  `192x192`/`512x512` para el manifest).
- ⏳ Ilustraciones estilo Pascualina de las otras 21 pussies.

## Correr en local

```bash
npm install
cp .env.example .env.local   # completar cuando exista el proyecto de Supabase
npm run dev
```

Abrir `http://localhost:3000`.

## Variables de entorno

Ver `.env.example`. Mientras no exista un proyecto de Supabase, la app funciona
igual (todo el contenido sale de `lib/data.ts`); `lib/supabase/client.ts` solo
tira error si algo intenta usar `getSupabase()` sin las env vars configuradas.

## Roadmap (siguiendo el brief)

1. **Esqueleto del proyecto** ← estamos acá (con nav/onboarding/notificaciones ya
   ajustados a la segunda vuelta de feedback).
2. **Meter Supabase**: crear el proyecto, correr `supabase/schema.sql`, migrar
   `FRIENDS`/`FEED` de `lib/data.ts` a filas reales, mover la ficha de "Mi perfil"
   de `localStorage` a la tabla `friends`, y conectar la subida de fotos de "Sumar"
   a Supabase Storage. Definir auth liviana (magic link por mail vs. PIN de grupo
   simple).
3. **Web Push real**: generar claves VAPID, guardar suscripciones en
   `push_subscriptions` desde el cliente (pedir permiso + `PushManager.subscribe`),
   y armar la función serverless que dispara la notificación de las 3 actividades
   de la semana (cron semanal que llame a `getWeekActivities`, o su equivalente en
   `pillar_schedule`).
4. **Deploy a Vercel** con el subdominio gratuito para probar entre las 22, y
   decidir después si vale la pena comprar un dominio propio.
5. **Íconos y splash screens** definitivos, e ilustraciones Pascualina de las 21
   pussies restantes.

### Limitación conocida de iOS

La instalación en iPhone (Safari → Compartir → "Agregar a inicio") requiere
iOS 16.4+ para que las Web Push funcionen dentro de la PWA instalada. Es una
limitación de Apple, no hay forma de evitarla sin pasar por la App Store — hay
que avisarle a las 22 si alguna tiene una versión más vieja.
