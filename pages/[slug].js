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

function getLicenseTag(license) {
  if (license === 'Open Source') return 'tag-open';
  if (license === 'Freemium') return 'tag-freemium';
  return 'tag-free';
}

export default function ToolPage({ item, related }) {
  const slug = item.paid_tool.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  return (
    <>
      <Head>
        <title>{`Free Alternatives to ${item.paid_tool} in 2026 — ${item.alternatives.length} Free Options`}</title>
        <meta name="description" content={`Best free alternatives to ${item.paid_tool} (${item.paid_price}). Compare features, pros, cons, and find the right free replacement.`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href={`https://freealt.vercel.app/${slug}/`} />
        <meta property="og:title" content={`Free Alternatives to ${item.paid_tool}`} />
        <meta property="og:description" content={`Stop paying ${item.paid_price} for ${item.paid_tool}. These free alternatives do the same job.`} />
        <meta property="og:type" content="article" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": `Free Alternatives to ${item.paid_tool}`,
            "description": `Free alternatives to ${item.paid_tool} (${item.paid_price})`,
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
                  "applicationCategory": item.paid_category,
                  "operatingSystem": "Cross-platform",
                  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
                }
              }))
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
            <Link href="/">Browse All</Link>
          </div>
        </div>
      </nav>

      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link href="/">Home</Link>
          <span className="sep">/</span>
          <span>{item.paid_category}</span>
          <span className="sep">/</span>
          <span>{item.paid_tool}</span>
        </div>

        {/* Hero */}
        <div className="tool-hero">
          <h1>Free Alternatives to {item.paid_tool}</h1>
          <div className="tool-meta">
            <span className="tool-price-badge">{item.paid_tool} — {item.paid_price}</span>
            <span className="tool-cat-badge">{item.paid_category}</span>
          </div>
          <p className="tool-intro">
            Looking for a free alternative to {item.paid_tool}? Below are {item.alternatives.length} genuinely free options
            — no trials, no watermarks, no credit card required. Each one is compared so you can pick the right replacement.
          </p>
        </div>

        {/* Alternatives */}
        <div className="alt-list">
          {item.alternatives.map((alt, i) => (
            <div className="alt-item" key={i} id={alt.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}>
              <div className="alt-item-head">
                <div>
                  <h2>{i + 1}. {alt.name}</h2>
                  <div className="alt-badges">
                    <span className={`tag ${getLicenseTag(alt.license)}`}>{alt.license}</span>
                    <span className="tag tag-free">{alt.free_tier}</span>
                  </div>
                </div>
                <a href={alt.url} target="_blank" rel="noopener noreferrer nofollow" className="visit-link">
                  Visit →
                </a>
              </div>

              <p className="alt-desc">{alt.description}</p>

              <div className="pc-grid">
                <div className="pc-col pros">
                  <h3>Pros</h3>
                  <ul>
                    {alt.pros.map((pro, j) => (
                      <li key={j}><span className="icon">+</span> {pro}</li>
                    ))}
                  </ul>
                </div>
                <div className="pc-col cons">
                  <h3>Cons</h3>
                  <ul>
                    {alt.cons.map((con, k) => (
                      <li key={k}><span className="icon">−</span> {con}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="related-section">
            <h2>Related Free Alternatives</h2>
            <div className="related-grid">
              {related.map((rel, i) => {
                const relSlug = rel.paid_tool.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
                return (
                  <Link href={`/${relSlug}`} key={i}>
                    <div className="related-card">
                      <h3>{rel.paid_tool}</h3>
                      <span className="price">{rel.paid_price}</span>
                      <p className="alt-hint">{rel.alternatives[0].name} + {rel.alternatives.length - 1} more</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Back */}
        <div style={{ padding: '20px 0 60px' }}>
          <Link href="/" className="back-link">← Back to all tools</Link>
        </div>
      </div>

      <footer className="footer">
        <div className="container">
          <p>FreeAlt — Every tool has a genuinely free alternative. No tricks, no trials.</p>
          <p><a href="https://github.com/ethansaiagent-dot/freealt">Open Source</a> · Updated weekly</p>
        </div>
      </footer>
    </>
  );
}
