"use client";

import { useMemo } from "react";
import { getWeekActivities } from "@/lib/activities";
import type { PilarId } from "@/lib/types";

export default function WeekActivities({
  onRespond,
}: {
  onRespond: (pilar: PilarId) => void;
}) {
  const activities = useMemo(() => getWeekActivities(), []);

  return (
    <div className="card week-activities">
      <span className="badge challenge">📬 Esta semana en LA GOTA</span>
      <p className="body" style={{ marginBottom: 10 }}>
        3 actividades por semana, rotando — las de esta semana también te van a llegar
        como notificación push.
      </p>
      {activities.map((a) => (
        <div className="week-activity-row" key={a.id}>
          <div>
            <span className="week-activity-tag">
              {a.emoji} {a.dia} · {a.tag}
              {a.anonimo && <span className="anon-pill">anónimo</span>}
            </span>
            <p className="body" style={{ marginTop: 4, fontSize: "0.92rem" }}>
              {a.desc}
            </p>
          </div>
          <button type="button" className="cta alt" onClick={() => onRespond(a.id)}>
            Responder →
          </button>
        </div>
      ))}
    </div>
  );
}
