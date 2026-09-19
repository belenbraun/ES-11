"use client";

import { useEffect, useRef, useState } from "react";
import { ACTIVITIES, getActivity } from "@/lib/activities";
import { DEST_EMAIL, FRIENDS } from "@/lib/data";
import type { PilarId } from "@/lib/types";

const PILAR_OPTIONS = ACTIVITIES.filter((a) => !a.proposed);

interface Draft {
  pilar: PilarId;
  text: string;
  recipient: string;
  photoName: string | null;
  photoUrl: string | null;
}

export default function SumarTab({
  active,
  authorName,
  prefillPilar,
  onConsumedPrefill,
}: {
  active: boolean;
  authorName: string;
  prefillPilar: PilarId | null;
  onConsumedPrefill: () => void;
}) {
  const [pilar, setPilar] = useState<PilarId>(prefillPilar || PILAR_OPTIONS[0].id);
  const [text, setText] = useState("");
  const [recipient, setRecipient] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState<string | null>(null);
  const [posted, setPosted] = useState<Draft[]>([]);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (prefillPilar) {
      setPilar(prefillPilar);
      onConsumedPrefill();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefillPilar]);

  const activity = getActivity(pilar);
  const isAnon = !!activity?.anonimo;

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoUrl(URL.createObjectURL(file));
    setPhotoName(file.name);
  }

  function clearPhoto() {
    setPhotoUrl(null);
    setPhotoName(null);
    if (fileInput.current) fileInput.current.value = "";
  }

  function handlePost() {
    if (!text.trim()) return;
    setPosted((prev) => [{ pilar, text, recipient, photoName, photoUrl }, ...prev]);
    setText("");
    setRecipient("");
    clearPhoto();
  }

  function mailtoHref() {
    const lines = [
      `Pilar: ${activity?.tag || pilar}`,
      isAnon ? "Autora: (anónimo — no incluyas tu nombre en el mail si querés que quede así)" : `Autora: ${authorName}`,
      pilar === "carta" && recipient ? `Para: ${recipient}` : "",
      "",
      text || "(sin texto)",
      photoName ? "\n(Adjuntá la foto vos mismo/a en este mail — mailto no permite adjuntar automáticamente)" : "",
    ].filter(Boolean);
    const subject = `Sumar a LA GOTA — ${activity?.tag || pilar}`;
    return (
      "mailto:" +
      encodeURIComponent(DEST_EMAIL) +
      "?subject=" +
      encodeURIComponent(subject) +
      "&body=" +
      encodeURIComponent(lines.join("\n"))
    );
  }

  return (
    <section id="tab-sumar" className={active ? "active" : undefined}>
      <div className="card">
        <h3 style={{ fontSize: "1.3rem" }}>¿Qué querés sumar? 👀</h3>
        <p className="body" style={{ marginTop: 6 }}>
          Elegí el pilar, escribí y —si querés— sumá una foto.
        </p>

        <div className="pilar-chips">
          {PILAR_OPTIONS.map((a) => (
            <button
              key={a.id}
              type="button"
              className={`pilar-chip${pilar === a.id ? " on" : ""}`}
              onClick={() => setPilar(a.id)}
            >
              {a.emoji} {a.tag}
            </button>
          ))}
        </div>

        {isAnon && (
          <p className="note anon-note">
            🔒 Este pilar es 100% anónimo: no se guarda tu nombre ni nada que permita
            reconstruir quién lo mandó. Por eso acá no se puede adjuntar foto (podría
            identificarte).
          </p>
        )}

        {pilar === "carta" && (
          <select
            className="finput"
            style={{ marginTop: 10 }}
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          >
            <option value="">¿Para quién es la carta?</option>
            {FRIENDS.filter((f) => !/^\(cargar/.test(f.name)).map((f) => (
              <option key={f.name} value={f.name}>
                {f.name}
              </option>
            ))}
          </select>
        )}

        <textarea
          className="finput"
          style={{ marginTop: 10 }}
          rows={4}
          placeholder={activity?.ejemplos[0] || "Contá lo que quieras…"}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        {!isAnon && (
          <div className="photo-input">
            {photoUrl ? (
              <div className="photo-preview">
                {/* preview de un File local vía object URL — no next/image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photoUrl} alt="Foto seleccionada" />
                <button type="button" className="photo-remove" onClick={clearPhoto}>
                  ✕ quitar
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="cta alt"
                onClick={() => fileInput.current?.click()}
              >
                📷 Sumar una foto
              </button>
            )}
            <input
              ref={fileInput}
              type="file"
              accept="image/*"
              hidden
              onChange={handlePhoto}
            />
          </div>
        )}

        <button className="go" type="button" onClick={handlePost}>
          Sumar →
        </button>
        <p className="note" style={{ marginTop: 8 }}>
          Por ahora esto todavía no se guarda de verdad en ningún lado — se ve tal cual
          va a quedar, pero el envío real llega con el próximo paso (conectar
          Supabase). Mientras tanto, también podés{" "}
          <a href={mailtoHref()}>mandarlo ya por mail</a>.
        </p>
      </div>

      {posted.length > 0 && (
        <div className="card">
          <span className="badge chisme">Vista previa — todavía no guardado</span>
          {posted.map((p, i) => {
            const a = getActivity(p.pilar);
            return (
              <div className="draft-preview" key={i}>
                <span className="week-activity-tag">
                  {a?.emoji} {a?.tag}
                  {p.recipient ? ` → ${p.recipient}` : ""}
                </span>
                <p className="body" style={{ marginTop: 4 }}>
                  {p.text}
                </p>
                {p.photoUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className="pic" src={p.photoUrl} alt="" />
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
