import type { APIRoute } from 'astro';
import { SITE, CATEGORIES } from '../config';
import { getPosts, postPath, url, escapeXml } from '../lib/posts';

export const GET: APIRoute = async () => {
  const posts = await getPosts();
  const paths = [url(), url('posts/'), url('archives/'), url('about/'), ...CATEGORIES.map((category) => url(`columns/${category.id}/`)), ...posts.map(postPath)];
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map((path) => `<url><loc>${escapeXml(new URL(path, SITE.siteUrl).href)}</loc></url>`).join('')}</urlset>`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
