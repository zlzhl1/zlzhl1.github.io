import { defineConfig } from 'astro/config';

const [owner, repository] = (process.env.GITHUB_REPOSITORY || 'zlzhl1/zlzhl1.github.io').split('/');
const personalSite = repository.toLowerCase() === `${owner.toLowerCase()}.github.io`;
const base = process.env.SITE_BASE ?? (personalSite ? '/' : `/${repository}`);

export default defineConfig({
  site: process.env.PUBLIC_SITE_URL || `https://${owner}.github.io`,
  base,
  output: 'static',
  trailingSlash: 'always',
  markdown: {
    shikiConfig: { theme: 'github-dark', wrap: true },
  },
  devToolbar: { enabled: false },
});
