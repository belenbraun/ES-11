"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Avatar from "@/components/Avatar";
import { FRIENDS } from "@/lib/data";
import { useLocalJSON } from "@/hooks/useLocalJSON";
import type { ProfileFicha } from "@/lib/types";

const EMPTY_FICHA: ProfileFicha = {};

export default function ProfileTab({ active, name }: { active: boolean; name: string }) {
  const { value: ficha, set: setFicha, hydrated } = useLocalJSON<ProfileFicha>(
    "gota_ficha",
    EMPTY_FICHA,
  );
  const [draft, setDraft] = useState<ProfileFicha>(EMPTY_FICHA);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (hydrated) setDraft(ficha);
  }, [hydrated, ficha]);

  const friendIndex = FRIENDS.findIndex(
    (f) => f.name.toLowerCase() === name.toLowerCase(),
  );
  const friend = friendIndex >= 0 ? FRIENDS[friendIndex] : undefined;

  function field(key: keyof ProfileFicha, label: string, placeholder: string) {
    return (
      <label className="ficha-field">
        <span>{label}</span>
        <input
          className="finput"
          value={draft[key] || ""}
          placeholder={placeholder}
          onChange={(e) => setDraft((d) => ({ ...d, [key]: e.target.value }))}
        />
      </label>
    );
  }

  return (
    <section id="tab-profile" className={active ? "active" : undefined}>
      <div className="card profile-hero">
        {friend?.illustrationUrl ? (
          <div className="profile-hero-illustration">
            <Image
              src={friend.illustrationUrl}
              alt={name}
              fill
              sizes="(max-width: 560px) 100vw, 560px"
              style={{ objectFit: "cover" }}
              priority
            />
          </div>
        ) : (
          <Avatar name={name} index={Math.max(friendIndex, 0)} className="profile-hero-avatar" />
        )}
        <h2 style={{ marginTop: 10 }}>{name}</h2>
        {!friend?.illustrationUrl && (
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
          {field("apodo", "¿Cómo te dicen?", "Apodo")}
          {field("hijos", "Hijes", "Nombre/s y edad/es")}
          {field("palabra", "Una palabra que te describe HOY", "")}
          {field("secreto", "Algo que nadie del grupo sabe de vos", "")}
          {field("electro", "Si fueras un electrodoméstico, ¿cuál serías?", "")}
          {field("favorita", "Canción/serie/comida de la que no te cansás", "")}
          <label className="ficha-field">
            <span>¿Te pasó algo random esta semana?</span>
            <textarea
              className="finput"
              rows={3}
              value={draft.random || ""}
              onChange={(e) => setDraft((d) => ({ ...d, random: e.target.value }))}
            />
          </label>
        </div>
        <button
          className="go"
          type="button"
          onClick={() => {
            setFicha(draft);
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
          }}
        >
          {saved ? "¡Guardado! ✓" : "Guardar cambios"}
        </button>
      </div>
    </section>
  );
}
