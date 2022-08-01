import { createSSRApp } from 'vue'
import { painaInstall } from '@/stores/plugins'
import App from './App.vue'

export function createApp() {
	const app = createSSRApp(App)
	app.use(painaInstall)

	return {
		app
	}
}
