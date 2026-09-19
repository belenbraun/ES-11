"use client";

import { useState } from "react";
import Sheet from "./Sheet";
import { FORM_URL, FRIENDS } from "@/lib/data";

const OTHER = "__otra";

export default function OnboardingSheet({
  hidden,
  onDone,
}: {
  hidden: boolean;
  onDone: (name: string) => void;
}) {
  const [selected, setSelected] = useState("");

  function handleGo() {
    let val = selected;
    if (val === OTHER) {
      val = window.prompt("¿Cómo te llamás?") || "Pussie misteriosa";
    }
    if (!val) return;
    onDone(val);
  }

  return (
    <Sheet id="onboardVeil" hidden={hidden} onDismiss={() => {}}>
      <h2>Llegó LA GOTA que te alegra el día 💧</h2>
      <p className="lead">
        Decinos quién sos para recibirte como corresponde (esto queda solo en tu celu, no
        se comparte con nadie).
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
      <a
        className="cta alt"
        href={FORM_URL}
        target="_blank"
        rel="noopener noreferrer"
        style={{ marginTop: 12, width: "100%", justifyContent: "center" }}
      >
        Che, ¿te pasó algo raro esta semana? Contanos →
      </a>
    </Sheet>
  );
}
