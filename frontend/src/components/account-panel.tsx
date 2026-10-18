import { translate, useLanguage } from "../i18n";
import { useState, type FormEvent } from "react";
import { supabase, authRedirect } from "../api/supabase";
import { useAuth } from "../context/auth-context";
import Modal from "./ui/modal";
import Icon from "./ui/icon";
import Turnstile, { captchaSiteKey } from "./turnstile";

export default function AccountPanel({ onClose }: { onClose: () => void }) {
  const { language } = useLanguage();
  const { user, recovery, dismissRecovery } = useAuth();
  const [mode, setMode] = useState<"login" | "signup" | "forgot" | "reset">(
    recovery ? "reset" : "login",
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [challengeRound, setChallengeRound] = useState(0);
  const needsCaptcha = Boolean(captchaSiteKey && mode !== "reset");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const changeMode = (next: typeof mode) => {
    setMode(next);
    setPassword("");
    setCaptchaToken("");
    setMessage("");
    setError("");
  };
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!supabase || busy) return;
    if (needsCaptcha && !captchaToken) {
      setError("Conclua a verificação de segurança antes de continuar.");
      return;
    }
    setBusy(true);
    setError("");
    setMessage("");
    try {
      if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: authRedirect(),
          captchaToken: captchaToken || undefined,
        });
        if (error) throw error;
        setMessage(
          "Se esse e-mail estiver cadastrado, você receberá um link para recuperar o acesso.",
        );
      } else if (mode === "reset") {
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
        setPassword("");
        dismissRecovery();
        setMessage("Senha atualizada.");
        onClose();
      } else if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: authRedirect(),
            data: { language },
            captchaToken: captchaToken || undefined,
          },
        });
        if (error) throw error;
        setPassword("");
        if (data.session) onClose();
        else
          setMessage(
            "Confira seu e-mail para confirmar a conta. Depois, volte e entre com sua senha.",
          );
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
          options: { captchaToken: captchaToken || undefined },
        });
        if (error) throw error;
        setPassword("");
        onClose();
      }
    } catch (caught) {
      const code = (caught as { code?: string }).code;
      setError(
        code === "captcha_failed"
          ? "A verificação de segurança falhou. Repita a verificação e tente novamente."
          : code === "invalid_credentials"
            ? "E-mail ou senha inválidos."
            : code === "email_not_confirmed"
              ? "Confirme seu e-mail antes de entrar."
              : code === "over_email_send_rate_limit"
                ? "Limite de envio atingido. Aguarde antes de tentar novamente."
                : "Não foi possível concluir. Confira os dados e tente novamente.",
      );
    } finally {
      setCaptchaToken("");
      setChallengeRound((value) => value + 1);
      setBusy(false);
    }
  };
  return (
    <Modal
      label={translate("Sua conta")}
      onClose={onClose}
      className="account-modal"
    >
      <div className="eyebrow">{translate("SUA ESTANTE, COM VOCÊ")}</div>
      <h2>
        {translate(
          user && !recovery
            ? "Sua conta."
            : mode === "signup"
              ? "Comece sua estante."
              : mode === "forgot"
                ? "Recupere o acesso."
                : mode === "reset"
                  ? "Uma nova senha."
                  : "Bem-vindo de volta.",
        )}
      </h2>
      {!supabase ? (
        <p>
          {translate(
            "Login ainda não configurado neste ambiente. Você pode continuar com sua estante local.",
          )}
        </p>
      ) : user && !recovery ? (
        <>
          <p className="account-email">{user.email}</p>
          <p>
            {translate(
              "Projetos, notas e progresso desta conta são guardados no Supabase. A estante de visitante permanece separada neste navegador.",
            )}
          </p>
          <button
            className="secondary-button"
            disabled={busy}
            onClick={async () => {
              if (!supabase) return;
              setBusy(true);
              const { error } = await supabase.auth.signOut({
                scope: "local",
              });
              setBusy(false);
              if (error) setError("Não foi possível sair. Tente novamente.");
              else onClose();
            }}
          >
            {translate("Sair desta conta")}
            <Icon name="external" size={16} />
          </button>
        </>
      ) : (
        <>
          <p>
            {translate(
              mode === "forgot"
                ? "Informe o e-mail da sua conta para receber o link de recuperação."
                : mode === "reset"
                  ? "Defina uma nova senha para recuperar o acesso à sua estante."
                  : "Entre para guardar seus projetos, notas e progresso na sua conta.",
            )}
          </p>
          <form onSubmit={submit}>
            {mode !== "reset" && (
              <label className="field-label">
                {translate("E-mail")}
                <input
                  required
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  maxLength={254}
                />
              </label>
            )}
            {mode !== "forgot" && (
              <label className="field-label">
                {translate("Senha")}
                <input
                  required
                  type="password"
                  autoComplete={
                    mode === "login" ? "current-password" : "new-password"
                  }
                  minLength={mode === "login" ? 1 : 12}
                  maxLength={128}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {mode !== "login" && (
                  <small>{translate("Use pelo menos 12 caracteres.")}</small>
                )}
              </label>
            )}
            {needsCaptcha && (
              <Turnstile
                key={`${mode}-${challengeRound}`}
                action={mode}
                language={language}
                onToken={setCaptchaToken}
              />
            )}
            <button
              className="primary-button"
              type="submit"
              disabled={busy || (needsCaptcha && !captchaToken)}
            >
              {translate(
                busy
                  ? "Aguarde..."
                  : mode === "signup"
                    ? "Criar conta"
                    : mode === "forgot"
                      ? "Enviar link"
                      : mode === "reset"
                        ? "Atualizar senha"
                        : "Entrar",
              )}
              <Icon name="arrow" size={16} />
            </button>
          </form>
          {!recovery && (
            <div className="account-links">
              <button
                className="text-button"
                onClick={() =>
                  changeMode(mode === "login" ? "signup" : "login")
                }
              >
                {translate(
                  mode === "login" ? "Criar uma conta" : "Já tenho conta",
                )}
              </button>
              {mode === "login" && (
                <button
                  className="text-button"
                  onClick={() => changeMode("forgot")}
                >
                  {translate("Esqueci minha senha")}
                </button>
              )}
            </div>
          )}
          <p className="field-hint">
            {translate(
              "A estante de visitante não é enviada automaticamente. Depois de entrar, use Importar para trazer um backup.",
            )}
          </p>
        </>
      )}
      {message && (
        <p role="status" className="account-message">
          {translate(message)}
        </p>
      )}
      {error && (
        <p role="alert" className="account-error">
          {translate(error)}
        </p>
      )}
    </Modal>
  );
}
