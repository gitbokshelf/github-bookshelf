import { useState, useRef } from "react";
export type Entry = {
  status: "saved" | "using" | "done";
  note: string;
  savedAt: string;
};
export type Library = Record<string, Entry>;
export const STORAGE = "github-bookshelf:v1";
export function readLibrary(): Library {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE) || "{}");
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
    return Object.fromEntries(
      Object.entries(raw).filter(
        ([k, v]) =>
          k.includes("/") &&
          v &&
          typeof v === "object" &&
          ["saved", "using", "done"].includes((v as Entry).status) &&
          typeof (v as Entry).note === "string" &&
          typeof (v as Entry).savedAt === "string",
      ),
    ) as Library;
  } catch {
    return {};
  }
}
export function useLibrary() {
  const [library, setLibrary] = useState<Library>(readLibrary);
  const [storageError, setStorageError] = useState(false);
  const current = useRef(library);
  function update(fn: (old: Library) => Library) {
    const next = fn(current.current);
    current.current = next;
    try {
      localStorage.setItem(STORAGE, JSON.stringify(next));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
    setLibrary(next);
  }
  const toggle = (repo: string) =>
    update((old) => {
      const next = { ...old };
      if (next[repo]) delete next[repo];
      else
        next[repo] = {
          status: "saved",
          note: "",
          savedAt: new Date().toISOString(),
        };
      return next;
    });
  const patch = (repo: string, value: Partial<Entry>) =>
    update((old) => ({
      ...old,
      [repo]: {
        ...(old[repo] || {
          status: "saved",
          note: "",
          savedAt: new Date().toISOString(),
        }),
        ...value,
      },
    }));
  return { library, toggle, patch, update, storageError };
}
