import type { APIRoute } from 'astro';
import { SITE } from '../config';
import { url } from '../lib/posts';

export const GET: APIRoute = () => new Response(`User-agent: *\nAllow: /\nSitemap: ${new URL(url('sitemap.xml'), SITE.siteUrl).href}\n`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
