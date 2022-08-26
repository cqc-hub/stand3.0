import { App } from 'vue'
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'
import devalue from '@nuxt/devalue'

import { setLocalStorage, getLocalStorage } from '@/common'

export const pinia = createPinia()

export const painaInstall = (app: App) => {

  pinia
    .use(
      createPersistedState({
        storage: {
          getItem(key: string): string | null {
            return getLocalStorage(key)
          },

          setItem(key: string, value: string) {
            setLocalStorage({
              [key]: value
            })
          }
        }
      })
    )
    .use(({ options, store }) => {
      // console.log({
      // 	options,
      // 	store
      // })
    })

  app.use(pinia)

  devalue(pinia.state.value)
}
