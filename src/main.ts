import { createSSRApp } from 'vue'
import App from './App.vue'
import { painaInstall } from '@/stores/plugins'

export function createApp() {
	const app = createSSRApp(App)
	app.use(painaInstall)

	return {
		app
	}
}
