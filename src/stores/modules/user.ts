import { defineStore } from 'pinia';

const userStore = defineStore('user', {
	persist: {
		key: '_user',
		paths: ['age']
	},

	state: () => {
		return {
			name: '张三',
			age: 20,
			sex: '',
			avatar: ''
		};
	},

	actions: {
		updateName(name: string) {
			this.name = name;
		},

		updateAge(age: number) {
			this.age = age;
		}
	},

	getters: {
		double(): number {
			return this.age * 2;
		},

		getAvatar(): string {
			return '';
		}
	}
});

export const useUserStore = function () {
	return userStore();
};
