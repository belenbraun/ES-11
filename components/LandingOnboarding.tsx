"use client";

import Image from "next/image";
import { useState } from "react";
import { FRIENDS } from "@/lib/data";

const OTHER = "__otra";

export default function LandingOnboarding({
  hidden,
  onDone,
}: {
  hidden: boolean;
  onDone: (name: string) => void;
}) {
  const [selected, setSelected] = useState("");

  if (hidden) return null;

  function handleGo() {
    let val = selected;
    if (val === OTHER) {
      val = window.prompt("¿Cómo te llamás?") || "Pussie misteriosa";
    }
    if (!val) return;
    onDone(val);
  }

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
          <h2>Llegó LA GOTA que te alegra el día</h2>
          <p className="lead">
            Decinos quién sos para recibirte como corresponde (esto queda solo en tu
            celu, no se comparte con nadie).
          </p>
          <select
            id="nameSelect"
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
          >
            <option value="">Elegí tu nombre…</option>
            {FRIENDS.filter((f) => !/^\(cargar/.test(f.name)).map((f) => (
              <option key={f.name} value={f.name}>
                {f.name}
              </option>
            ))}
            <option value={OTHER}>No me encuentro / prefiero escribirlo</option>
          </select>
          <button className="go" type="button" onClick={handleGo}>
            Listo, entrar
          </button>
        </div>
      </div>
    </div>
  );
}
