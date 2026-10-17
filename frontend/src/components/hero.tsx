import Icon from "./ui/icon";
export default function Hero({ onCollections }: { onCollections: () => void }) {
  return (
    <section className="hero">
      <div className="hero-copy">
        <div className="eyebrow">
          <span className="tiny-star">✳</span> MENOS RUÍDO. MAIS DESCOBERTAS.
        </div>
        <h1>
          Grandes projetos.
          <br />
          Na sua <em>próxima estante.</em>
        </h1>
        <p>
          O melhor do open source, organizado para a vida real.
          <br className="desktop-break" /> Encontre ferramentas para criar,
          aprender e ir além.
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
            Explore a biblioteca
            <Icon name="arrow" size={16} />
          </button>
          <button className="text-button" onClick={onCollections}>
            Conheça as coleções
            <Icon name="external" size={14} />
          </button>
        </div>
        <div className="hero-trust">
          <span className="mini-avatars">
            <span>⌘</span>
            <span>
              <Icon name="code" size={11} />
            </span>
            <span>
              <Icon name="sparkles" size={11} />
            </span>
          </span>
          <span>Para quem cria. Para quem quer começar.</span>
        </div>
      </div>
      <div className="book-scene" aria-hidden="true">
        <div className="orbital o1" />
        <div className="orbital o2" />
        <div className="scene-spark s1">✧</div>
        <div className="scene-spark s2">+</div>
        <div className="scene-label">THE OPEN SOURCE COLLECTION</div>
        <div className="hero-books">
          <div className="book book-violet">
            <span className="book-no">003</span>
            <Icon name="sparkles" size={25} />
            <span className="book-spine">Artificial Intelligence</span>
            <span className="book-bottom">
              THINK
              <br />
              BIGGER.
            </span>
          </div>
          <div className="book book-cream">
            <span className="book-no">001</span>
            <Icon name="code" size={28} />
            <span className="book-spine">The Art of Building</span>
            <span className="book-bottom">
              CREATE
              <br />
              SOMETHING.
            </span>
          </div>
          <div className="book book-green">
            <div className="book-front">
              <span className="book-front-top">
                THE CURIOUS MIND SERIES
                <br />
                <span>VOLUME 002 · OPEN SOURCE</span>
              </span>
              <div className="book-rosette">✳</div>
              <span className="book-front-title">
                Make
                <br />
                good
                <br />
                <em>things.</em>
              </span>
              <div className="book-front-rule" />
              <span className="book-front-bottom">
                A WORLD OF POSSIBILITIES.
                <br />
                ONE DISCOVERY AT A TIME.
              </span>
              <Icon name="arrow" size={22} />
            </div>
          </div>
          <div className="book book-orange">
            <span className="book-no">004</span>
            <Icon name="bolt" size={26} />
            <span className="book-spine">Everyday, Upgraded</span>
            <span className="book-bottom">
              WORK
              <br />
              SMARTER.
            </span>
          </div>
        </div>
        <div className="book-shelf" />
        <div className="scene-caption">
          <span className="status-dot" />
          SUA PRÓXIMA BOA IDEIA MORA AQUI
        </div>
      </div>
    </section>
  );
}
