import type { APIRoute } from 'astro';
import { SITE } from '../config';
import { getPosts, getColumns, columnPath, postPath, url, escapeXml } from '../lib/posts';

export const GET: APIRoute = async () => {
  const [posts, columns] = await Promise.all([getPosts(), getColumns()]);
  const paths = [url(), url('posts/'), url('columns/'), url('archives/'), url('about/'), ...columns.map(columnPath), ...posts.map(postPath)];
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map((path) => `<url><loc>${escapeXml(new URL(path, SITE.siteUrl).href)}</loc></url>`).join('')}</urlset>`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
