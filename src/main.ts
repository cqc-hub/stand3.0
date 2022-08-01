import { createSSRApp } from 'vue'
import App from './App.vue'
import * as Pinia from 'pinia'
import usePinia from '@/stores'

export function createApp() {
	const app = createSSRApp(App)
	const pinia = Pinia.createPinia()

	usePinia(pinia)

	app.use(pinia)

	return {
		app,
		Pinia
	}
}
