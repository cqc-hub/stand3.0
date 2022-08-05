import { createSSRApp } from 'vue';
import { painaInstall } from '@/stores/plugins';
import router from '@/router';
// import { setupRouter } from '@/router';

import App from './App.vue';
import global from './config/global';

export function createApp() {
  const app = createSSRApp(App).use(painaInstall);

  app.use(router)
  
// setupRouter(app);

  app.config.globalProperties.$global = global;

  return {
    app
  };
}
