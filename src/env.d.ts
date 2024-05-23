/// <reference types="vite/client" />

import { ComponentCustomProperties } from 'vue';
import global from './config/global';

declare module '@vue/runtime-core' {
	interface ComponentCustomProperties {
		$global: typeof global;
		$HTMLParser: (any) => any;
	}
}

declare module '@vue/runtime-dom' {
	interface ButtonHTMLAttributes {
		_type?: 'primary';
	}
}
