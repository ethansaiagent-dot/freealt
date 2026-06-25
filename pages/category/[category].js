import Head from 'next/head';
import Link from 'next/link';
import data from '../../data/alternatives.json';

export async function getStaticPaths() {
  const categories = [...new Set(data.map(item => item.paid_category))];
  const paths = categories.map(cat => ({
    params: { category: cat.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') }
  }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const category = data.find(
    d => d.paid_category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') === params.category
  )?.paid_category;
  
  if (!category) return { notFound: true };
  
  const tools = data.filter(d => d.paid_category === category);
  const otherCategories = [...new Set(data.map(d => d.paid_category))]
    .filter(c => c !== category)
    .slice(0, 8);

  return { props: { category, tools, otherCategories } };
}

export default function CategoryPage({ category, tools, otherCategories }) {
  const slug = category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  
  return (
    <>
      <Head>
        <title>{`Free ${category} Software Alternatives — ${tools.length} Tools`}</title>
        <meta name="description" content={`Free alternatives to paid ${category.toLowerCase()} software. Compare ${tools.length} tools and their free replacements.`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href={`https://freealt.vercel.app/category/${slug}/`} />
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
          <span>{category}</span>
        </div>

        <div className="tool">
          <h1>Free {category} Alternatives</h1>
          <p className="tool-intro">
            {tools.length} paid {category.toLowerCase()} tools with genuinely free alternatives. No trials, no tricks.
          </p>
        </div>

        <div className="grd">
          {tools.map((item, i) => (
            <Link href={`/${item.paid_tool.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`} key={i}>
              <div className="cd">
                <div className="cd-top">
                  <h3>{item.paid_tool}</h3>
                  <span className="cd-pr">{item.paid_price}</span>
                </div>
                <p className="cd-cat">{item.paid_category}</p>
                <div className="cd-alts">
                  {item.alternatives.slice(0, 3).map((alt, j) => (
                    <span className={`pl ${alt.license === 'Open Source' ? 'os' : ''}`} key={j}>
                      {alt.name}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <section className="rel">
          <h3>Other Categories</h3>
          <div className="rel-g">
            {otherCategories.map((cat, i) => {
              const cs = cat.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
              return (
                <Link href={`/category/${cs}`} key={i}>
                  <div className="rel-c">
                    <h4>{cat}</h4>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <Link href="/" className="bk">← All tools</Link>
      </div>

      <footer className="ftr">
        <div className="wrap">
          <p>FreeAlt — Every tool has a genuinely free alternative.</p>
        </div>
      </footer>
    </>
  );
}
