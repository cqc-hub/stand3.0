import { joinQuery } from '@/common';
import api from '@/service/api';
import { apiAsync, GStores } from '@/utils';
import { ref } from 'vue';

export const useFaceVerify1001082 = () => {
  const gStores = new GStores();
  const appId = 'wxcb3a8be439f06ad2';
  const app_scene = 'wjw-jkwz';
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
    console.log(
      JSON.stringify({
        appId,
        path: joinQuery('/pages/appScene', {
          app_scene,
          uuid: authInfo.value.applyId,
          action_type: 'faceAuth',
        }),
        envVersion: 'release',
      })
    );

    await new Promise((success, j) => {
      uni.navigateToMiniProgram({
        appId,
        path: joinQuery('/pages/appScene', {
          app_scene,
          uuid: authInfo.value.applyId,
          action_type: 'faceAuth',
        }),
        envVersion: 'release',
        fail({ errMsg }) {
          j('取消请求授权...');
        },
        success,
      });
    });
  };

  const intercept1001082 = async (init: (...args: any[]) => any = () => {}) => {
    cb = init;
    await applyForAuth();

    if (authInfo.value.applyStatus !== '已授权') {
      await goAuth();
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
