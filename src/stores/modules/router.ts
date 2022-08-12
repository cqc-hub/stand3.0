import { defineStore } from 'pinia';

//页面存储token brower等
const routerStore = defineStore('global', {
	persist: {
		key: 'router',
		paths: []
	},

	state: () => {
		return {

		};
	},

	actions: {
	}
});

export const useRouterStore = function () {
	return routerStore();
};
