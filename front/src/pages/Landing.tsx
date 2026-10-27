const sports = [
  {
    number: "01",
    name: "Futebol",
    description: "Notícias, resultados e histórias que movimentam o jogo.",
    label: "ÚLTIMAS NOTÍCIAS",
    color: "football",
  },
  {
    number: "02",
    name: "Basquete",
    description: "Destaques da quadra, análises e grandes atuações.",
    label: "NBA & MUNDO",
    color: "basketball",
  },
  {
    number: "03",
    name: "Corrida",
    description: "Velocidade, resistência e os desafios dos atletas.",
    label: "PERFORMANCE",
    color: "running",
  },
  {
    number: "04",
    name: "E-sports",
    description: "Competições, equipes e o universo competitivo dos games.",
    label: "CENÁRIO COMPETITIVO",
    color: "esports",
  },
] as const;

export default function Landing() {
  return (
    <div className="landing" id="inicio">
      <header className="landing-header">
        <a className="landing-brand" href="/" aria-label="BASED, início">
          <img src="/images/logo_BASED.png" alt="BASED" />
          <span>ESPORTE • COMUNIDADE • PERFORMANCE</span>
        </a>

        <nav className="landing-nav" aria-label="Navegação principal">
          <a className="active" href="#inicio">Início</a>
          <a href="/eventos">Notícias</a>
          <a href="#modalidades">Modalidades</a>
          <a href="/match">Análises</a>
          <a className="landing-nav-about" href="#sobre">Sobre nós</a>
          <a className="landing-nav-login" href="/login">Entrar</a>
        </nav>
      </header>

      <section className="landing-hero-wrap" aria-label="Destaque">
        <div className="landing-hero">
          <img
            className="landing-hero-image"
            src="/images/stadium.jpg"
            alt="Estádio de futebol iluminado à noite"
          />
          <div className="landing-hero-shade" />
          <div className="landing-hero-copy">
            <p className="landing-eyebrow">O ESPORTE ACONTECE AQUI</p>
            <h1>
              Mais que um jogo.
              <br />
              Uma paixão sem limites.
            </h1>
            <p className="landing-hero-description">
              Notícias, histórias e análises para quem vive o esporte dentro e
              fora de campo.
            </p>
            <a className="landing-button" href="/eventos">EXPLORAR NOTÍCIAS ↗</a>
          </div>
          <span className="landing-hero-count">01 <b>/</b> 04</span>
        </div>
      </section>

      <section className="landing-section" id="modalidades">
        <div className="landing-section-heading">
          <div>
            <p className="landing-eyebrow">ENCONTRE SEU JOGO</p>
            <h2>Explore por modalidade</h2>
          </div>
          <a href="/eventos">Todas as modalidades ↗</a>
        </div>

        <div className="landing-sports">
          {sports.map((sport) => (
            <a
              className={`landing-sport-card ${sport.color}`}
              href="/eventos"
              key={sport.number}
            >
              <span className="landing-sport-meta">
                <span>{sport.label}</span>
                <span className="landing-sport-number">{sport.number}</span>
              </span>
              <h3>{sport.name}</h3>
              <p>{sport.description}</p>
              <span className="landing-sport-link">Ver conteúdo ↗</span>
            </a>
          ))}
        </div>
      </section>

      <section className="landing-section landing-about" id="sobre">
        <div className="landing-about-copy">
          <p>ACOMPANHE O RITMO</p>
          <h2>O próximo grande momento começa aqui.</h2>
        </div>
        <div>
          <p>
            Fique por dentro das principais histórias, novidades e análises do
            mundo esportivo.
          </p>
          <a href="/eventos">VER DESTAQUES ↗</a>
        </div>
      </section>

      <footer className="landing-footer">
        <div>
          <span>© 2026 PULSO ESPORTES</span>
          <span>Feito para quem vive o esporte.</span>
        </div>
      </footer>
    </div>
  );
}
