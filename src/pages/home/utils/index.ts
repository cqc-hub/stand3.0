import { ServerStaticData, apiAsync, useTBanner } from '@/utils';

export const goElectronicMedicalCard = async () => {
  const { isMedicalQrChoose } = await ServerStaticData.getSystemConfig(
    'person'
  );

  let type = 'bySelf';

  if (isMedicalQrChoose === '1') {
    const tip = '扫码类型';
    const { tapIndex } = await apiAsync(
      // @ts-expect-error
      uni.showActionSheet,
      {
        title: tip,
        alertText: tip,
        itemList: ['医保扫码', '自费扫码'],
      }
    );

    if (tapIndex === 0) {
      type = 'byMedical';
    }
  }

  if (type === 'byMedical') {
    // #ifdef MP-WEIXIN
    useTBanner({
      type: 'otherProgram',
      appId: 'wx7ec43a6a6c80544d',
      path: '/pages/nhsa-code/index/index.html?channel=AAGYCx9OVG4gOuJJPPaZmysv',
    });
    // #endif

    // #ifdef MP-ALIPAY
    my.ap.openURL({
      url: 'alipays://platformapi/startapp?appId=77700284&page=pages%2Fmedical%2Findex%3FchInfo%3Dquyuyibaominiapp',
    });
    // #endif
  } else {
    uni.navigateTo({
      url: '/pagesA/medicalCardMan/electronicMedicalCard',
    });
  }
};
