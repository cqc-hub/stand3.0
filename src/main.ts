import { createSSRApp } from 'vue'
import { painaInstall } from '@/stores/plugins'
import { setupRouter } from '@/router'

import App from './App.vue'
import global from './config/global'

export function createApp() {
  const app = createSSRApp(App).use(painaInstall)

  setupRouter(app)

  app.config.globalProperties.$global = global

  return {
    app
  }
}
