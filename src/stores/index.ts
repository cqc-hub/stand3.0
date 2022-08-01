import { Pinia } from 'pinia'

import useUserStore from './user'

export default (pinia: Pinia) => {
	// pinia.use(piniaPersist)
	useUserStore(pinia)

	return pinia
}
