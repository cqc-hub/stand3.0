import api from '@/service/api';
import { GStores } from '@/utils';

export const useFaceVerify1001082 = () => {
  const gStores = new GStores();

  const applyForAuth = async () => {
    const { patientId } = gStores.userStore.patChoose;
    await api.applyForAuth({
      patientId,
    });
  };

  return {
    applyForAuth,
  };
};


exports.useFaceVerify1001082 = useFaceVerify1001082;
