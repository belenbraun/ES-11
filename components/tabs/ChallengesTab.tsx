import { FORM_URL, PILARES, TEA_FORM_URL } from "@/lib/data";

export default function ChallengesTab({ active }: { active: boolean }) {
  return (
    <section id="tab-challenges" className={active ? "active" : undefined}>
      <div className="card">
        <h3 style={{ fontSize: "1.4rem" }}>Los pilares de LA GOTA</h3>
        <p className="body" style={{ marginTop: 6 }}>
          Se activan 2-3 veces por semana, siempre alrededor de estos 6 palos. Así sabés
          más o menos qué esperar (pero no cuándo 👀).
        </p>
      </div>
      {PILARES.map((p) => {
        const anonimo = p.tag === "Spill the tea" || p.tag === "Premios";
        const url = anonimo ? TEA_FORM_URL : FORM_URL;
        const label =
          p.tag === "Spill the tea"
            ? "Contar anónimo →"
            : p.tag === "Premios"
              ? "Nominar (anónimo) →"
              : "Responder →";
        return (
          <div className="card" key={p.tag}>
            <span className="badge challenge">
              {p.emoji} {p.dia} · {p.tag}
            </span>
            <p className="body">
              <b>{p.desc}</b>
            </p>
            <p className="body" style={{ marginTop: 8, color: "var(--ink-soft)" }}>
              Ej: {p.ejemplos.join(" · ")}
            </p>
            <a className="cta alt" href={url} target="_blank" rel="noopener noreferrer">
              {label}
            </a>
          </div>
        );
      })}
    </section>
  );
}
