import generateSitemap from '../sitemap.js';

export async function getServerSideProps({ res }) {
  const xml = generateSitemap();
  res.setHeader('Content-Type', 'text/xml');
  res.write(xml);
  res.end();
  return { props: {} };
}

export default function Sitemap() {
  return null;
}
