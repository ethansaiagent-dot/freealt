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
  
  // Find related tools (same category)
  const related = data
    .filter(d => d.paid_category === item.paid_category && d.paid_tool !== item.paid_tool)
    .slice(0, 4);

  return { props: { item, related } };
}

export default function ToolPage({ item, related }) {
  const slug = item.paid_tool.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  
  return (
    <>
      <Head>
        <title>{`Free Alternatives to ${item.paid_tool} in 2026 — ${item.alternatives.length} Free Options`}</title>
        <meta name="description" content={`The best free alternatives to ${item.paid_tool} (${item.paid_price}). Compare features, pros, cons, and find the right free replacement.`} />
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

      <div className="container">
        <header>
          <Link href="/"><h1>FreeAlt</h1></Link>
        </header>

        <nav className="breadcrumb">
          <Link href="/">Home</Link> / <span>{item.paid_category}</span> / <span>{item.paid_tool}</span>
        </nav>

        <div className="tool-header">
          <h1>Free Alternatives to {item.paid_tool}</h1>
          <div className="price-tag">
            <span className="old-price">{item.paid_tool} costs {item.paid_price}</span>
            <span className="new-price">These are free</span>
          </div>
          <p className="category-tag">{item.paid_category}</p>
        </div>

        <p className="intro">
          Looking for a free alternative to {item.paid_tool}? You're in the right place.
          Below are {item.alternatives.length} genuinely free options — no trials, no watermarks,
          no credit card required. Each one is compared so you can pick the best replacement.
        </p>

        <div className="alternatives-list">
          {item.alternatives.map((alt, i) => (
            <div className="alt-card" key={i} id={alt.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}>
              <div className="alt-card-header">
                <div>
                  <h2>{i + 1}. {alt.name}</h2>
                  <div className="alt-meta">
                    <span className="badge {alt.license === 'Open Source' ? 'badge-green' : 'badge-blue'}">{alt.license}</span>
                    <span className="badge badge-free">{alt.free_tier}</span>
                  </div>
                </div>
                <a href={alt.url} target="_blank" rel="noopener noreferrer nofollow" className="visit-btn">
                  Visit Site →
                </a>
              </div>

              <p className="alt-description">{alt.description}</p>

              <div className="pros-cons">
                <div className="pros">
                  <h3>✓ Pros</h3>
                  <ul>
                    {alt.pros.map((pro, j) => <li key={j}>{pro}</li>)}
                  </ul>
                </div>
                <div className="cons">
                  <h3>✗ Cons</h3>
                  <ul>
                    {alt.cons.map((con, k) => <li key={k}>{con}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {related.length > 0 && (
          <div className="related">
            <h2>Related Free Alternatives</h2>
            <div className="related-grid">
              {related.map((rel, i) => {
                const relSlug = rel.paid_tool.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
                return (
                  <Link href={`/${relSlug}`} key={i}>
                    <div className="related-card">
                      <h3>{rel.paid_tool}</h3>
                      <span className="price">{rel.paid_price}</span>
                      <p>{rel.alternatives[0].name} + {rel.alternatives.length - 1} more</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        <footer>
          <Link href="/">← Back to all tools</Link>
        </footer>
      </div>
    </>
  );
}
