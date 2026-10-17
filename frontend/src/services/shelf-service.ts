import { clientForUser } from "../api/supabase";
import type { Library } from "../hooks/use-library";

export type RemoteShelf = { entries: Library; revision: number };
export async function loadShelf(userId: string): Promise<RemoteShelf> {
  const client = await clientForUser(userId);
  const { data, error } = await client
    .from("user_shelves")
    .select("entries,revision")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return data ?? { entries: {}, revision: 0 };
}
export async function saveShelf(
  userId: string,
  entries: Library,
  revision: number,
): Promise<RemoteShelf> {
  const client = await clientForUser(userId);
  const { data, error } = await client.rpc("save_my_shelf", {
    p_entries: entries,
    p_expected_revision: revision,
  });
  if (error) throw error;
  const row = Array.isArray(data) ? data[0] : data;
  if (!row || !Number.isInteger(row.revision) || row.revision < 1)
    throw new Error("Resposta inválida do serviço.");
  return row;
}
