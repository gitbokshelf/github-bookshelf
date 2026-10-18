import { useEffect, useRef, useState } from "react";

type ChallengeOptions = {
  sitekey: string; theme: "light" | "dark"; size: "flexible";
  language: string; action: string; callback: (token: string) => void;
  "expired-callback": () => void; "error-callback": () => void;
  "timeout-callback": () => void; "response-field": boolean;
};
type TurnstileAPI = { render: (node: HTMLElement, options: ChallengeOptions) => string; remove: (id: string) => void };
declare global { interface Window { turnstile?: TurnstileAPI } }
export const captchaSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined;
let loading: Promise<TurnstileAPI> | undefined;
function loadScript() {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (loading) return loading;
  loading = new Promise<TurnstileAPI>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    const fail = () => { clearTimeout(timeout); script.remove(); loading = undefined; reject(new Error("Challenge unavailable")); };
    const timeout = window.setTimeout(fail, 15000);
    script.onerror = fail;
    script.onload = () => {
      clearTimeout(timeout);
      if (window.turnstile) resolve(window.turnstile);
      else fail();
    };
    document.head.append(script);
  });
  return loading;
}
export default function Turnstile({action, onToken, language = "pt-BR"}: {
  action: string; onToken: (token: string) => void; language?: string;
}) {
  const node = useRef<HTMLDivElement>(null);
  const callback = useRef(onToken);
  callback.current = onToken;
  const [attempt, setAttempt] = useState(0);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  useEffect(() => {
    let active = true;
    let widget: string | undefined;
    let api: TurnstileAPI | undefined;
    callback.current("");
    setStatus("loading");
    const invalidate = () => { if (active) { callback.current(""); setStatus("error"); } };
    void loadScript().then(loaded => {
      if (!active || !node.current || !captchaSiteKey) return;
      api = loaded;
      widget = api.render(node.current, {
        sitekey: captchaSiteKey, theme: document.documentElement.dataset.theme === "light" ? "light" : "dark",
        size: "flexible", language, action, "response-field": false,
        callback: token => { if (active) { callback.current(token); setStatus("ready"); } },
        "expired-callback": invalidate, "error-callback": invalidate, "timeout-callback": invalidate,
      });
    }).catch(invalidate);
    return () => { active = false; if (api && widget !== undefined) api.remove(widget); };
  }, [action, language, attempt]);
  return <div className="challenge-field">
    <div ref={node} />
    <p className="field-hint" role="status">{status === "loading" ? "Verificando acesso seguro..." : status === "ready" ? "Verificação concluída." : "A verificação expirou ou não carregou. Tente novamente."}</p>
    {status === "error" && <button className="text-button" type="button" onClick={() => setAttempt(value => value + 1)}>Repetir verificação</button>}
    <p className="field-hint">Proteção contra bots por Cloudflare Turnstile. <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noreferrer">Privacidade</a></p>
  </div>;
}
