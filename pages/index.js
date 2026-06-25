import Head from 'next/head';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import data from '../data/alternatives.json';

export default function Home() {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query.trim()) return data;
    const q = query.toLowerCase();
    return data.filter(item =>
      item.paid_tool.toLowerCase().includes(q) ||
      item.paid_category.toLowerCase().includes(q) ||
      item.alternatives.some(alt => alt.name.toLowerCase().includes(q))
    );
  }, [query]);

  const totalAlts = data.reduce((s, i) => s + i.alternatives.length, 0);
  const totalSavings = data.reduce((sum, item) => {
    const m = item.paid_price.match(/\$([\d.]+)/);
    return sum + (m ? parseFloat(m[1]) : 0);
  }, 0);

  return (
    <>
      <Head>
        <title>FreeAlt — Free Alternatives to Paid Software</title>
        <meta name="description" content="Stop paying for software. Find genuinely free alternatives to Photoshop, Word, QuickBooks, and 50+ more paid tools." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://freealt.vercel.app/" />
        <meta property="og:title" content="FreeAlt — Free Alternatives to Paid Software" />
        <meta property="og:description" content="Stop paying for software. Find free alternatives to every paid tool." />
        <meta property="og:type" content="website" />
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
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </Head>

      <nav className="nav">
        <div className="nav-inner">
          <Link href="/" className="nav-brand">
            <span className="dot"></span>
            FreeAlt
          </Link>
          <div className="nav-links">
            <a href="#browse">Browse</a>
            <a href="https://github.com/ethansaiagent-dot/freealt">Source</a>
          </div>
        </div>
      </nav>

      <div className="wrap">
        <section className="hero">
          <h1>
            Stop paying.<br />
            <em>Use the free one.</em>
          </h1>
          <p>
            Every paid app has a genuinely free alternative. We tested them,
            compared them, and wrote honest reviews. No trials, no tricks.
          </p>

          <div className="search-box">
            <span className="search-icon">⌕</span>
            <input
              type="text"
              placeholder="Search any software... Photoshop, QuickBooks, etc."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
          </div>

          <div className="stats">
            <div className="stat">
              <div className="n">{data.length}</div>
              <div className="l">Tools</div>
            </div>
            <div className="stat">
              <div className="n">{totalAlts}</div>
              <div className="l">Free Alternatives</div>
            </div>
            <div className="stat">
              <div className="n">${Math.round(totalSavings)}</div>
              <div className="l">Saved / Month</div>
            </div>
          </div>
        </section>

        <section className="section" id="browse">
          <div className="section-head">
            <h2>{query ? `Results` : `All Tools`}</h2>
            <span className="count">{filtered.length} tools</span>
          </div>

          <div className="grid">
            {filtered.map((item, i) => (
              <Link href={`/${item.paid_tool.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`} key={i}>
                <div className="card">
                  <div className="card-top">
                    <h3>{item.paid_tool}</h3>
                    <span className="card-price">{item.paid_price}</span>
                  </div>
                  <p className="card-cat">{item.paid_category}</p>
                  <div className="card-alts">
                    {item.alternatives.slice(0, 3).map((alt, j) => (
                      <span className={`pill ${alt.license === 'Open Source' ? 'os' : ''}`} key={j}>
                        {alt.name}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <footer className="footer">
        <div className="wrap">
          <p>FreeAlt — Every tool has a genuinely free alternative. No tricks, no trials.</p>
          <p><a href="https://github.com/ethansaiagent-dot/freealt">Open source</a> · Updated weekly</p>
        </div>
      </footer>
    </>
  );
}
