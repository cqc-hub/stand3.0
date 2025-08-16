<template>
  <view
    :class="{
      [gStores.globalStore.getPageClass]: true,
    }"
    class="g-page"
  >
    <!-- <view class="icon-font icon-resize color-blue ico_arrow" /> -->
    <g-flag v-if="type === 'HKTCLJ'" typeFg="1203" isShowFg />
    <view class="g-container">
      <view class="flex-normal p32c">
        <view
          v-if="type === 'HKTCLJ'"
          @click="HK_ScanClick(pageProps)"
          class="pat-box color-blue mb16 mt24 flex1 mr24"
        >
          <view class="add-pat-box">
            <view class="add-pat g-flex-rc-cc">
              <view class="iconfont icon-resize color-blue">&#xe714;</view>
              <text>扫码直接领券</text>
            </view>
          </view>
        </view>

        <view @click="goAddPat" class="pat-box color-blue mb16 mt24 flex1">
          <view class="add-pat-box">
            <view class="add-pat g-flex-rc-cc">
              <view class="iconfont icon-resize color-blue">&#xe6ab;</view>
              <text>添加就诊人</text>
            </view>
          </view>
        </view>
      </view>

      <P-List
        v-if="gStores.userStore.patList.length"
        @choose-pat="choosePatHandler"
        :_firstIn="!_firstIn"
      />
      <view class="empty-list" v-else>
        <g-empty :current="1" />
      </view>
    </view>

    <g-message />
  </view>
</template>

<script lang="ts" setup>
  import { ref, computed } from 'vue';
  import { onLoad } from '@dcloudio/uni-app';
  import { GStores, PatientUtils, TButtonConfig, useTBanner } from '@/utils';
  import { IPat } from '@/stores';
  import {
    deQueryForUrl,
    encryptedAes,
    joinQuery,
    joinQueryForUrl,
  } from '@/common';
  import { HK_hook } from './utils';
  import globalGl from '@/config/global';

  import PList from './components/list.vue';
  import api from '@/service/api';

  const pageProps = ref(
    <
      {
        type:
          | 'xx'
          // 省中体检预约
          | 'tjyy1001035'
          // 乐清产科预约
          | 'lqckyy'
          | 'yxzndz'
          // 杭口—停车领劵
          | 'HKTCLJ'
          // 宜兴检查预约
          | 'yxjcyy';

        [key: string]: any;
      }
    >{}
  );

  const gStores = new GStores();
  const patientUtils = new PatientUtils();
  const type = computed(() => pageProps.value.type);
  const _firstIn = ref(true);

  const { patClick: HK_PatClick, scanClick: HK_ScanClick } = HK_hook();
  const choosePatHandler = ({ item: pat }: { item: IPat; number: number }) => {
    _firstIn.value = false;
    gStores.userStore.updatePatChoose(pat);

    const { type } = pageProps.value;

    switch (type) {
      case 'HKTCLJ':
        HK_PatClick(pat, pageProps.value);
        break;

      case 'yxzndz':
        yxZndz();
        break;

      case 'lqckyy':
        lqCkyy();
        break;

      case 'tjyy1001035':
        tjyy1001035();
        break;

      default:
        break;
    }
  };

  const goAddPat = () => {
    const pages = getCurrentPages();
    const fullPathNow = (pages[pages.length - 1] as any).$page
      .fullPath as string;

    uni.navigateTo({
      url: globalGl.addPersonUrl + '?_url=' + encodeURIComponent(fullPathNow),
    });
  };

  // 宜兴智能导诊
  const yxZndz = () => {
    const {
      cardNumber,
      patientAge: age,
      patientSex: sex,
      patientName,
    } = gStores.userStore.patChoose;

    useTBanner({
      type: 'h5',
      path: joinQuery('https://zlwyl.iflyhealth.com/aiGuide2/xfjk-transfer/', {
        channel: 'yxsrmyy262',
        userid: cardNumber,
        patientName,
        age,
        sex,
      }),
    });
  };

  const lqCkyy = async () => {
    const { patientName } = gStores.userStore.patChoose;

    const { phone } = await patientUtils.getPatientPersonalInfo({
      phone: true,
    });
    useTBanner({
      type: 'h5',
      isSelfH5: '1',
      path: 'pagesC/question/question1001063',
      text: '自助问卷',
      extraData: {
        submitType: '0',
        category: '5201',
        disabled: 1,
        patientName,
        'd-1': patientName,
        'd-3': phone,
      },
      addition: {
        herenId: 'herenId',
        patientId: 'patientId',
      },
      isLocal: '1',
    });
  };

  const tjyy1001035 = async () => {
    const { patientName, cardNumber: patientId } = gStores.userStore.patChoose;

    const { idCard } = await patientUtils.getPatientPersonalInfo({
      idCard: true,
    });

    const d = {
      patientId,
      patientName,
      idCard,
    };

    for (const key in d) {
      let v = encryptedAes(d[key], '5X2ZkYTQ3OGJkY2E');
      // #ifdef MP-ALIPAY
      v = encodeURIComponent(encodeURIComponent(v));
      // #endif
      d[key] = v;
    }

    // https://report.jshtcm.com/pacs/medicallist?areacode=10&patientid=%2FzIpjtscEFIw140%2BZx1w6g==
    const path = joinQueryForUrl(
      'https://report.jshtcm.com/pacs/medicallist',
      d
    );
    useTBanner({
      type: 'h5',
      path,
      // path: joinQueryForUrl('https://appoint.st120.cn', d),
    });
  };

  onLoad(async (opt) => {
    pageProps.value = deQueryForUrl(deQueryForUrl(opt));
  });
</script>

<style lang="scss" scoped>
  .add-pat-box {
    padding: 38rpx 0;
    background-color: var(--h-color-white);
    border-radius: 16rpx;
    font-weight: var(--h-weight-2);
  }

  .icon-resize {
    font-size: 48rpx;
    margin-right: 10rpx;
    font-weight: 500;
  }
</style>
