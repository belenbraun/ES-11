"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ACTIVITIES, getActivity } from "@/lib/activities";
import { fetchAllFriends } from "@/lib/supabase/friends";
import { createAnonPost, createPost, uploadPostPhoto } from "@/lib/supabase/posts";
import type { FriendProfile, PilarId } from "@/lib/types";

const PILAR_OPTIONS = ACTIVITIES.filter((a) => !a.proposed);

interface PostedPreview {
  pilar: PilarId;
  text: string;
  recipientName: string | null;
  photoUrl: string | null;
}

export default function SumarTab({
  active,
  authorId,
  authorName,
  prefillPilar,
  onConsumedPrefill,
}: {
  active: boolean;
  authorId: string;
  authorName: string;
  prefillPilar: PilarId | null;
  onConsumedPrefill: () => void;
}) {
  const [pilar, setPilar] = useState<PilarId>(prefillPilar || PILAR_OPTIONS[0].id);
  const [text, setText] = useState("");
  const [recipientId, setRecipientId] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [friends, setFriends] = useState<FriendProfile[] | null>(null);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [posted, setPosted] = useState<PostedPreview[]>([]);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (prefillPilar) {
      setPilar(prefillPilar);
      onConsumedPrefill();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefillPilar]);

  useEffect(() => {
    if (pilar === "carta" && friends === null) {
      fetchAllFriends()
        .then(setFriends)
        .catch((err) => setError(err instanceof Error ? err.message : "No se pudo cargar."));
    }
  }, [pilar, friends]);

  const activity = getActivity(pilar);
  const isAnon = !!activity?.anonimo;

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  function clearPhoto() {
    setPhotoFile(null);
    setPhotoPreview(null);
    if (fileInput.current) fileInput.current.value = "";
  }

  async function handlePost() {
    if (!text.trim() || posting) return;
    setPosting(true);
    setError(null);
    try {
      let mediaUrl: string | null = null;
      let recipientName: string | null = null;

      if (isAnon) {
        await createAnonPost({ pillar: pilar, text: text.trim() });
      } else {
        if (photoFile) mediaUrl = await uploadPostPhoto(authorId, photoFile);
        if (pilar === "carta" && recipientId) {
          recipientName = friends?.find((f) => f.id === recipientId)?.name || null;
        }
        await createPost({
          pillar: pilar,
          authorId,
          authorName,
          text: text.trim(),
          mediaUrl,
          recipientId: pilar === "carta" ? recipientId || null : null,
        });
      }

      setPosted((prev) => [
        { pilar, text: text.trim(), recipientName, photoUrl: mediaUrl || photoPreview },
        ...prev,
      ]);
      setText("");
      setRecipientId("");
      clearPhoto();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo mandar. Probá de nuevo.");
    } finally {
      setPosting(false);
    }
  }

  const recipientOptions = useMemo(
    () => (friends || []).filter((f) => f.id !== authorId && f.name && !/^\(cargar/.test(f.name)),
    [friends, authorId],
  );

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
            value={recipientId}
            onChange={(e) => setRecipientId(e.target.value)}
          >
            <option value="">¿Para quién es la carta?</option>
            {recipientOptions.map((f) => (
              <option key={f.id} value={f.id}>
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
            {photoPreview ? (
              <div className="photo-preview">
                {/* preview de un File local vía object URL — no next/image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photoPreview} alt="Foto seleccionada" />
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

        <button className="go" type="button" onClick={handlePost} disabled={posting}>
          {posting ? "Mandando…" : "Sumar →"}
        </button>
        {error && (
          <p className="note" style={{ color: "var(--primary-dark)", marginTop: 8 }}>
            {error}
          </p>
        )}
      </div>

      {posted.length > 0 && (
        <div className="card">
          <span className="badge chisme">¡Sumado! ✓</span>
          {posted.map((p, i) => {
            const a = getActivity(p.pilar);
            return (
              <div className="draft-preview" key={i}>
                <span className="week-activity-tag">
                  {a?.emoji} {a?.tag}
                  {p.recipientName ? ` → ${p.recipientName}` : ""}
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
