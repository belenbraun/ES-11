# La Gota de Alegría

App social privada para el grupo de "las pussies" — feed + challenges rotativos +
perfiles, con la estética diario íntimo/agenda de los 2000. Ver `brief-la-gota.md`
(en el chat original) para el contexto completo del producto.

Esta es la reconstrucción como PWA real de la primera versión (un Claude Artifact
100% estático). El diseño, copy y estructura de contenido de esa versión ya están
validados — se portaron tal cual a componentes, no se rediseñó nada.

## Stack

- **Next.js 14** (App Router) + TypeScript — frontend y futuras API routes/serverless
  functions para Web Push.
- **Supabase** (Postgres + Auth + Storage) — backend compartido entre las 22, sin
  depender de ninguna organización corporativa.
- **PWA manual** — `public/manifest.webmanifest` + `public/sw.js` (service worker
  escrito a mano, sin `next-pwa`, para tener control directo sobre el manejo de
  Web Push).
- **Vercel** (sugerido) para el deploy — free tier alcanza de sobra.

## Estado actual (esqueleto)

- ✅ Proyecto Next.js + TypeScript funcionando.
- ✅ Diseño migrado a componentes React (`components/`), estilos portados 1:1 en
  `app/globals.css` (mismas variables de color, tipografías Caveat/Patrick Hand vía
  `next/font`).
- ✅ Navegación por tabs (Feed / Challenges / Pussies) + modales de onboarding,
  "Sumar" y "Ficha pussie", con la misma lógica que la versión Artifact
  (localStorage para nombre/última tab, mailto para la ficha).
- ✅ Manifest + service worker instalables, con manejo de `push`/`notificationclick`
  ya armado (falta conectarlo a un backend real que dispare notificaciones).
- ✅ Esquema de Supabase propuesto en `supabase/schema.sql`, con el diseño de
  anonimato real para "spill the tea" y "premios" (tabla `anon_posts` separada,
  sin ninguna columna que permita reconstruir el autor).
- ⏳ **Todavía no conectado**: Feed/Challenges/Profiles siguen leyendo de
  `lib/data.ts` (los mismos arrays `FEED`/`PILARES`/`FRIENDS` de la versión
  Artifact) en vez de Supabase. Es el próximo paso.
- ⏳ Auth liviana (magic link o PIN de grupo) — no implementada todavía.
- ⏳ Envío real de Web Push (VAPID + función serverless que dispare por pilar
  activo) — el service worker ya sabe recibir y mostrar el push, falta quién lo
  mande.
- ⏳ Íconos reales de la PWA: hoy `public/icons/icon.svg` es un placeholder
  (la gota con el gradiente de marca). Para que iOS muestre un ícono lindo en la
  pantalla de inicio hace falta generar PNGs (`180x180` apple-touch-icon,
  `192x192`/`512x512` para el manifest) — se puede hacer con cualquier exportador
  de SVG a PNG a partir del mismo ícono.

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

1. **Esqueleto del proyecto** ← estamos acá.
2. **Meter Supabase**: crear el proyecto, correr `supabase/schema.sql`, migrar
   `FRIENDS`/`FEED`/`PILARES` de `lib/data.ts` a filas reales (`friends`,
   `posts`, `pillar_schedule`), y reemplazar las lecturas estáticas de los tabs
   por queries a Supabase. Definir auth liviana (magic link por mail vs. PIN de
   grupo simple).
3. **Web Push real**: generar claves VAPID, guardar suscripciones en
   `push_subscriptions` desde el cliente (pedir permiso + `PushManager.subscribe`),
   y armar la función serverless que dispara notificación según
   `pillar_schedule` (cron o manual desde un panel simple).
4. **Deploy a Vercel** con el subdominio gratuito para probar entre las 22, y
   decidir después si vale la pena comprar un dominio propio.
5. **Íconos y splash screens** definitivos a partir de `public/icons/icon.svg`.

### Limitación conocida de iOS

La instalación en iPhone (Safari → Compartir → "Agregar a inicio") requiere
iOS 16.4+ para que las Web Push funcionen dentro de la PWA instalada. Es una
limitación de Apple, no hay forma de evitarla sin pasar por la App Store — hay
que avisarle a las 22 si alguna tiene una versión más vieja.
