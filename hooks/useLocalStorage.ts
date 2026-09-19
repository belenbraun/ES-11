"use client";

import { useEffect, useState } from "react";

/**
 * Espejo de localStorage tal como lo usaba la versión Artifact
 * (gota_name / gota_lastTab): lee una vez en el cliente, después
 * persiste cada cambio. Silencioso si localStorage no está disponible.
 */
export function useLocalStorage(key: string, initialValue: string | null) {
  const [value, setValue] = useState<string | null>(initialValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(key);
      if (stored !== null) setValue(stored);
    } catch {
      // localStorage no disponible (Safari privado, etc.) — seguimos sin persistencia
    }
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const set = (next: string | null) => {
    setValue(next);
    try {
      if (next === null) window.localStorage.removeItem(key);
      else window.localStorage.setItem(key, next);
    } catch {
      // ignorar
    }
  };

  return { value, set, hydrated };
}
