"use client";

import Image from "next/image";
import { useState } from "react";
import { sendMagicLink } from "@/lib/supabase/auth";

function LandingShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="landing">
      <div className="landing-scroll">
        <div className="landing-hero">
          <Image
            src="/branding/landing-gota.jpg"
            alt="La Gota de Alegría"
            fill
            sizes="(max-width: 560px) 100vw, 560px"
            style={{ objectFit: "cover" }}
            priority
          />
        </div>
        <div className="landing-content">
          <p className="tagline">pequeñas cosas, grandes días 💧</p>
          {children}
        </div>
      </div>
    </div>
  );
}

/** Fase 1: todavía sin sesión — pedir mail y mandar el magic link. */
export function LandingSignIn() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await sendMagicLink(email.trim());
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo mandar el link.");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <LandingShell>
        <h2>Revisá tu mail 💌</h2>
        <p className="lead">
          Te mandamos un link a <b>{email}</b>. Abrilo desde el mismo celu — si tenés la
          app instalada, mejor abrilo desde ahí para no perder la sesión.
        </p>
        <button className="go" type="button" onClick={() => setSent(false)}>
          Usar otro mail
        </button>
      </LandingShell>
    );
  }

  return (
    <LandingShell>
      <h2>Llegó LA GOTA que te alegra el día</h2>
      <p className="lead">
        Poné tu mail y te mandamos un link para entrar, sin contraseña. Esto es solo
        para las 22 — no se comparte con nadie más.
      </p>
      <form onSubmit={handleSubmit}>
        <input
          className="finput"
          type="email"
          required
          placeholder="tu@mail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ marginBottom: 10 }}
        />
        <button className="go" type="submit" disabled={loading}>
          {loading ? "Mandando…" : "Mandarme el link mágico"}
        </button>
      </form>
      {error && (
        <p className="note" style={{ color: "var(--primary-dark)", marginTop: 10 }}>
          {error}
        </p>
      )}
    </LandingShell>
  );
}

/** Fase 2: ya con sesión, pero todavía sin nombre confirmado en `friends`. */
export function LandingNameStep({
  onSubmit,
}: {
  onSubmit: (name: string) => Promise<void>;
}) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await onSubmit(name.trim());
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar tu nombre.");
      setLoading(false);
    }
  }

  return (
    <LandingShell>
      <h2>¡Ya casi! ¿Cómo te llamás?</h2>
      <p className="lead">
        Así te reconocen las demás en el feed y en &quot;Pussies&quot;. Después lo podés
        cambiar cuando quieras desde &quot;Mi perfil&quot;.
      </p>
      <form onSubmit={handleSubmit}>
        <input
          className="finput"
          required
          placeholder="Tu nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ marginBottom: 10 }}
        />
        <button className="go" type="submit" disabled={loading}>
          {loading ? "Guardando…" : "Listo, entrar"}
        </button>
      </form>
      {error && (
        <p className="note" style={{ color: "var(--primary-dark)", marginTop: 10 }}>
          {error}
        </p>
      )}
    </LandingShell>
  );
}
