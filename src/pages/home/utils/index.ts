import { GStores, ServerStaticData, apiAsync, useTBanner } from '@/utils';

export const _goElectronicMedicalCard = (type: 'bySelf' | 'byMedical') => {
  if (type === 'byMedical') {
    // #ifdef MP-WEIXIN
    useTBanner({
      type: 'otherProgram',
      appId: 'wx81ce904580cc0ff1 ',
      path: '/views/home/index',
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

export const goElectronicMedicalCard = async () => {
  const { isMedicalQrChoose } = await ServerStaticData.getSystemConfig(
    'person'
  );

  let type: 'bySelf' | 'byMedical' = 'bySelf';

  if (isMedicalQrChoose === '1') {
    const gStores = new GStores();

    const { title, content } = await gStores.getSysAppMore('1201');
    const { confirm, maskClose } = await new Promise<any>((closeCallBack) => {
      gStores.messageStore.showMessage(content, 0, {
        useDialog: true,
        dialogOpt: {
          isShowCancel: true,
          title,
          cancelColor: '#333',
          cancelText: '自费扫码',
          confirmColor: '#333',
          confirmText: '医保扫码',
        },
        closeCallBack,
      });
    });

    if (maskClose) {
      return;
    }

    if (confirm) {
      type = 'byMedical';
    }
  }

  _goElectronicMedicalCard(type);
};
