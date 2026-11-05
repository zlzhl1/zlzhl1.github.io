import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { PROJECTS } from '../src/data/projects.ts';

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
for (const required of ['index.html', 'posts/index.html', 'columns/index.html', 'practice/index.html', 'about/index.html', '404.html', 'rss.xml', 'sitemap.xml', 'robots.txt', 'garden/lawn-mower.svg', 'favicon.svg']) {
  if (!files.includes(path.join(root, required))) failures.push(`Missing required output: ${required}`);
}
const rss = await readFile(path.join(root, 'rss.xml'), 'utf8');
const sitemap = await readFile(path.join(root, 'sitemap.xml'), 'utf8');
if (files.includes(path.join(root, 'archives/index.html')) || sitemap.includes('/archives/')) failures.push('The removed date archive must not be published');
for (const file of pages) {
  const html = await readFile(file, 'utf8');
  if (html.includes('>归档</a>') || /href="[^\"]*\/archives\//.test(html)) failures.push(`${path.relative(root, file)}: outdated archive navigation`);
  if (html.includes('>实践地图</a>')) failures.push(`${path.relative(root, file)}: outdated article-map navigation`);
  if (!html.includes('garden/lawn-mower.svg')) failures.push(`${path.relative(root, file)}: missing lawn-mower brand icon`);
}
const overview = await readFile(path.join(root, 'practice/index.html'), 'utf8');
if (/<time\b/.test(overview)) failures.push('The project overview must not group articles by dates');
if (!overview.includes('data-project-overview')) failures.push('Missing project portfolio overview');
for (const project of PROJECTS) {
  const route = `${base}/projects/${project.id}/`;
  if (!overview.includes(`href="${route}"`)) failures.push(`Missing project detail entry: ${project.id}`);
  if (overview.split(`data-project-card="${project.id}"`).length - 1 !== 1) failures.push(`Expected one overview card for ${project.id}`);
  const detailPath = path.join(root, `projects/${project.id}/index.html`);
  if (!files.includes(detailPath)) { failures.push(`Missing project page: ${project.id}`); continue; }
  const detail = await readFile(detailPath, 'utf8');
  for (const marker of ['data-project-architecture', 'data-project-contributions', 'data-project-decisions', 'data-project-outcomes']) {
    if (!detail.includes(marker)) failures.push(`${project.id}: missing project narrative section ${marker}`);
  }
  if (!decodeURIComponent(sitemap).includes(route)) failures.push(`${project.id}: missing from sitemap`);
  if (!detail.includes(`href="${base}/practice/"`) || !detail.includes('aria-current="page"')) failures.push(`${project.id}: missing portfolio return/active navigation`);
}
const columnsIndex = await readFile(path.join(root, 'columns/index.html'), 'utf8');
const indexLinks = new Set([...columnsIndex.matchAll(/href="([^"\s]+)"/g)].map((match) => decodeURIComponent(match[1].split(/[?#]/)[0])));
const columnPages = pages.map((file) => path.relative(root, file).split(path.sep).join('/')).filter((file) => /^columns\/.+\/index\.html$/.test(file));
for (const page of columnPages) {
  const route = `${base}/${page.replace(/index\.html$/, '')}`;
  if (!indexLinks.has(route)) failures.push(`${page}: missing from columns index`);
  if (!decodeURIComponent(sitemap).includes(route)) failures.push(`${page}: missing from sitemap`);
}
const postPages = pages.filter((file) => /^posts\/.+\/index\.html$/.test(path.relative(root, file).split(path.sep).join('/')));
if (!rss.includes('<rss') || !rss.includes('<channel>')) failures.push('RSS is invalid');
if ((rss.match(/<item>/g) || []).length !== postPages.length) failures.push('RSS article count does not match generated article pages');
if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Verified ${pages.length} HTML pages and ${links} internal links/assets, RSS, sitemap and ${columnPages.length} owner-defined columns (base: ${base || '/'}).`);
}
