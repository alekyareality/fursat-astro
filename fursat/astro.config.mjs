import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://fursatind.in',
  integrations: [sitemap(), react()],
  vite: { plugins: [tailwindcss()] },
  compressHTML: true,
  build: { inlineStylesheets: 'never' },
  devToolbar: { enabled: false },
});
