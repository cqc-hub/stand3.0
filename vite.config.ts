import { defineConfig } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';
import { resolve } from 'path';
import h5ProdEffectPlugin from 'uni-vite-plugin-h5-prod-effect';

const os = require('os');
const interfaces = os.networkInterfaces();
let netIp = '';

for (const devName in interfaces) {
  if (netIp) {
    break;
  }
  const iface = interfaces[devName];

  for (let i = 0; i < iface.length; i++) {
    const { family, address, internal } = iface[i];
    if (family === 'IPv4' && address !== '127.0.0.1' && !internal) {
      netIp = address;
    }
  }
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

  // 按照项目实际地址修改
  base: '/shaoxin2/',

  // build: {
  //   minify: 'terser',
  //   terserOptions: {
  //     compress: {
  //       drop_console: true,
  //     },
  //   },
  // },
});
