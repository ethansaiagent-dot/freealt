import Head from 'next/head';
import Link from 'next/link';
import data from '../data/alternatives.json';

export async function getStaticPaths() {
  const paths = data.map(item => ({
    params: { slug: item.paid_tool.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') }
  }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const item = data.find(
    d => d.paid_tool.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') === params.slug
  );
  if (!item) return { notFound: true };

  const related = data
    .filter(d => d.paid_category === item.paid_category && d.paid_tool !== item.paid_tool)
    .slice(0, 4);

  return { props: { item, related } };
}

function tagClass(license) {
  if (license === 'Open Source') return 'tag os';
  if (license === 'Freemium') return 'tag freemium';
  return 'tag free';
}

export default function ToolPage({ item, related }) {
  const slug = item.paid_tool.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  return (
    <>
      <Head>
        <title>{`Free Alternatives to ${item.paid_tool} in 2026 — ${item.alternatives.length} Free Options`}</title>
        <meta name="description" content={`Best free alternatives to ${item.paid_tool} (${item.paid_price}). Compare features, pros, and cons.`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href={`https://freealt.vercel.app/${slug}/`} />
        <meta property="og:title" content={`Free Alternatives to ${item.paid_tool}`} />
        <meta property="og:description" content={`Stop paying ${item.paid_price} for ${item.paid_tool}.`} />
        <meta property="og:type" content="article" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": `Free Alternatives to ${item.paid_tool}`,
            "about": {
              "@type": "SoftwareApplication",
              "name": item.paid_tool,
              "applicationCategory": item.paid_category,
              "offers": { "@type": "Offer", "price": item.paid_price }
            },
            "mainEntity": {
              "@type": "ItemList",
              "itemListElement": item.alternatives.map((alt, i) => ({
                "@type": "ListItem",
                "position": i + 1,
                "item": {
                  "@type": "SoftwareApplication",
                  "name": alt.name,
                  "offers": { "@type": "Offer", "price": "0" }
                }
              }))
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
            <Link href="/">All Tools</Link>
          </div>
        </div>
      </nav>

      <div className="wrap">
        <div className="crumb">
          <Link href="/">Home</Link>
          <span className="s">/</span>
          <span>{item.paid_category}</span>
          <span className="s">/</span>
          <span>{item.paid_tool}</span>
        </div>

        <div className="tool">
          <h1>Free Alternatives<br />to {item.paid_tool}</h1>
          <div className="tool-meta">
            <span className="badge-price">{item.paid_tool} — {item.paid_price}</span>
            <span className="badge-cat">{item.paid_category}</span>
          </div>
          <p className="tool-intro">
            {item.alternatives.length} genuinely free alternatives to {item.paid_tool}. 
            No trials, no watermarks, no credit card. Each one compared honestly.
          </p>
        </div>

        <div className="alts">
          {item.alternatives.map((alt, i) => (
            <div className="alt" key={i} id={alt.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}>
              <div className="alt-head">
                <div>
                  <div className="alt-num">Option {i + 1}</div>
                  <h2>{alt.name}</h2>
                  <div className="alt-tags">
                    <span className={tagClass(alt.license)}>{alt.license}</span>
                    <span className="tag free">{alt.free_tier}</span>
                  </div>
                  {alt.best_for && (
                    <div className="alt-best">Best for: <strong>{alt.best_for}</strong></div>
                  )}
                </div>
                <a href={alt.url} target="_blank" rel="noopener noreferrer nofollow" className="visit">
                  Visit →
                </a>
              </div>

              <p className="alt-desc">{alt.description}</p>

              <div className="pc">
                <div className="pc-col pros">
                  <h4>Pros</h4>
                  <ul>
                    {alt.pros.map((pro, j) => (
                      <li key={j}><span className="m">+</span> {pro}</li>
                    ))}
                  </ul>
                </div>
                <div className="pc-col cons">
                  <h4>Cons</h4>
                  <ul>
                    {alt.cons.map((con, k) => (
                      <li key={k}><span className="m">−</span> {con}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {related.length > 0 && (
          <section className="related">
            <h3>Related Alternatives</h3>
            <div className="rel-grid">
              {related.map((rel, i) => {
                const rs = rel.paid_tool.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
                return (
                  <Link href={`/${rs}`} key={i}>
                    <div className="rel-card">
                      <h4>{rel.paid_tool}</h4>
                      <span className="rp">{rel.paid_price}</span>
                      <p className="rh">{rel.alternatives[0].name} + {rel.alternatives.length - 1} more</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        <Link href="/" className="back">← All tools</Link>
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
