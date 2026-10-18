import { translate, useLanguage, type Language } from "../i18n";
import Icon from "./ui/icon";
export default function LanguageSelector() {
  const { language, pending, error, chooseLanguage } = useLanguage();
  return (
    <div className="language-control">
      <label className="theme-control">
        <span aria-hidden="true">文</span>
        <select
          aria-label={translate("Idioma do site")}
          value={language}
          disabled={pending}
          onChange={(event) => {
            void chooseLanguage(event.target.value as Language);
          }}
        >
          <option value="pt-BR" lang="pt-BR">
            Português
          </option>
          <option value="en" lang="en">
            English
          </option>
          <option value="es" lang="es">
            Español
          </option>
        </select>
        <Icon name="down" size={12} />
      </label>
      <span className="language-message" role="status">
        {pending
          ? translate("Carregando idioma...")
          : error
            ? translate("Não foi possível carregar o idioma. Tente novamente.")
            : ""}
      </span>
    </div>
  );
}
