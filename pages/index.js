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

  return (
    <>
      <Head>
        <title>Free Alternatives to Paid Software — Find Free Replacements</title>
        <meta name="description" content="Find free alternatives to expensive software. Compare features, pros, and cons of free replacements for Photoshop, Word, QuickBooks, and 25+ more paid tools." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://freealt.vercel.app/" />
        <meta property="og:title" content="Free Alternatives to Paid Software" />
        <meta property="og:description" content="Stop paying for software. Find free, open-source alternatives to every paid tool." />
        <meta property="og:type" content="website" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "FreeAlt",
            "description": "Find free alternatives to paid software",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://freealt.vercel.app/?q={search_term}",
              "query-input": "required name=search_term"
            }
          })
        }} />
      </Head>

      <div className="container">
        <header>
          <h1>FreeAlt</h1>
          <p className="tagline">Stop paying for software. Find free alternatives.</p>
        </header>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search for any paid software... (e.g. Photoshop, QuickBooks, Word)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
        </div>

        <div className="results">
          <p className="count">
            {filtered.length} {filtered.length === 1 ? 'tool' : 'tools'} with free alternatives
          </p>

          {filtered.map((item, i) => (
            <Link href={`/${item.paid_tool.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} key={i}>
              <div className="card">
                <div className="card-header">
                  <h2>{item.paid_tool}</h2>
                  <span className="price">{item.paid_price}</span>
                </div>
                <p className="category">{item.paid_category}</p>
                <div className="alt-preview">
                  {item.alternatives.slice(0, 3).map((alt, j) => (
                    <span className="alt-badge" key={j}>
                      {alt.name}
                      {alt.license === 'Open Source' && ' ✦'}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <footer>
          <p>FreeAlt — Every tool listed has a genuinely free alternative. No tricks, no trials.</p>
        </footer>
      </div>
    </>
  );
}
