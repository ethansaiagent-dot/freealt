import alternativesData from './data/alternatives.json';

function generateSitemap() {
  const baseUrl = 'https://freealt.vercel.app';
  const urls = [
    `${baseUrl}/`,
    ...alternativesData.map(item =>
      `${baseUrl}/${item.paid_tool.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}/`
    )
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${url === baseUrl + '/' ? '1.0' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>`;

  return xml;
}

export default generateSitemap;
