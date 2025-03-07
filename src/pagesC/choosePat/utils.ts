import api from '@/service/api';
import { IPat } from '@/stores';
import { apiAsync, cacheUtil, useTBanner } from '@/utils';
import { ref, computed } from 'vue';
import { encryptByTripleDES, encryptDes } from '@/common/des';
import { joinQuery, joinQueryForUrl } from '@/common';
import md5s from "js-md5";

// 杭口
export const HK_hook = () => {
  return {
    // 杭口—停车领劵
    async patClick(pat: IPat, props) {
      const { patientId } = pat;
      const { hosId } = props;
      console.log(pat);

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
          hosId,
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

// 宜兴
export const YX_hook = () => {
  const patClick = (pat: IPat) => {
    console.log(pat);

    const uid = `1559088022727692288`;
    const appid = 'yxgj001';
    const timestamp = Date.parse(new Date() as any) / 1000 - 95;
    const appkey = `2c836cc79f22d391ff19bb12a5c50cd8`;
    const signaturePart = `uid=${uid}&appid=${appid}&appkey=${appkey}&timestamp=${timestamp}`;
    // @ts-expect-error
    const signature = md5s(signaturePart);

    // console.log(encryptDes('data', 'eWorldTomTaw#7=*', 'TomTaw#7'))
    console.log(encryptByTripleDES('233', 'eWorldTomTaw#7=*', 'TomTaw#7'))
    console.log(encryptByTripleDES('233', 'eWorldTomTaw#7=*', 'TomTaw#7'))
    console.log(encryptByTripleDES('233', 'eWorldTomTaw#7=*', 'TomTaw#7'))


    // return
    const data = `{"med_rec_no":"${pat.cardNumber}","system_id":"1559108114005889024"}`;
    const enCodeData = encodeURIComponent(
      encryptByTripleDES(data, 'eWorldTomTaw#7=*', 'TomTaw#7')
    );

    console.log(enCodeData);
    useTBanner({
      type: 'h5',
      path: joinQuery('https://pacs.yxph.com/ewcss-mobile/mobile/index', {
        uid,
        appid,
        timestamp,
        signature,
        data: enCodeData,
        callbackenv: 'miniapp',
      }) as any,
    });
  };

  return {
    patClick,
  };
};
