import { useEffect, useState } from "react";

export type ThemePreference = "system" | "light" | "dark";
const key = "bookshelf:theme";
const readPreference = (): ThemePreference => {
  try {
    const value = localStorage.getItem(key);
    if (value === "light" || value === "dark") return value;
  } catch {}
  return "system";
};

export function useTheme() {
  const [preference, setPreference] = useState(readPreference);
  const [theme, setTheme] = useState<"light" | "dark">(() =>
    document.documentElement.dataset.theme === "light" ? "light" : "dark",
  );
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      const next =
        preference === "system"
          ? media.matches
            ? "dark"
            : "light"
          : preference;
      document.documentElement.dataset.theme = next;
      document.documentElement.style.colorScheme = next;
      document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute("content", next === "light" ? "#f7f6f0" : "#111311");
      setTheme(next);
    };
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [preference]);
  useEffect(() => {
    const sync = (event: StorageEvent) => {
      if (event.key === key || event.key === null)
        setPreference(readPreference());
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  const chooseTheme = (next: ThemePreference) => {
    setPreference(next);
    try {
      if (next === "system") localStorage.removeItem(key);
      else localStorage.setItem(key, next);
    } catch {}
  };
  return { preference, theme, chooseTheme };
}
