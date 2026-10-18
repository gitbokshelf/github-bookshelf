export type Language = "pt-BR" | "en" | "es";
export type Dictionary = Record<string, string>;
export function isLanguage(value: unknown): value is Language {
  return value === "pt-BR" || value === "en" || value === "es";
}
export function validateDictionary(value: unknown): Dictionary {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new Error("Invalid dictionary");
  const entries = Object.entries(value);
  if (
    entries.length > 3000 ||
    entries.some(
      ([key, text]) =>
        ["__proto__", "constructor", "prototype"].includes(key) ||
        key.length > 10000 ||
        typeof text !== "string" ||
        text.length > 15000,
    )
  )
    throw new Error("Invalid dictionary");
  return Object.fromEntries(entries);
}
const escape = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
export function translator(dictionary: Dictionary) {
  const patterns = Object.entries(dictionary)
    .filter(([key]) => /\{\w+\}/.test(key))
    .sort(([a], [b]) => b.length - a.length)
    .map(([key, text]) => {
      const names: string[] = [];
      let cursor = 0;
      let expression = "^";
      for (const match of key.matchAll(/\{(\w+)\}/g)) {
        expression += escape(key.slice(cursor, match.index)) + "(.+?)";
        names.push(match[1]);
        cursor = match.index + match[0].length;
      }
      return {
        regex: new RegExp(expression + escape(key.slice(cursor)) + "$"),
        names,
        text,
      };
    });
  return function translate<T>(value: T): T {
    if (typeof value !== "string" || value.length > 2000) return value;
    const source = value.trim();
    let translated = Object.hasOwn(dictionary, source)
      ? dictionary[source]
      : undefined;
    if (translated === undefined)
      for (const pattern of patterns) {
        const match = source.match(pattern.regex);
        if (match) {
          translated = pattern.text.replace(
            /\{(\w+)\}/g,
            (token, name: string) => {
              const index = pattern.names.indexOf(name);
              if (index < 0) return token;
              const captured = match[index + 1];
              return ["category", "level", "license", "size"].includes(name) &&
                Object.hasOwn(dictionary, captured)
                ? dictionary[captured]
                : captured;
            },
          );
          break;
        }
      }
    return (
      translated === undefined
        ? value
        : value.slice(0, value.indexOf(source)) +
          translated +
          value.slice(value.indexOf(source) + source.length)
    ) as T;
  };
}
