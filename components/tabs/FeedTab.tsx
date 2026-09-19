"use client";

import { useEffect, useState } from "react";
import Avatar from "@/components/Avatar";
import WeekActivities from "@/components/WeekActivities";
import { getActivity } from "@/lib/activities";
import { FEED } from "@/lib/data";
import { fetchRecentAnonPosts, fetchRecentPosts } from "@/lib/supabase/posts";
import type { AnonPostRecord, FeedItemType, PilarId, PostRecord } from "@/lib/types";

const BADGE: Record<FeedItemType, { label: string; className: string }> = {
  onthisday: { label: "Un día como hoy", className: "onthisday" },
  challenge: { label: "Challenge activo", className: "challenge" },
  chisme: { label: "Chisme / recuerdo", className: "chisme" },
};

type Entry =
  | { kind: "post"; data: PostRecord }
  | { kind: "anon"; data: AnonPostRecord };

function formatWhen(iso: string) {
  return new Date(iso).toLocaleDateString("es-AR", { day: "2-digit", month: "short" });
}

export default function FeedTab({
  active,
  onRespond,
}: {
  active: boolean;
  onRespond: (pilar: PilarId) => void;
}) {
  const [entries, setEntries] = useState<Entry[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!active || entries !== null) return;
    Promise.all([fetchRecentPosts(), fetchRecentAnonPosts()])
      .then(([posts, anon]) => {
        const merged: Entry[] = [
          ...posts.map((data): Entry => ({ kind: "post", data })),
          ...anon.map((data): Entry => ({ kind: "anon", data })),
        ].sort(
          (a, b) => new Date(b.data.created_at).getTime() - new Date(a.data.created_at).getTime(),
        );
        setEntries(merged);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "No se pudo cargar el feed."));
  }, [active, entries]);

  const hasRealContent = (entries?.length || 0) > 0;

  return (
    <section id="tab-feed" className={active ? "active" : undefined}>
      <WeekActivities onRespond={onRespond} />

      {error && <p className="note">{error}</p>}

      {hasRealContent
        ? entries!.map((entry, i) => {
            const isAnon = entry.kind === "anon";
            const pilar = entry.data.pillar;
            const activity = getActivity(pilar);
            const text = entry.data.text_content;
            const mediaUrl = entry.kind === "post" ? entry.data.media_url : null;
            const authorName = entry.kind === "post" ? entry.data.author_name : "Anónimo del grupo";
            const recipientTag =
              entry.kind === "post" && entry.data.recipient_id ? " 💌" : "";

            return (
              <div className="card" key={`${entry.kind}-${entry.data.id}`}>
                <span className={`badge ${isAnon ? "chisme" : "challenge"}`}>
                  {activity?.emoji} {activity?.tag || pilar}
                  {recipientTag}
                </span>
                <div className="author">
                  <Avatar name={authorName || "?"} index={i} />
                  <div>
                    <div className="who">{authorName}</div>
                    <div className="when">{formatWhen(entry.data.created_at)}</div>
                  </div>
                </div>
                <p className="body">{text}</p>
                {mediaUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className="pic" src={mediaUrl} alt="" />
                )}
              </div>
            );
          })
        : FEED.map((item, i) => {
            const badge = BADGE[item.type];
            return (
              <div className="card" key={`${item.author}-${i}`}>
                <span className={`badge ${badge.className}`}>{badge.label}</span>
                <div className="author">
                  <Avatar name={item.author} index={i} />
                  <div>
                    <div className="who">{item.author}</div>
                    <div className="when">{item.when}</div>
                  </div>
                </div>
                <p className="body">{item.text}</p>
                {item.cta && (
                  <button type="button" className="cta" onClick={() => onRespond("cringe")}>
                    {item.cta} →
                  </button>
                )}
                {item.reactions && (
                  <div className="reactions">
                    <span>{item.reactions}</span>
                  </div>
                )}
              </div>
            );
          })}

      <p className="note">
        {hasRealContent
          ? "¿Tenés algo más para sumar? Tocá \"Sumar\" abajo 💧"
          : "Todavía no hay nada posteado de verdad — esto de acá arriba son ejemplos. ¿Tenés algo para sumar? Tocá \"Sumar\" abajo 💧"}
      </p>
    </section>
  );
}
