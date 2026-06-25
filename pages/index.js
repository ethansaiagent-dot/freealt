import Head from 'next/head';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import alternativesData from '../data/alternatives.json';

export default function Home() {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query.trim()) return alternativesData;
    const q = query.toLowerCase();
    return alternativesData.filter(item =>
      item.paid_tool.toLowerCase().includes(q) ||
      item.paid_category.toLowerCase().includes(q) ||
      item.alternatives.some(alt => alt.name.toLowerCase().includes(q))
    );
  }, [query]);

  const totalSavings = alternativesData.reduce((sum, item) => {
    const match = item.paid_price.match(/\$([\d.]+)/);
    return sum + (match ? parseFloat(match[1]) : 0);
  }, 0);

  return (
    <>
      <Head>
        <title>FreeAlt — Free Alternatives to Paid Software</title>
        <meta name="description" content="Stop paying for software. Find free, open-source alternatives to Photoshop, Word, QuickBooks, and 50+ more paid tools. Compare features, pros, and cons." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://freealt.vercel.app/" />
        <meta property="og:title" content="FreeAlt — Free Alternatives to Paid Software" />
        <meta property="og:description" content="Stop paying for software. Find free alternatives to every paid tool." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://freealt.vercel.app/og.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "FreeAlt",
            "url": "https://freealt.vercel.app",
            "description": "Find free alternatives to paid software",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://freealt.vercel.app/?q={search_term}",
              "query-input": "required name=search_term"
            }
          })
        }} />
      </Head>

      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-inner">
          <Link href="/" className="navbar-logo">
            <span className="dot"></span>
            FreeAlt
          </Link>
          <div className="navbar-links">
            <a href="#tools">Browse</a>
            <a href="https://github.com/ethansaiagent-dot/freealt">GitHub</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="container">
        <section className="hero">
          <h1>
            Stop paying for software.<br />
            Use the <span className="highlight">free alternative</span>.
          </h1>
          <p>
            Every paid tool has a free counterpart. We've tested and compared them
            so you don't have to. No trials, no watermarks, no credit card.
          </p>

          <div className="search-wrap">
            <span className="search-icon">⌕</span>
            <input
              type="text"
              placeholder="Search any paid software... (Photoshop, QuickBooks, Word)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
          </div>

          <div className="stats">
            <div className="stat">
              <div className="num">{alternativesData.length}</div>
              <div className="label">Paid Tools Covered</div>
            </div>
            <div className="stat">
              <div className="num">{alternativesData.reduce((s, i) => s + i.alternatives.length, 0)}</div>
              <div className="label">Free Alternatives</div>
            </div>
            <div className="stat">
              <div className="num">${Math.round(totalSavings)}/mo</div>
              <div className="label">Potential Savings</div>
            </div>
          </div>
        </section>

        {/* Cards */}
        <section id="tools">
          <h2 className="section-title">
            {query ? `Results (${filtered.length})` : 'Browse All Tools'}
          </h2>

          <div className="cards-grid">
            {filtered.map((item, i) => (
              <Link href={`/${item.paid_tool.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`} key={i}>
                <div className="card">
                  <div className="card-top">
                    <h2>{item.paid_tool}</h2>
                    <span className="card-price">{item.paid_price}</span>
                  </div>
                  <p className="card-cat">{item.paid_category}</p>
                  <div className="card-alts">
                    {item.alternatives.slice(0, 3).map((alt, j) => (
                      <span className={`alt-pill ${alt.license === 'Open Source' ? 'open-src' : ''}`} key={j}>
                        {alt.name}{alt.license === 'Open Source' ? ' ✦' : ''}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>FreeAlt — Every tool has a genuinely free alternative. No tricks, no trials.</p>
          <p><a href="https://github.com/ethansaiagent-dot/freealt">Open Source</a> · Updated weekly</p>
        </div>
      </footer>
    </>
  );
}
