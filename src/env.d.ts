/// <reference types="vite/client" />

import { ComponentCustomProperties } from 'vue';
import global from './config/global';

declare module '*.vue' {
	import { DefineComponent } from 'vue';
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
	const component: DefineComponent<{}, {}, any>;

	export default component;
}
declare module '@vue/runtime-core' {
	interface ComponentCustomProperties {
		$global: typeof global;
	}
}

declare module '@vue/runtime-dom' {
	interface ButtonHTMLAttributes {
		_type?: 'primary';
	}
}
