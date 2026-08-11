import { useState, useEffect } from "react";

const STORAGE_KEY = "csharp_portal_progress";

export function useProgress() {
  const [reviewed, setReviewed] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch {
      return new Set();
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...reviewed]));
  }, [reviewed]);

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
