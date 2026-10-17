import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
// Apenas chave publicável. Chaves secret/service_role não pertencem ao frontend.
export const supabase =
  url && key && window.location.protocol !== "file:"
    ? createClient(url, key, {
        auth: {
          flowType: "pkce",
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      })
    : null;

export async function clientForUser(userId: string) {
  if (!supabase) throw new Error("Serviço indisponível.");
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session || session.user.id !== userId)
    throw new Error("Sessão alterada. Entre novamente.");
  // Vincula esta requisição à sessão capturada. Trocar de conta enquanto uma
  // gravação aguarda não pode enviar a estante anterior para o usuário novo.
  const token = session.access_token;
  return createClient(url, key, { accessToken: async () => token });
}

export const authRedirect = () => {
  const address = new URL(window.location.href);
  address.hash = "";
  address.search = "";
  return address.toString();
};
