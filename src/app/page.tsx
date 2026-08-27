import Link from "next/link";

export default function Home() {
  return (
    <main className="home-page">
      <header className="site-header">
        <Link className="brand" href="/" aria-label="Skinstric home">
          sKINsTRIC
        </Link>
        <span className="header-divider" aria-hidden="true">
          [
        </span>
        <span className="header-section">INTRO</span>
        <span className="header-divider" aria-hidden="true">
          ]
        </span>
        <a className="code-link" href="#enter-code">
          ENTER CODE
        </a>
      </header>

      <div className="diagonal-frame" aria-hidden="true" />

      <section className="hero-content" aria-labelledby="hero-title">
        <h1 id="hero-title">
          <span>Sophisticated</span>
          <span>skincare</span>
        </h1>
      </section>

      <a className="side-link side-link-left" href="#discover">
        <span className="diamond diamond-left" aria-hidden="true">
          <span />
        </span>
        <span>DISCOVER A.I.</span>
      </a>

      <a className="side-link side-link-right" href="/intro">
        <span>TAKE TEST</span>
        <span className="diamond diamond-right" aria-hidden="true">
          <span />
        </span>
      </a>

      <p className="intro-copy">
        SKINSTRIC DEVELOPED AN A.I. THAT CREATES
        <br />
        A HIGHLY-PERSONALISED ROUTINE TAILORED TO
        <br />
        WHAT YOUR SKIN NEEDS.
      </p>
    </main>
  );
}
