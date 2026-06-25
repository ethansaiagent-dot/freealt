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

function tgCls(l) {
  if (l === 'Open Source') return 'tg os';
  return 'tg';
}

export default function ToolPage({ item, related }) {
  const slug = item.paid_tool.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const hasAff = item.alternatives.some(a => a.has_affiliate);

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
            "about": { "@type": "SoftwareApplication", "name": item.paid_tool, "applicationCategory": item.paid_category, "offers": { "@type": "Offer", "price": item.paid_price } },
            "mainEntity": { "@type": "ItemList", "itemListElement": item.alternatives.map((alt, i) => ({ "@type": "ListItem", "position": i + 1, "item": { "@type": "SoftwareApplication", "name": alt.name, "offers": { "@type": "Offer", "price": "0" } } })) }
          })
        }} />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </Head>

      <nav className="nav">
        <div className="nav-in">
          <Link href="/" className="nav-brand">FreeAlt</Link>
          <div className="nav-links"><Link href="/">All Tools</Link></div>
        </div>
      </nav>

      <div className="wrap">
        <div className="cr">
          <Link href="/">Home</Link><span className="s">/</span>
          <span>{item.paid_category}</span><span className="s">/</span>
          <span>{item.paid_tool}</span>
        </div>

        <div className="tool">
          <h1>Free Alternatives to {item.paid_tool}</h1>
          <div className="tool-meta">
            <span className="bp">{item.paid_tool} — {item.paid_price}</span>
            <span className="bc">{item.paid_category}</span>
          </div>
          <p className="tool-intro">
            {item.alternatives.length} genuinely free alternatives. No trials, no watermarks, no credit card.
          </p>
        </div>

        <div className="alts">
          {item.alternatives.map((alt, i) => (
            <div className="alt" key={i} id={alt.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}>
              <div className="alt-h">
                <div>
                  <div className="alt-n">Option {i + 1}</div>
                  <h2>{alt.name}</h2>
                  <div className="alt-t">
                    <span className={tgCls(alt.license)}>{alt.license}</span>
                    <span className="tg">{alt.free_tier}</span>
                    {alt.has_affiliate && <span className="tg">★ Partner</span>}
                  </div>
                  {alt.best_for && <div className="alt-bf">Best for <strong>{alt.best_for}</strong></div>}
                </div>
                <a href={alt.url} target="_blank" rel="noopener noreferrer nofollow" className="vis">Visit →</a>
              </div>
              <p className="alt-d">{alt.description}</p>
              <div className="pc">
                <div className="pc-c p">
                  <h4>Pros</h4>
                  <ul>{alt.pros.map((p, j) => <li key={j}><span className="m">+</span> {p}</li>)}</ul>
                </div>
                <div className="pc-c c">
                  <h4>Cons</h4>
                  <ul>{alt.cons.map((c, k) => <li key={k}><span className="m">−</span> {c}</li>)}</ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {related.length > 0 && (
          <section className="rel">
            <h3>Related</h3>
            <div className="rel-g">
              {related.map((r, i) => {
                const rs = r.paid_tool.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
                return (
                  <Link href={`/${rs}`} key={i}>
                    <div className="rel-c">
                      <h4>{r.paid_tool}</h4>
                      <span className="rp">{r.paid_price}</span>
                      <p className="rh">{r.alternatives[0].name} +{r.alternatives.length - 1}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        <Link href="/" className="bk">← All tools</Link>
      </div>

      <footer className="ftr">
        <div className="wrap">
          <p>FreeAlt — Every tool has a genuinely free alternative.</p>
          <p><a href="https://github.com/ethansaiagent-dot/freealt">Open source</a> · Updated weekly</p>
        </div>
      </footer>
    </>
  );
}
