import { useEffect, useReducer, useRef } from "react";
import { loadShelf, saveShelf } from "../services/shelf-service";
import { validLibrary, type Library, type Entry } from "../utils/library-validation";
export { validLibrary };
export type { Library, Entry };
export const STORAGE = "github-bookshelf:v1";
export type SyncStatus =
  "local" | "loading" | "saving" | "saved" | "offline" | "conflict";
export function readLibrary(): Library {
  try {
    return validLibrary(JSON.parse(localStorage.getItem(STORAGE) || "{}"));
  } catch {
    return {};
  }
}
type Model = {
  owner: string;
  entries: Library;
  revision: number;
  dirty: boolean;
  ready: boolean;
  busy: boolean;
  status: SyncStatus;
};
export function useLibrary(userId?: string) {
  const owner = userId ?? "guest";
  const [, render] = useReducer((v: number) => v + 1, 0);
  const [retryCount, retry] = useReducer((v: number) => v + 1, 0);
  const storageError = useRef(false);
  const current = useRef<Model>({
    owner,
    entries: userId ? {} : readLibrary(),
    revision: 0,
    dirty: false,
    ready: !userId,
    busy: false,
    status: userId ? "loading" : "local",
  });
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const cache = (model: Model) => {
    try {
      localStorage.setItem(
        model.owner === "guest" ? STORAGE : `${STORAGE}:user:${model.owner}`,
        JSON.stringify(
          model.owner === "guest"
            ? model.entries
            : {
                entries: model.entries,
                revision: model.revision,
                dirty: model.dirty,
              },
        ),
      );
      storageError.current = false;
    } catch {
      storageError.current = true;
    }
  };
  const flush = async (model: Model) => {
    if (
      model.owner === "guest" ||
      !model.ready ||
      model.busy ||
      !model.dirty ||
      model.status === "conflict" ||
      current.current !== model
    )
      return;
    model.busy = true;
    model.status = "saving";
    render();
    try {
      while (current.current === model && model.dirty) {
        const snapshot = model.entries;
        const saved = await saveShelf(model.owner, snapshot, model.revision);
        if (current.current !== model) return;
        model.revision = saved.revision;
        model.dirty = model.entries !== snapshot;
        cache(model);
      }
      model.status = "saved";
    } catch (error) {
      if (current.current !== model) return;
      model.status =
        (error as { code?: string }).code === "40001" ? "conflict" : "offline";
    } finally {
      model.busy = false;
      if (current.current === model) render();
    }
  };
  useEffect(() => {
    clearTimeout(timer.current);
    const model: Model = {
      owner,
      entries: owner === "guest" ? readLibrary() : {},
      revision: 0,
      dirty: false,
      ready: owner === "guest",
      busy: false,
      status: owner === "guest" ? "local" : "loading",
    };
    if (userId) {
      try {
        const raw = JSON.parse(
          localStorage.getItem(`${STORAGE}:user:${owner}`) || "null",
        );
        if (raw && Number.isInteger(raw.revision) && raw.revision >= 0) {
          model.entries = validLibrary(raw.entries);
          model.revision = raw.revision;
          model.dirty = raw.dirty === true;
        }
      } catch {}
    }
    current.current = model;
    render();
    if (userId)
      void loadShelf(userId)
        .then((remote) => {
          if (current.current !== model) return;
          if (model.dirty && model.revision !== remote.revision)
            model.status = "conflict";
          else if (model.dirty) model.status = "saving";
          else {
            model.entries = validLibrary(remote.entries);
            model.revision = remote.revision;
            model.status = "saved";
          }
          model.ready = true;
          cache(model);
          render();
          void flush(model);
        })
        .catch(() => {
          if (current.current === model) {
            model.ready = true;
            model.status = "offline";
            render();
          }
        });
    const online = () => {
      void flush(model);
    };
    window.addEventListener("online", online);
    return () => {
      clearTimeout(timer.current);
      window.removeEventListener("online", online);
      if (current.current === model) model.ready = false;
    };
  }, [owner, retryCount]);
  function update(fn: (old: Library) => Library) {
    const model = current.current;
    if (model.owner !== owner || !model.ready) return false;
    model.entries = fn(model.entries);
    model.dirty = owner !== "guest";
    if (
      owner !== "guest" &&
      model.status !== "conflict" &&
      model.status !== "offline"
    )
      model.status = "saving";
    cache(model);
    render();
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      void flush(model);
    }, 500);
    return true;
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
        ...(old[repo] ?? {
          status: "saved",
          note: "",
          savedAt: new Date().toISOString(),
        }),
        ...value,
      },
    }));
  const model = current.current;
  const reloadRemote = async () => {
    if (!userId) return false;
    const model = current.current;
    if (model.owner !== userId || model.busy) return false;
    try {
      const remote = await loadShelf(userId);
      if (current.current !== model) return false;
      // Além do JSON exportado pela interface, preserva uma cópia por conta.
      localStorage.setItem(
        `${STORAGE}:user:${userId}:conflict-backup`,
        JSON.stringify({
          entries: model.entries,
          revision: model.revision,
          exportedAt: new Date().toISOString(),
        }),
      );
      model.entries = validLibrary(remote.entries);
      model.revision = remote.revision;
      model.dirty = false;
      model.status = "saved";
      cache(model);
      render();
      return true;
    } catch {
      return false;
    }
  };
  return {
    library: model.owner === owner ? model.entries : {},
    toggle,
    patch,
    update,
    storageError: storageError.current,
    syncStatus:
      model.owner === owner ? model.status : ("loading" as SyncStatus),
    retry,
    reloadRemote,
    ready: model.owner === owner && model.ready,
  };
}
