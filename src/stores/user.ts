import { defineStore } from 'pinia'

const userStore = defineStore('user', {
	persist: {
		key: 'user',
		paths: ['age', 'name']
	},
	state: () => {
		return {
			name: '张三',
			age: 20
		}
	},

	actions: {
		updateName(name: string) {
			this.name = name
		},

		updateAge(age: number) {
			console.log({
				age
			})

			this.age = age
		}
	},

	getters: {
		double(): number {
			return this.age * 2
		}
	}
})

export const useUserStore = function () {
	return userStore()
}
