import { useState, useEffect } from "react";

const DEFAULT_KEY = "csharp_portal_progress";

export function useProgress(storageKey = DEFAULT_KEY) {
  const [reviewed, setReviewed] = useState(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch {
      return new Set();
    }
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify([...reviewed]));
  }, [storageKey, reviewed]);

  const toggle = (id) => {
    setReviewed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const reset = () => setReviewed(new Set());

  return { reviewed, toggle, reset };
}
