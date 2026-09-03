import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const routes = ['', '/login', '/register', '/pricing', '/rankings', '/contact', '/api-docs'];
  return routes.map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
    changeFrequency: 'always',
    priority: route === '' ? 1 : 0.7,
  }));
}
