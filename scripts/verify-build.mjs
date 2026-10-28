import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('dist');
const configuredBase = process.env.SITE_BASE ?? (() => {
  const [owner, repo] = (process.env.GITHUB_REPOSITORY || 'zlzhl1/zlzhl1.github.io').split('/');
  return repo.toLowerCase() === `${owner.toLowerCase()}.github.io` ? '/' : `/${repo}`;
})();
const base = configuredBase.replace(/\/+$/, '');
const failures = [];

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return (await Promise.all(entries.map((entry) => entry.isDirectory() ? walk(path.join(dir, entry.name)) : path.join(dir, entry.name)))).flat();
}
const files = await walk(root);
const pages = files.filter((file) => file.endsWith('.html'));
let links = 0;
for (const file of pages) {
  const html = await readFile(file, 'utf8');
  const name = path.relative(root, file);
  if (!/<html[^>]+lang="zh-CN"/.test(html)) failures.push(`${name}: missing Chinese language metadata`);
  if ((html.match(/<h1(?:\s|>)/g) || []).length !== 1) failures.push(`${name}: expected exactly one main heading`);
  if (!/<title>[^<]+<\/title>/.test(html)) failures.push(`${name}: missing title`);
  if (!html.includes('name="description"')) failures.push(`${name}: missing page description`);
  for (const match of html.matchAll(/(?:href|src)="([^"\s]+)"/g)) {
    const target = match[1].split(/[?#]/)[0];
    if (!target || /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(target)) continue;
    links++;
    let local;
    if (target.startsWith('/')) {
      if (base && target !== base && !target.startsWith(`${base}/`)) {
        failures.push(`${name}: URL escapes deployment base: ${target}`);
        continue;
      }
      local = path.join(root, decodeURIComponent(target.slice(base.length)));
    } else {
      local = path.resolve(path.dirname(file), decodeURIComponent(target));
    }
    try {
      const metadata = await stat(local);
      if (metadata.isDirectory()) await stat(path.join(local, 'index.html'));
    } catch {
      failures.push(`${name}: missing local target ${target}`);
    }
  }
}
for (const required of ['index.html', 'posts/index.html', 'about/index.html', '404.html', 'rss.xml', 'sitemap.xml', 'robots.txt', 'columns/project/index.html', 'columns/lab/index.html', 'columns/explain/index.html', 'columns/journal/index.html']) {
  if (!files.includes(path.join(root, required))) failures.push(`Missing required output: ${required}`);
}
const rss = await readFile(path.join(root, 'rss.xml'), 'utf8');
if (!rss.includes('<rss') || !rss.includes('<item>')) failures.push('RSS is missing articles');
if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Verified ${pages.length} HTML pages and ${links} internal links/assets, RSS, sitemap and all four columns (base: ${base || '/'}).`);
}
