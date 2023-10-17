import { createSSRApp } from 'vue';
import { painaInstall } from '@/stores/plugins';
import 'animate.css';

import App from './App.vue';
import global from './config/global';
// #ifdef H5
import VConsole from 'vconsole';
if (global.env !== 'prod') {
  new VConsole();
}
// #endif

export function createApp() {
  const app = createSSRApp(App).use(painaInstall);

  // app.use(router);

  app.config.globalProperties.$global = global;

  return {
    app,
  };
}
