"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Avatar from "@/components/Avatar";
import { fetchAllFriends } from "@/lib/supabase/friends";
import type { FriendProfile } from "@/lib/types";

export default function ProfilesTab({ active }: { active: boolean }) {
  const [friends, setFriends] = useState<FriendProfile[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!active || friends !== null) return;
    fetchAllFriends()
      .then(setFriends)
      .catch((err) => setError(err instanceof Error ? err.message : "No se pudo cargar."));
  }, [active, friends]);

  return (
    <section id="tab-profiles" className={active ? "active" : undefined}>
      <p className="note" style={{ marginTop: 14 }}>
        Las 22 pussies del grupito. (Belén está cargando los datos y fotos de todas —
        se suman a medida que cada una entra por primera vez)
      </p>
      {error && <p className="note">{error}</p>}
      <div className="grid-profiles">
        {(friends || []).map((f, i) => {
          const pending = !f.name || /^\(cargar/.test(f.name);
          return (
            <div className={`profile-card${pending ? " pending" : ""}`} key={f.id}>
              {f.illustration_url ? (
                <div className="profile-illustration-wrap">
                  <Image
                    src={f.illustration_url}
                    alt={f.name || "Pussie"}
                    fill
                    sizes="140px"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              ) : (
                <Avatar name={f.name || "?"} index={i} />
              )}
              <h3>{pending ? "¿Vos?" : f.name}</h3>
              <p>{f.fact || (pending ? "Falta cargar" : "")}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
