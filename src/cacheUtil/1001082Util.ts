import api from '@/service/api';
import { apiAsync, GStores } from '@/utils';
import { ref } from 'vue';

export const useFaceVerify1001082 = () => {
  const gStores = new GStores();
  const uuid = ref('wjw-jkwz');
  const authInfo = ref(
    {} as {
      applyId: string;
      applyStatus: string;
    }
  );

  let cb: (...args: any[]) => any = () => {};

  const applyForAuth = async () => {
    const { patientId } = gStores.userStore.patChoose;
    const { result } = await api.applyForAuth({
      patientId,
    });
    authInfo.value = result;

    return result;
  };

  const goAuth = async () => {
    const { confirm } = await apiAsync(uni.showModal, {
      content: '未授权个人信息, 去授权?',
    });

    if (!confirm) {
      throw new Error('1001082-人脸认证拦截-拒绝授权');
    }


  };

  const intercept1001082 = async (init: (...args: any[]) => any = () => {}) => {
    cb = init;
    await applyForAuth();

    if (authInfo.value.applyStatus !== '已授权') {
      goAuth();
    }
    cb();
    throw new Error('1001082-人脸认证拦截');
  };

  return {
    applyForAuth,
    intercept1001082,
  };
};

exports.useFaceVerify1001082 = useFaceVerify1001082;
