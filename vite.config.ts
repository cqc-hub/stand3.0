import { defineConfig } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';
import { resolve } from 'path';
import h5ProdEffectPlugin from 'uni-vite-plugin-h5-prod-effect';

const os = require('os');
const interfaces = os.networkInterfaces();
let netIp = '';

for (const devName in interfaces) {
  const iface = interfaces[devName];

  iface.map((o) => {
    const { family, address, internal } = o;
    if (family === 'IPv4' && address !== '127.0.0.1' && !internal) {
      netIp = address;
    }
  });
}

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

  server: {
    open: true,
    host: netIp,
  },

  // build: {
  //   minify: 'terser',
  //   terserOptions: {
  //     compress: {
  //       drop_console: true,
  //     },
  //   },
  // },
});
