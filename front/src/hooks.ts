import { useEffect, useState } from "react";

export function useCatalog<T>(load: () => Promise<T[]>) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    load().then((result) => {
      if (active) setItems(result);
    }).catch((cause: unknown) => {
      console.error("Não foi possível carregar os dados.", cause);
      if (active) setError("Não foi possível carregar os dados. Tente novamente.");
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, []);

  return { items, loading, error };
}
