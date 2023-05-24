import { defineConfig } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';
import { resolve } from 'path';
import h5ProdEffectPlugin from 'uni-vite-plugin-h5-prod-effect';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [uni(), h5ProdEffectPlugin()],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: resolve(__dirname, 'src'),
      },
    ],
  },

  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variable.scss";`,
      },
    },
  },
});
