import assert from 'node:assert/strict';
import { cp, mkdir, mkdtemp, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

// All mutations stay in an ignored fixture; the author's Markdown is never edited.
const project = process.cwd();
const fixtures = path.join(project, '.local');
await mkdir(fixtures, { recursive: true });
const fixture = await mkdtemp(path.join(fixtures, 'content-flow-'));
for (const entry of ['src', 'public', 'astro.config.mjs', 'tsconfig.json', 'package.json']) {
  await cp(path.join(project, entry), path.join(fixture, entry), { recursive: true });
}

const columns = path.join(fixture, 'src/content/columns');
const posts = path.join(fixture, 'src/content/posts');
await mkdir(columns, { recursive: true });
const marker = 'Content transfer acceptance article';
const articleName = 'transfer-acceptance';
const articleFile = path.join(posts, `${articleName}.md`);
const article = (column) => `---\ntitle: "${marker}"\ndescription: "An isolated transfer verification article."\ndate: 2020-01-01\ncolumn: ${column}\n---\n\nTRANSFER_BODY_STAYS_THE_SAME\n`;
for (const [id, title] of [['transfer-first', 'First test column'], ['transfer-second', 'Second test column']]) {
  await writeFile(path.join(columns, `${id}.md`), `---\ntitle: "${title}"\n---\n`);
}
await writeFile(articleFile, article('transfer-first'));
await writeFile(path.join(posts, 'transfer-hidden-draft.md'), '---\ntitle: "Hidden draft"\ndescription: "Draft fixture."\ndate: 2020-01-01\ndraft: true\n---\n\nHidden.\n');
await writeFile(path.join(posts, 'transfer-hidden-future.md'), '---\ntitle: "Hidden future"\ndescription: "Future fixture."\ndate: 2999-01-01\n---\n\nHidden.\n');

const cli = path.join(project, 'node_modules/astro/bin/astro.mjs');
const env = {
  ...process.env,
  ASTRO_TELEMETRY_DISABLED: '1',
  // Exercise Pages project subpaths as well as the root-path production build.
  SITE_BASE: '/transfer-check/',
  PUBLIC_SITE_URL: 'https://example.test',
};
function build(expectSuccess = true) {
  const result = spawnSync(process.execPath, [cli, 'build'], {
    cwd: fixture, env, encoding: 'utf8', timeout: 120000, maxBuffer: 8 * 1024 * 1024,
  });
  const output = `${result.stdout || ''}\n${result.stderr || ''}`;
  if (result.error) throw result.error;
  if (expectSuccess && result.status !== 0) throw new Error(`Fixture build failed:\n${output}`);
  if (!expectSuccess) {
    assert.notEqual(result.status, 0, 'An unknown column must stop the build');
    assert.match(output, /missing-column|不存在|reference|not found/i, 'Failure should identify the invalid content reference');
  }
}
async function output(relative) {
  return readFile(path.join(fixture, 'dist', relative), 'utf8');
}
async function countArticles() {
  const entries = await readdir(path.join(fixture, 'dist/posts'), { withFileTypes: true });
  return entries.filter((entry) => entry.isDirectory()).length;
}
async function assertHidden() {
  const entries = await readdir(path.join(fixture, 'dist/posts'));
  assert(!entries.includes('transfer-hidden-draft'), 'Draft must not have a published route');
  assert(!entries.includes('transfer-hidden-future'), 'Future article must not have a published route');
}
async function assertMembership(firstContains, secondContains) {
  // Sidebar counts can change, but only the actual article list owns post-title links.
  const titleLink = new RegExp(`<a[^>]+href="/transfer-check/posts/${articleName}/"[^>]*>${marker}</a>`);
  assert.equal(titleLink.test(await output('columns/transfer-first/index.html')), firstContains, 'Unexpected first-column membership');
  assert.equal(titleLink.test(await output('columns/transfer-second/index.html')), secondContains, 'Unexpected second-column membership');
}

try {
  console.log('Checking the initial column and hidden article states...');
  build();
  await assertMembership(true, false);
  await assertHidden();
  const beforeCount = await countArticles();
  const beforeSourceCount = (await readdir(posts, { recursive: true })).filter((name) => name.endsWith('.md')).length;
  const beforeBody = (await readFile(articleFile, 'utf8')).split('---\n').slice(2).join('---\n');
  const beforePage = await output(`posts/${articleName}/index.html`);
  const canonical = /<link[^>]+rel="canonical"[^>]+href="([^"]+)"/.exec(beforePage)?.[1];
  assert.equal(canonical, `https://example.test/transfer-check/posts/${articleName}/`);

  // This is a transfer: overwrite only the single membership field in the same file.
  await writeFile(articleFile, article('transfer-second'));
  console.log('Checking transfer into the second column without duplicating the article...');
  build();
  await assertMembership(false, true);
  assert.equal(await countArticles(), beforeCount, 'Transfer must not add or remove article routes');
  assert.equal((await readdir(posts)).filter((name) => name === `${articleName}.md`).length, 1, 'The source must remain one Markdown file');
  assert.equal((await readdir(posts, { recursive: true })).filter((name) => name.endsWith('.md')).length, beforeSourceCount, 'Transfer must not create additional Markdown files');
  assert.equal((await readFile(articleFile, 'utf8')).split('---\n').slice(2).join('---\n'), beforeBody, 'Transfer must preserve the article body');
  const afterPage = await output(`posts/${articleName}/index.html`);
  assert.equal(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/.exec(afterPage)?.[1], canonical, 'Transfer must preserve the canonical URL');
  assert.equal((await output('sitemap.xml')).split(canonical).length - 1, 1, 'The article URL must appear once in sitemap');
  assert.equal((await output('rss.xml')).split(`<guid isPermaLink="true">${canonical}</guid>`).length - 1, 1, 'The article must appear once in RSS');
  await assertHidden();
  const verification = spawnSync(process.execPath, [path.join(project, 'scripts/verify-build.mjs')], {
    cwd: fixture, env, encoding: 'utf8', timeout: 30000,
  });
  if (verification.error) throw verification.error;
  assert.equal(verification.status, 0, `Subpath output verification failed:\n${verification.stdout || ''}\n${verification.stderr || ''}`);

  await writeFile(articleFile, article('missing-column'));
  console.log('Checking that an unknown column stops publication...');
  build(false);
  console.log('Verified direct article transfer, stable URL/body/count, single source, draft/future visibility, invalid-column rejection and Pages subpath rendering.');
  console.log(`Isolated fixture: ${path.relative(project, fixture)}`);
} finally {
  // Keep the isolated fixture reviewable; never leave it in the intentionally invalid state.
  await writeFile(articleFile, article('transfer-second'));
}
