"use client";

import Sheet from "./Sheet";
import { FORM_URL, TEA_FORM_URL } from "@/lib/data";

export default function SumSheet({
  hidden,
  onClose,
  onOpenFicha,
}: {
  hidden: boolean;
  onClose: () => void;
  onOpenFicha: () => void;
}) {
  return (
    <Sheet id="sumVeil" hidden={hidden} onDismiss={onClose}>
      <h2>¿Qué querés sumar? 👀</h2>
      <p className="lead">
        Elegí una — las dos terminan en el mismo lugar: la bandeja de LA GOTA.
      </p>
      <button
        className="go"
        type="button"
        style={{ marginBottom: 10 }}
        onClick={onOpenFicha}
      >
        📝 Contame de vos (la ficha)
      </button>
      <a
        className="cta alt"
        href={FORM_URL}
        target="_blank"
        rel="noopener noreferrer"
        style={{ width: "100%", justifyContent: "center", marginBottom: 10 }}
        onClick={onClose}
      >
        🎯 Challenge / selfie / recomendación →
      </a>
      <a
        className="cta"
        href={TEA_FORM_URL}
        target="_blank"
        rel="noopener noreferrer"
        style={{ width: "100%", justifyContent: "center" }}
        onClick={onClose}
      >
        🍵 Spill the tea (100% anónimo) →
      </a>
    </Sheet>
  );
}
