import { useEffect, useSyncExternalStore } from "react";
import {
  isLanguage,
  translator,
  validateDictionary,
  type Dictionary,
  type Language,
} from "./utils/localization";
import illustrationLabels from "./data/illustration-labels.json";
export type { Language };
let language: Language = "pt-BR";
let pending = false;
let error = false;
let request = 0;
let initialized = false;
let version = 0;
const listeners = new Set<() => void>();
const dictionaries = new Map<Language, Dictionary>();
let renderText = translator(illustrationLabels);
const emit = () => {
  version++;
  listeners.forEach((listener) => listener());
};
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};
export const getLanguage = () => language;
export const translate = <T>(value: T): T => renderText(value);
export async function chooseLanguage(next: Language) {
  if (!isLanguage(next)) return;
  const current = ++request;
  pending = true;
  error = false;
  emit();
  try {
    let dictionary = dictionaries.get(next);
    if (!dictionary) {
      if (next === "pt-BR") dictionary = illustrationLabels;
      else {
        const embedded = document.getElementById("bookshelf-locales");
        if (window.location.protocol === "file:" && embedded?.textContent)
          dictionary = validateDictionary(
            JSON.parse(embedded.textContent)[next],
          );
        else {
          const response = await fetch(
            new URL(
              next === "en" ? "./locales/en.json" : "./locales/es.json",
              document.baseURI,
            ),
            { signal: AbortSignal.timeout(10000) },
          );
          if (!response.ok) throw new Error("Dictionary unavailable");
          const text = await response.text();
          if (text.length > 1000000)
            throw new Error("Dictionary exceeds budget");
          dictionary = validateDictionary(JSON.parse(text));
        }
      }
      dictionaries.set(next, dictionary);
    }
    if (request !== current) return;
    language = next;
    renderText = translator(dictionary);
    document.documentElement.lang = next;
    document.title = translate("GitHub Bookshelf · Sua próxima descoberta");
    const description = translate(
      "Descubra projetos úteis do GitHub por categoria, sistema operacional e objetivo. Organize sua estante pessoal.",
    );
    for (const selector of [
      'meta[name="description"]',
      'meta[property="og:description"]',
      'meta[name="twitter:description"]',
    ])
      document.querySelector(selector)?.setAttribute("content", description);
    for (const selector of [
      'meta[property="og:title"]',
      'meta[name="twitter:title"]',
    ])
      document.querySelector(selector)?.setAttribute("content", document.title);
    try {
      localStorage.setItem("bookshelf:language", next);
    } catch {}
  } catch {
    if (request === current) error = true;
  } finally {
    if (request === current) {
      pending = false;
      emit();
    }
  }
}
export function useLanguage() {
  useSyncExternalStore(
    subscribe,
    () => version,
    () => 0,
  );
  useEffect(() => {
    if (initialized) return;
    initialized = true;
    let preferred: unknown;
    try {
      preferred =
        new URLSearchParams(window.location.search).get("lang") ||
        localStorage.getItem("bookshelf:language");
    } catch {}
    if (isLanguage(preferred) && preferred !== language)
      void chooseLanguage(preferred);
  }, []);
  return { language, pending, error, chooseLanguage };
}

export const formatNumber = (
  value: number,
  options: Intl.NumberFormatOptions = {},
) => new Intl.NumberFormat(language, options).format(value);
