# La Gota de Alegría

App social privada para el grupo de "las pussies" — feed + actividades rotativas +
perfiles, con la estética diario íntimo/agenda de los 2000. Ver `brief-la-gota.md`
(en el chat original) para el contexto completo del producto.

Esta es la reconstrucción como PWA real de la primera versión (un Claude Artifact
100% estático). El diseño, copy y estructura de contenido de esa versión ya están
validados — se portaron a componentes, ajustando navegación/onboarding/backend según
las dos vueltas de feedback siguientes.

## Stack

- **Next.js 14** (App Router) + TypeScript — frontend y futuras API routes/serverless
  functions para Web Push.
- **Supabase** (Postgres + Auth + Storage) — backend compartido entre las 22, sin
  depender de ninguna organización corporativa. **Ya conectado** (auth, ficha, posts,
  fotos) — ver "Conectar tu propio proyecto de Supabase" más abajo.
- **PWA manual** — `public/manifest.webmanifest` + `public/sw.js` (service worker
  escrito a mano, sin `next-pwa`, para tener control directo sobre el manejo de
  Web Push).
- **Vercel** (sugerido) para el deploy — free tier alcanza de sobra.

## Navegación

4 tabs fijas (`components/TabBar.tsx`):

- **Feed** — el diario + un card "Esta semana en LA GOTA" con las 3 actividades que
  tocan (ver Notificaciones). Muestra posts reales de Supabase; mientras no haya
  ninguno, muestra contenido de ejemplo.
- **Mi perfil** — tu ilustración (si ya la tenés cargada) + una ficha editable en
  cualquier momento, guardada en `friends`.
- **Pussies** — grid con las 22, leído en vivo de `friends`.
- **Sumar** — composer único (elegís el pilar, escribís, sumás una foto si aplica) que
  postea de verdad a `posts` o `anon_posts`.

## Auth: magic link por mail

Se eligió **magic link** (no PIN de grupo): cada una pone su mail en la landing,
Supabase le manda un link, entra sin contraseña (`lib/supabase/auth.ts`).

Cómo se resuelve la identidad la primera vez que alguien entra
(`components/AppShell.tsx`):

1. ¿Ya existe una fila en `friends` con `auth_user_id` = esta sesión? → entra directo.
2. Si no, ¿hay una fila pre-cargada por Belén con ese mismo mail (`email`) y ya tiene
   un nombre real (no un placeholder)? → se "reclama" esa fila (se le setea
   `auth_user_id`), hereda `fact`/`illustration_url`/ficha si ya estaban cargados.
3. Si no hay nada pre-cargado (o el nombre es un placeholder), se le pregunta el
   nombre una vez (`LandingNameStep`) y se crea la fila.

**Limitación conocida de iOS/PWA con magic link:** si el mail se abre en Safari en vez
de en la app instalada, la sesión queda en esa ventana de Safari, no en la PWA (es
una limitación de cómo iOS particiona el storage entre la PWA instalada y el
navegador, no algo que se pueda evitar desde el código). Recomendación práctica para
las 22: abrir el mail *desde el celu donde está instalada la app*, idealmente tocando
el link con la app ya abierta en background.

## Onboarding

Pantalla completa (`components/LandingOnboarding.tsx`) con la estética de la
ilustración de marca ("pequeñas cosas, grandes días"): pedir mail → mandar magic link
→ (la primera vez) confirmar nombre. Se muestra una sola vez por sesión de Supabase;
mientras haya sesión activa, no vuelve a aparecer. Cualquier dato adicional (apodo,
secreto, etc.) se completa después, desde "Mi perfil", y se puede volver a editar
cuando quieras.

## Notificaciones = actividades rotativas

Los 6 pilares del brief (`lib/activities.ts`) no viven en una tab fija — son la base
de las notificaciones: **3 por semana, rotando**. `getWeekActivities()` elige
determinísticamente cuáles tocan según el número de semana ISO, así todas ven la
misma "tanda" esa semana (clave para que la notificación push, cuando se conecte,
sea consistente entre las 22). Con 6 confirmadas y 3 por semana, cada una vuelve
cada dos semanas.

Sumé 3 **propuestas nuevas** (marcadas `proposed: true`, fuera de la rotación hasta
que las confirmes): 🗳️ Encuesta relámpago, 📼 Cápsula del tiempo, 🎧 Playlist
colectiva. Se activan cambiando `proposed` a `undefined`/`false` en
`lib/activities.ts` (y `active` en el seed de `pillar_schedule`).

## Sumar (con foto) — ya guarda de verdad

El composer de "Sumar" postea a Supabase de verdad:

- Pilares con autor (diario, recomendaciones, cringe, carta) → `posts`, con la foto
  (si hay) subida primero a Storage (`lib/supabase/posts.ts::uploadPostPhoto`) y su
  URL pública guardada en `media_url`.
- Pilares anónimos (spill the tea, premios) → `anon_posts`, **sin** `author_id` ni
  ninguna columna que permita reconstruir el autor, y usando un cliente de Supabase
  separado que nunca inició sesión (`lib/supabase/anonClient.ts`) para que ni el
  request en sí lleve un JWT identificable. Por eso, a propósito, estos pilares no
  muestran la opción de subir foto en el composer: una imagen podría de-anonimizar a
  quien lo manda.

## Perfiles con ilustración

Cada fila de `friends` puede tener `illustration_url` (estilo Pascualina/agenda).
Belu ya tiene la suya (`public/profiles/belu.jpg`) cargada como seed inicial — ver
"Conectar tu propio proyecto de Supabase" para el insert. Las otras 21 quedan con el
avatar de iniciales hasta que se sumen las ilustraciones — son piezas de arte por
encargo/generadas a medida, no algo que la usuaria suba desde la app.

## Conectar tu propio proyecto de Supabase

1. Crear un proyecto en [supabase.com](https://supabase.com) (plan free alcanza).
2. En **SQL Editor**, pegar y correr entero `supabase/schema.sql` — crea las tablas,
   las policies de RLS y el bucket `posts-media`.
3. En **Authentication → Providers**, confirmar que **Email** esté habilitado (viene
   así por default). En **Authentication → URL Configuration**, agregar como
   *Redirect URLs* tanto `http://localhost:3000` (para desarrollo) como la URL de
   Vercel del paso 4 del roadmap, apenas exista.
4. (Opcional pero recomendado) Precargar en `friends` a quienes ya tengan mail
   confirmado, para que "hereden" nombre/fact/ilustración al entrar. Ejemplo para
   Belu:
   ```sql
   insert into friends (name, email, fact, illustration_url)
   values ('Belu', 'BELU@MAIL-REAL.COM',
           'La que arrancó todo esto por mail hace mil años',
           '/profiles/belu.jpg');
   ```
   Sin este paso, igual funciona: la primera vez que cada una entra con su magic
   link, se le pregunta el nombre y se crea su fila sola.
5. En **Project Settings → API**, copiar el **Project URL** y la **anon public key**
   (esa es segura de compartir/pegar, está pensada para el cliente) a `.env.local`:
   ```bash
   cp .env.example .env.local
   # completar NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY
   ```
   La **service role key** NO va acá (ni al front en general) — solo se necesita más
   adelante para la función serverless de Web Push (paso 3 del roadmap).
6. `npm run dev` y probar el login con tu propio mail.

Sin `.env.local` configurado, la app muestra una pantalla de aviso en vez de romper
(`AppShell.tsx`, fase `not-configured`) — sirve para tocar el resto del código sin
tener un proyecto de Supabase a mano.

## Estado actual

- ✅ Auth por magic link, con "reclamo" de perfiles pre-cargados o auto-creación.
- ✅ "Mi perfil" y "Pussies" leen/escriben de verdad en `friends`.
- ✅ "Sumar" postea de verdad a `posts`/`anon_posts`, con subida de fotos a Storage.
- ✅ Feed lee posts reales, con fallback a contenido de ejemplo mientras esté vacío.
- ✅ Diseño de anonimato real para spill-the-tea/premios (tabla separada + cliente
  sin sesión para esos inserts).
- ✅ Manifest + service worker instalables, con manejo de `push`/`notificationclick`
  ya armado (falta conectarlo a un backend real que dispare notificaciones).
- ⏳ Envío real de Web Push (VAPID + función serverless que dispare por actividad
  activa) — el service worker ya sabe recibir y mostrar el push, falta quién lo
  mande.
- ⏳ Íconos reales de la PWA: hoy `public/icons/icon.svg` es un placeholder. Para que
  iOS muestre un ícono lindo en la pantalla de inicio hace falta generar PNGs
  (`180x180` apple-touch-icon, `192x192`/`512x512` para el manifest).
- ⏳ Ilustraciones estilo Pascualina de las otras 21 pussies.
- ⏳ Deploy a Vercel (paso 4 del roadmap).

## Correr en local

```bash
npm install
cp .env.example .env.local   # ver "Conectar tu propio proyecto de Supabase"
npm run dev
```

Abrir `http://localhost:3000`.

## Roadmap (siguiendo el brief)

1. ~~Esqueleto del proyecto~~ ✅
2. ~~Meter Supabase~~ ✅ — schema, auth por magic link, ficha, posts y fotos ya
   conectados de verdad.
3. **Web Push real**: generar claves VAPID (`npx web-push generate-vapid-keys`),
   guardar suscripciones en `push_subscriptions` desde el cliente (pedir permiso +
   `PushManager.subscribe`), y armar la función serverless que dispara la
   notificación de las 3 actividades de la semana (cron semanal que llame a
   `getWeekActivities`, o su equivalente en `pillar_schedule`). Necesita la
   `SUPABASE_SERVICE_ROLE_KEY` (solo server-side, nunca en el cliente).
4. **Deploy a Vercel** con el subdominio gratuito para probar entre las 22 (agregar
   esa URL a los Redirect URLs de Supabase Auth), y decidir después si vale la pena
   comprar un dominio propio.
5. **Íconos y splash screens** definitivos, e ilustraciones Pascualina de las 21
   pussies restantes.

### Limitación conocida de iOS

La instalación en iPhone (Safari → Compartir → "Agregar a inicio") requiere
iOS 16.4+ para que las Web Push funcionen dentro de la PWA instalada. Es una
limitación de Apple, no hay forma de evitarla sin pasar por la App Store — hay
que avisarle a las 22 si alguna tiene una versión más vieja.
