import { defineConfig, fontProviders } from 'astro/config';

const [owner, repository] = (process.env.GITHUB_REPOSITORY || 'zlzhl1/zlzhl1.github.io').split('/');
const personalSite = repository.toLowerCase() === `${owner.toLowerCase()}.github.io`;
const base = process.env.SITE_BASE ?? (personalSite ? '/' : `/${repository}`);

export default defineConfig({
  site: process.env.PUBLIC_SITE_URL || `https://${owner}.github.io`,
  base,
  output: 'static',
  trailingSlash: 'always',
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Atkinson',
      cssVariable: '--font-atkinson',
      fallbacks: ['PingFang SC', 'Microsoft YaHei', 'sans-serif'],
      options: {
        variants: [
          {
            src: ['./src/assets/fonts/atkinson-regular.woff'],
            weight: 400,
            style: 'normal',
            display: 'swap',
          },
          {
            src: ['./src/assets/fonts/atkinson-bold.woff'],
            weight: 700,
            style: 'normal',
            display: 'swap',
          },
        ],
      },
    },
  ],
  markdown: {
    shikiConfig: { theme: 'github-dark', wrap: true },
  },
  devToolbar: { enabled: false },
});
