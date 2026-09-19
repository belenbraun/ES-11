"use client";

import Image from "next/image";
import { useState } from "react";
import Avatar from "@/components/Avatar";
import { updateMyFicha } from "@/lib/supabase/auth";
import type { FriendProfile } from "@/lib/types";

type FichaKey = "apodo" | "hijos" | "palabra" | "secreto" | "electro" | "favorita" | "random_fact";

export default function ProfileTab({
  active,
  friend,
  onUpdated,
}: {
  active: boolean;
  friend: FriendProfile;
  onUpdated: (friend: FriendProfile) => void;
}) {
  const [draft, setDraft] = useState<FriendProfile>(friend);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function field(key: FichaKey, label: string) {
    return (
      <label className="ficha-field">
        <span>{label}</span>
        <input
          className="finput"
          value={draft[key] || ""}
          onChange={(e) => setDraft((d) => ({ ...d, [key]: e.target.value }))}
        />
      </label>
    );
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const patch = {
        apodo: draft.apodo,
        hijos: draft.hijos,
        palabra: draft.palabra,
        secreto: draft.secreto,
        electro: draft.electro,
        favorita: draft.favorita,
        random_fact: draft.random_fact,
      };
      await updateMyFicha(patch);
      onUpdated({ ...friend, ...patch });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section id="tab-profile" className={active ? "active" : undefined}>
      <div className="card profile-hero">
        {friend.illustration_url ? (
          <div className="profile-hero-illustration">
            <Image
              src={friend.illustration_url}
              alt={friend.name || "Vos"}
              fill
              sizes="(max-width: 560px) 100vw, 560px"
              style={{ objectFit: "cover" }}
              priority
            />
          </div>
        ) : (
          <Avatar name={friend.name || "?"} index={0} className="profile-hero-avatar" />
        )}
        <h2 style={{ marginTop: 10 }}>{friend.name}</h2>
        {!friend.illustration_url && (
          <p className="note" style={{ marginTop: 4 }}>
            Todavía no tenés tu ilustración estilo Pascualina cargada — se puede sumar
            más adelante, en el mismo estilo que la de Belu.
          </p>
        )}
      </div>

      <div className="card">
        <h3 style={{ fontSize: "1.3rem" }}>Tu ficha pussie 📇</h3>
        <p className="body" style={{ marginTop: 6 }}>
          Completá lo que quieras — nada es obligatorio, y podés volver acá cuando
          quieras a cambiarlo.
        </p>
        <div className="ficha-form">
          {field("apodo", "¿Cómo te dicen?")}
          {field("hijos", "Hijes — nombre/s y edad/es")}
          {field("palabra", "Una palabra que te describe HOY")}
          {field("secreto", "Algo que nadie del grupo sabe de vos")}
          {field("electro", "Si fueras un electrodoméstico, ¿cuál serías?")}
          {field("favorita", "Canción/serie/comida de la que no te cansás")}
          <label className="ficha-field">
            <span>¿Te pasó algo random esta semana?</span>
            <textarea
              className="finput"
              rows={3}
              value={draft.random_fact || ""}
              onChange={(e) => setDraft((d) => ({ ...d, random_fact: e.target.value }))}
            />
          </label>
        </div>
        <button className="go" type="button" onClick={handleSave} disabled={saving}>
          {saved ? "¡Guardado! ✓" : saving ? "Guardando…" : "Guardar cambios"}
        </button>
        {error && (
          <p className="note" style={{ color: "var(--primary-dark)", marginTop: 8 }}>
            {error}
          </p>
        )}
      </div>
    </section>
  );
}
