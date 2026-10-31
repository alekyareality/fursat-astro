import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://fursatind.in',
  integrations: [sitemap(), react()],
  compressHTML: true,
  build: { inlineStylesheets: 'never' },
  devToolbar: { enabled: false },
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      // Prevent Three.js CJS deprecation warning during SSR
      noExternal: ['three', '@react-three/fiber', '@react-three/drei'],
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            // Split heavy 3D vendor code into its own chunk
            'three-vendor': ['three', '@react-three/fiber'],
          },
        },
      },
    },
  },
});
