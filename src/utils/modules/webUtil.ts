import { useCacheStore, useUserStore } from '@/stores';

export const handWebMessage = (evt: any = {}) => {
  const { type, patientId } = evt;
  const cacheStore = useCacheStore();

  cacheStore.changeCacheDataWebView(evt);

  if (type === 'choosePat') {
    const userStore = useUserStore();
    const pat = userStore.patList.find((p) => p.patientId === patientId);

    pat && userStore.updatePatChoose(pat);
  }
};
