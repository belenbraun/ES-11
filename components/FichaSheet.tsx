"use client";

import { FormEvent } from "react";
import Sheet from "./Sheet";
import { DEST_EMAIL } from "@/lib/data";

export default function FichaSheet({
  hidden,
  onClose,
}: {
  hidden: boolean;
  onClose: () => void;
}) {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = e.currentTarget;
    const nombre = (f.elements.namedItem("nombre") as HTMLInputElement).value.trim();
    if (!nombre) {
      (f.elements.namedItem("nombre") as HTMLInputElement).focus();
      return;
    }
    const field = (name: string) =>
      (f.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement).value || "-";

    const lines = [
      "Ficha pussie de: " + nombre,
      "Apodo: " + field("apodo"),
      "Hijes: " + field("hijos"),
      "Palabra de hoy: " + field("palabra"),
      "Secreto: " + field("secreto"),
      "Electrodoméstico: " + field("electro"),
      "Favorita (canción/serie/comida): " + field("favorita"),
      "Algo random de esta semana: " + field("random"),
    ];
    const subject = "Ficha pussie - " + nombre;
    const body = lines.join("\n");
    const mailto =
      "mailto:" +
      encodeURIComponent(DEST_EMAIL) +
      "?subject=" +
      encodeURIComponent(subject) +
      "&body=" +
      encodeURIComponent(body);
    window.location.href = mailto;
    onClose();
  }

  return (
    <Sheet id="fichaVeil" hidden={hidden} onDismiss={onClose} wide>
      <h2>La ficha pussie 📇</h2>
      <p className="lead">
        Completá lo que quieras (nada es obligatorio salvo tu nombre) y se abre tu mail
        para mandarlo. Si querés mandar una foto, adjuntala vos ahí.
      </p>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 10 }}
      >
        <input className="finput" name="nombre" placeholder="Tu nombre *" required />
        <input className="finput" name="apodo" placeholder="¿Cómo te dicen? (apodo)" />
        <input className="finput" name="hijos" placeholder="Hijes — nombre/s y edad/es" />
        <input className="finput" name="palabra" placeholder="Una palabra que te describe HOY" />
        <input className="finput" name="secreto" placeholder="Algo que nadie del grupo sabe de vos" />
        <input
          className="finput"
          name="electro"
          placeholder="Si fueras un electrodoméstico, ¿cuál serías y por qué?"
        />
        <input
          className="finput"
          name="favorita"
          placeholder="Canción/serie/comida de la que no te cansás"
        />
        <textarea
          className="finput"
          name="random"
          placeholder="¿Te pasó algo random/gracioso esta semana?"
          rows={3}
        />
        <button className="go" type="submit">
          Mandar por mail →
        </button>
      </form>
    </Sheet>
  );
}
