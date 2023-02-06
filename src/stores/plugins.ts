import { App } from 'vue';
import { createPinia } from 'pinia';
import { createPersistedState } from 'pinia-plugin-persistedstate';
import devalue from '@nuxt/devalue';
import globalGl from '@/config/global';

import {
  setLocalStorage,
  getLocalStorage,
  encryptDes,
  decryptDes,
} from '@/common';

export const pinia = createPinia();

export const painaInstall = (app: App) => {
  pinia
    .use(
      createPersistedState({
        storage: {
          getItem(key: string): string | null {
            if (globalGl.env === 'prod') {
              return decryptDes(getLocalStorage(key));
            } else {
              return getLocalStorage(key);
            }
          },

          setItem(key: string, value: string) {
            if (globalGl.env === 'prod') {
              setLocalStorage({
                [key]: encryptDes(value),
              });
            } else {
              setLocalStorage({
                [key]: value,
              });
            }
          },
        },
      })
    )
    .use(({ options, store }) => {
      // console.log({
      // 	options,
      // 	store
      // })
    });

  app.use(pinia);

  devalue(pinia.state.value);
};
