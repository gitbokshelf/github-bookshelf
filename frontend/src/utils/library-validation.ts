export type Entry = {
  status: "saved" | "using" | "done";
  note: string;
  savedAt: string;
};
export type Library = Record<string, Entry>;
export const MAX_BACKUP_BYTES = 2 * 1024 * 1024;
const bytes = (text: string) => new TextEncoder().encode(text).byteLength;
const object = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === "object" && !Array.isArray(value);

function validEntry(repo: string, value: unknown): value is Entry {
  if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repo) || !object(value)) return false;
  return ["saved", "using", "done"].includes(value.status as string) &&
    typeof value.note === "string" && value.note.length <= 10000 &&
    typeof value.savedAt === "string" && value.savedAt.length <= 64 &&
    Number.isFinite(Date.parse(value.savedAt));
}

export function validLibrary(raw: unknown): Library {
  if (!object(raw)) return {};
  return Object.fromEntries(Object.entries(raw).filter(([repo, entry]) => validEntry(repo, entry))
    .map(([repo, entry]) => {
      const value = entry as Entry;
      return [repo, { status: value.status, note: value.note, savedAt: value.savedAt }];
    }));
}

// Importações são estritas e atômicas: nenhum item parcial é aceito.
// Copia somente campos conhecidos; notas permanecem texto, nunca HTML executável.
export function parseLibraryBackup(text: string, existing: Library, knownRepos: ReadonlySet<string>): Library {
  if (bytes(text) > MAX_BACKUP_BYTES) throw new Error("Backup muito grande");
  const value: unknown = JSON.parse(text);
  if (!object(value) || value.version !== 1 || !object(value.library)) throw new Error("Formato inválido");
  for (const [repo, entry] of Object.entries(value.library)) {
    if (!knownRepos.has(repo) || !validEntry(repo, entry)) throw new Error("Registro inválido");
  }
  const merged = { ...existing, ...validLibrary(value.library) };
  if (bytes(JSON.stringify(merged)) > MAX_BACKUP_BYTES) throw new Error("Estante muito grande");
  return merged;
}
