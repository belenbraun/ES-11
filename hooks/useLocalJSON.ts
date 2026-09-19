"use client";

import { useEffect, useState } from "react";

/** Como useLocalStorage pero para un objeto JSON (ej. la ficha editable de "Mi Perfil"). */
export function useLocalJSON<T extends object>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(key);
      if (stored) setValue({ ...initial, ...JSON.parse(stored) });
    } catch {
      // localStorage no disponible o JSON corrupto — seguimos con el valor inicial
    }
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  function set(next: T) {
    setValue(next);
    try {
      window.localStorage.setItem(key, JSON.stringify(next));
    } catch {
      // ignorar
    }
  }

  return { value, set, hydrated };
}
