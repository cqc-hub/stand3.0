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
      content:
        '为保护您的数据安全，您需要授权后才能使用健康档案、当日报告等功能。现在就去授权并使用完整功能吧~~',
      confirmText: '去授权',
    });

    if (!confirm) {
      throw new Error('1001082-人脸认证拦截-拒绝授权');
    }

    const programOpt = {
      appId,
      path: joinQuery('/pages/appScene', {
        app_scene,
        apply_id: authInfo.value.applyId,
        // action_type: 'faceAuth',
      }),
      envVersion: 'release',
    } as const;

    console.log(JSON.stringify(programOpt));

    await new Promise((success, j) => {
      uni.navigateToMiniProgram({
        ...programOpt,
        fail({ errMsg }) {
          j('取消请求授权...');
        },
        success: j,
      });
    });
  };

  const intercept1001082 = async (
    opt: {
      init?: (...args: any[]) => any;
      throwErr?: boolean;
    } = {}
  ) => {
    const { init = () => {}, throwErr } = opt;
    cb = init;
    await applyForAuth();

    if (authInfo.value.applyStatus !== '已授权') {
      await goAuth();
    }
    cb();

    if (throwErr) {
      throw new Error('1001082-人脸认证拦截');
    }
  };

  return {
    applyForAuth,
    intercept1001082,
  };
};

exports.useFaceVerify1001082 = useFaceVerify1001082;
