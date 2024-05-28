import api from '@/service/api';
import { IPat } from '@/stores';
import { apiAsync, cacheUtil, useTBanner } from '@/utils';
import { ref, computed } from 'vue';

// 杭口
export const HK_hook = () => {
  return {
    // 杭口—停车领劵
    async patClick(pat: IPat, props) {
      const { patientId } = pat;
      const { hosId } = props;

      const requestArg = {
        patientId,
        hosId,
        type: '14', //当日就诊类型
      };

      await api.getOutpatientHospitalList(requestArg, {
        showMessage: true,
      });
      const { ChoosePatJump: config } = await cacheUtil.getSystemConfig(
        'ChoosePatJump'
      )();

      const { chooseThirdPath } = config;
      const item = chooseThirdPath.find((o) => o.hosId === hosId);

      if (item) {
        useTBanner({
          path: item.path,
          type: 'h5',
        });
      } else {
        console.log('暂未配置相关跳转地址');
      }
    },

    async scanClick(props) {
      const { hosId } = props;
      const { result } = await apiAsync(uni.scanCode, {
        scanType: ['qrCode'],
        // scanType: ['barCode', 'qrCode'],
      });

      if (result && typeof result === 'string') {
        await api.qrCodeQuery({
          codeStr: result.replace(/\<#jn\>/g, ''),
        });

        const { ChoosePatJump: config } = await cacheUtil.getSystemConfig(
          'ChoosePatJump'
        )();

        const { chooseThirdPath } = config;
        const item = chooseThirdPath.find((o) => o.hosId === hosId);

        if (item) {
          useTBanner({
            path: item.path,
            type: 'h5',
          });
        } else {
          console.error('暂未配置相关跳转地址');
        }
      }
    },
  };
};
