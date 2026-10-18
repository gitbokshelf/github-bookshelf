import { translate, useLanguage } from "../i18n";
import Icon from "./ui/icon";
export default function Hero({ onCollections }: { onCollections: () => void }) {
  useLanguage();
  return (
    <section className="hero">
      <div className="hero-copy">
        <div className="eyebrow">
          <span className="tiny-star">{translate("✳")}</span>{" "}
          {translate("MENOS RUÍDO. MAIS DESCOBERTAS.")}
        </div>
        <h1>
          {translate("Grandes projetos.")}
          <br />
          {translate("Na sua ")}
          <em>{translate("próxima estante.")}</em>
        </h1>
        <p>
          {translate("O melhor do open source, organizado para a vida real.")}
          <br className="desktop-break" />{" "}
          {translate("Encontre ferramentas para criar, aprender e ir além.")}
        </p>
        <div className="hero-actions">
          <button
            className="primary-button"
            onClick={() =>
              document
                .getElementById("catalog")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            {translate("Explore a biblioteca")}
            <Icon name="arrow" size={16} />
          </button>
          <button className="text-button" onClick={onCollections}>
            {translate("Conheça as coleções")}
            <Icon name="external" size={14} />
          </button>
        </div>
        <div className="hero-trust">
          <span className="mini-avatars">
            <span>{translate("⌘")}</span>
            <span>
              <Icon name="code" size={11} />
            </span>
            <span>
              <Icon name="sparkles" size={11} />
            </span>
          </span>
          <span>{translate("Para quem cria. Para quem quer começar.")}</span>
        </div>
      </div>
      <div className="book-scene" aria-hidden="true">
        <div className="orbital o1" />
        <div className="orbital o2" />
        <div className="scene-spark s1">{translate("✧")}</div>
        <div className="scene-spark s2">{translate("+")}</div>
        <div className="scene-label">
          {translate("THE OPEN SOURCE COLLECTION")}
        </div>
        <div className="hero-books">
          <div className="book book-violet">
            <span className="book-no">{translate("003")}</span>
            <Icon name="sparkles" size={25} />
            <span className="book-spine">
              {translate("Artificial Intelligence")}
            </span>
            <span className="book-bottom">
              {translate("THINK")}
              <br />
              {translate("BIGGER.")}
            </span>
          </div>
          <div className="book book-cream">
            <span className="book-no">{translate("001")}</span>
            <Icon name="code" size={28} />
            <span className="book-spine">
              {translate("The Art of Building")}
            </span>
            <span className="book-bottom">
              {translate("CREATE")}
              <br />
              {translate("SOMETHING.")}
            </span>
          </div>
          <div className="book book-green">
            <div className="book-front">
              <span className="book-front-top">
                {translate("THE CURIOUS MIND SERIES")}
                <br />
                <span>{translate("VOLUME 002 · OPEN SOURCE")}</span>
              </span>
              <div className="book-rosette">{translate("✳")}</div>
              <span className="book-front-title">
                {translate("Make")}
                <br />
                {translate("good")}
                <br />
                <em>{translate("things.")}</em>
              </span>
              <div className="book-front-rule" />
              <span className="book-front-bottom">
                {translate("A WORLD OF POSSIBILITIES.")}
                <br />
                {translate("ONE DISCOVERY AT A TIME.")}
              </span>
              <Icon name="arrow" size={22} />
            </div>
          </div>
          <div className="book book-orange">
            <span className="book-no">{translate("004")}</span>
            <Icon name="bolt" size={26} />
            <span className="book-spine">
              {translate("Everyday, Upgraded")}
            </span>
            <span className="book-bottom">
              {translate("WORK")}
              <br />
              {translate("SMARTER.")}
            </span>
          </div>
        </div>
        <div className="book-shelf" />
        <div className="scene-caption">
          <span className="status-dot" />
          {translate("SUA PRÓXIMA BOA IDEIA MORA AQUI")}
        </div>
      </div>
    </section>
  );
}
