import type { APIRoute } from 'astro';
import { SITE } from '../config';
import { getPosts, postPath, url, escapeXml } from '../lib/posts';

export const GET: APIRoute = async () => {
  const posts = await getPosts();
  const absolute = (path: string) => new URL(path, SITE.siteUrl).href;
  const items = posts.map((post) => `<item><title>${escapeXml(post.data.title)}</title><link>${escapeXml(absolute(postPath(post)))}</link><guid isPermaLink="true">${escapeXml(absolute(postPath(post)))}</guid><pubDate>${post.data.date.toUTCString()}</pubDate><description>${escapeXml(post.data.description)}</description></item>`).join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>${escapeXml(SITE.title)}</title><link>${escapeXml(absolute(url()))}</link><description>${escapeXml(SITE.description)}</description><language>zh-CN</language><atom:link href="${escapeXml(absolute(url('rss.xml')))}" rel="self" type="application/rss+xml"/>${items}</channel></rss>`, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
};
