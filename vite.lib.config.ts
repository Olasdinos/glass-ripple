import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    dts({ rollupTypes: true }),
  ],
  build: {
    lib: {
      entry: {
        'glass-ripple': resolve(__dirname, 'src/glass-ripple.ts'),
        'icons/index': resolve(__dirname, 'src/icons/index.ts'),
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: ['three'],
      output: {
        entryFileNames: '[name].js',
      },
    },
    outDir: 'dist',
    emptyOutDir: true,
  },
});
