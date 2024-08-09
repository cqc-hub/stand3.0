import { useUserStore } from '@/stores';

export const handWebMessage = (evt: any = {}) => {
  const { type, patientId } = evt;
  if (type === 'choosePat') {
    const userStore = useUserStore();
    const pat = userStore.patList.find((p) => p.patientId === patientId);
    console.log(pat, '233')

    pat && userStore.updatePatChoose(pat);
  }
};
