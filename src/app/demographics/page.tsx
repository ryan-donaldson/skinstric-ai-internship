"use client";

import Link from "next/link";

export default function DemographicsPage() {
  return (
    <main className="demographics-page">
      <header className="site-header">
        <Link className="brand" href="/" aria-label="Skinstric home">
          sKINsTRIC
        </Link>
        <span className="header-divider" aria-hidden="true">
          [
        </span>
        <span className="header-section">ANALYSIS</span>
        <span className="header-divider" aria-hidden="true">
          ]
        </span>
        <a className="code-link" href="#enter-code">
          ENTER CODE
        </a>
      </header>

      <section className="analysis-introduction">
        <h1>A. I. ANALYSIS</h1>
        <p>A. I. HAS ESTIMATED THE FOLLOWING.</p>
        <p>FIX ESTIMATED INFORMATION IF NEEDED.</p>
      </section>

      <section className="analysis-menu" aria-label="Analysis categories">
        <div className="analysis-menu-frames" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div className="analysis-menu-tiles">
          <Link
            className="analysis-menu-tile demographics-tile"
            href="/details"
          >
            DEMOGRAPHICS
          </Link>
          <button
            className="analysis-menu-tile cosmetic-tile"
            type="button"
            aria-disabled="true"
            tabIndex={-1}
          >
            COSMETIC
            <br />
            CONCERNS
          </button>
          <button
            className="analysis-menu-tile skin-tile"
            type="button"
            aria-disabled="true"
            tabIndex={-1}
          >
            SKIN TYPE
            <br />
            DETAILS
          </button>
          <button
            className="analysis-menu-tile weather-tile"
            type="button"
            aria-disabled="true"
            tabIndex={-1}
          >
            WEATHER
          </button>
        </div>
      </section>

      <Link href="/analysis" className="back-link" aria-label="Go back">
        <div className="diamond diamond-left">
          <span />
        </div>
        <span>BACK</span>
      </Link>
      <Link href="/details" className="summary-link">
        <span>GET SUMMARY</span>
        <span className="diamond diamond-right" aria-hidden="true">
          <span />
        </span>
      </Link>
    </main>
  );
}
