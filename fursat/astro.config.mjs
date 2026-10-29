import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import react from '@astrojs/react';

export default defineConfig({
  site: 'https://fursatind.in',
  integrations: [sitemap(), react()],
  compressHTML: true,
  build: { inlineStylesheets: 'never' },
  devToolbar: { enabled: false },
});