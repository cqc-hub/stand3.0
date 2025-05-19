<template>
  <!-- [gStores.globalStore.getPageClass]: true, -->
  <view
    :class="{
      [gStores.globalStore.getPageClass]: true,
    }"
    class="g-page"
  >
    <!-- #ifndef MP-ALIPAY -->
    <g-tbanner
      :config="orderConfig.bannerOrder"
      @click="handleDzClick(orderConfig.bannerOrder)"
      disabled
    />
    <!-- #endif -->

    <!-- #ifdef MP-ALIPAY -->
    <g-tbanner
      :config="orderConfig.bannerOrderAlipay || orderConfig.bannerOrder"
      @click="
        handleDzClick(orderConfig.bannerOrderAlipay || orderConfig.bannerOrder)
      "
      disabled
    />
    <!-- #endif -->

    <g-selhos
      v-model:hosId="hosId"
      :unNeedPosition="unNeedPosition"
      @get-list="getHosList"
      @change="getDepList"
      type="selDepartment"
    />
    <view class="search-input" @click.prevent="goSearch">
      <view class="my-disabled">
        <uni-search-input placeholder="请输入医生/科室/症状" />
      </view>
    </view>

    <view class="g-container hidden-scrollbar" scroll-y>
      <Department-List
        v-if="depList.length"
        :list="depList"
        :level="depLevel"
        :active-lv1="deptStore.activeLv1"
        :active-lv2="deptStore.activeLv2"
        :active-lv3="deptStore.activeLv3"
        @item-click-lv1="itemClickLv1"
        @item-click-lv2="itemClickLv2"
        @item-click-lv3="itemClickLv3"
      />
      <view v-if="!depList.length && isComplete" class="empty-list">
        <g-empty :current="1" />
      </view>
    </view>
    <g-message />
  </view>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { onShareAppMessage, onLoad } from '@dcloudio/uni-app';
  import { deepClone } from '@/common/utils';

  import {
    GStores,
    ServerStaticData,
    IHosInfo,
    generateUuid,
    useTBanner,
    type ISystemConfig,
    wait,
  } from '@/utils';
  import {
    joinQuery,
    joinQueryForUrl,
    setLocalStorage,
    deQueryForUrl,
  } from '@/common';
  import {
    IDeptLv1,
    IDeptLv2,
    IDeptLv3,
    isLev1,
    isLev2,
    loopDeptList,
    useCacheStore,
    useDeptStore,
  } from '@/stores';

  import api from '@/service/api';
  import HTMLParser from '@/common/html-parser';

  import DepartmentList from './components/departmentList/DepartmentList.vue';
  import globalGl from '@/config/global';
  import { assignType } from '@/typeUtils';

  const props = defineProps<{
    // 不需要温馨提示
    noTipDialog?: '1';
    hosId: string;
    clinicalType: string; // 1、普通预约 2-膏方预约 3-名医在线夜门诊 4-云诊室 5-自助便民门诊（省人民凤凰HIS）6-专病门诊 7-成人 8-儿童 9-弹性门诊 10-军属门诊 11-军人门诊
    thRegisterId?: string;
  }>();
  const pageProps = ref(<typeof props>{});
  const orderConfig = ref({} as ISystemConfig['order']);

  const depList = ref<IDeptLv1[]>([]);
  const depLevel = ref('1');
  const gStores = new GStores();
  const deptStore = useDeptStore();
  const cacheStore = useCacheStore();
  const hosList = ref<IHosInfo[]>([]);
  const hosId = ref(props.hosId);
  const isComplete = ref(false);
  const unNeedPosition = ref(true);
  const celebratedDeptData = ref<Array<string>>([]);
  let deptStep: any[] = [];

  const init = async () => {
    const data = await ServerStaticData.getSystemConfig('order');
    let { deptDialogBtnCannel } = data;

    if (globalGl.SYS_CODE === '1001052' && pageProps.value.hosId === '13118') {
      deptDialogBtnCannel = undefined;
    }

    orderConfig.value = data;
    if (hosId.value) {
      await getDepList();
    }

    if (props.noTipDialog !== '1') {
      await wait(500);
      const { title, content } = await gStores.getSysAppMore('8');

      const cancelText = deptDialogBtnCannel?.label;
      const confirmText = cancelText ? '继续预约' : '确定';
      gStores.messageStore.showMessage(content, 0, {
        useDialog: true,
        dialogOpt: {
          title,
          isShowCancel: !!deptDialogBtnCannel,
          cancelText,
          confirmText,
          cancelColor: 'var(--hr-brand-color-6)',
          maxHeight: 900,
        },
        closeCallBack({ confirm, maskClose }) {
          if (!confirm && !maskClose) {
            const { key } = deptDialogBtnCannel! as any;
            if (key === '0') {
              uni.navigateTo({
                url: joinQueryForUrl(
                  '/pagesC/hospitalAccount/hospitalAccount',
                  {
                    hosId: hosId.value,
                    type: 'fromSelDepartment',
                  }
                ),
              });
            } else {
              useTBanner(deptDialogBtnCannel as any);
            }
          }
        },
      });
      if (orderConfig.value?.isCelebratedDeptMode) {
        const {
          result: { CELEBRATED_DEPT: jsonStr },
        } = await api.getParamsMoreBySysCode({
          paramCode: 'CELEBRATED_DEPT',
        });
        try {
          jsonStr &&
            (celebratedDeptData.value = JSON.parse(jsonStr)[hosId.value]);
        } catch (e) {
          console.error('CELEBRATED_DEPT', e);
        }
      }
    }

    // 处理 智能导诊逻辑 当path为 zndz 时 根据接口获取path
    if (data.bannerOrder?.path == 'zndz') {
      const { result } = await api.getTXGuidanceUrl({
        source: gStores.globalStore.browser.source,
      });
      data.bannerOrder.path = (result as any).url;
    }
  };

  const getHosList = async ({ list }) => {
    hosList.value = list;

    if (!hosId.value) {
      hosId.value = list[0]!.hosId;
    }
    init();
  };

  const _loopDeptList = (list: any[]) => {
    list.map((o) => {
      const { children } = o;

      if (children && children.length) {
        _loopDeptList(children);
      }

      o.uuid = generateUuid();
    });
  };

  const getDepList = async () => {
    const source = gStores.globalStore.browser.source;

    const requestArg = {
      source,
      hosId: hosId.value === '全院区' ? '' : hosId.value,
      clinicalType: props.clinicalType,
      // resType   // 预约类型：1.预约挂号，2.当日挂号
    };

    isComplete.value = false;
    const { result } = await api.getDeptList(requestArg).finally(() => {
      isComplete.value = true;
    });

    if (result) {
      let { firstDeptList, deptListLevel } = result;
      // deptListLevel = '1'
      if (firstDeptList && firstDeptList.length) {
        loopDeptList(firstDeptList, deptListLevel);
        _loopDeptList(firstDeptList);
        depList.value = firstDeptList;
        depLevel.value = deptListLevel;
      } else {
        depList.value = [];
      }
    }
  };

  const itemClickLv1 = (item: IDeptLv1) => {
    deptStore.changeActiveLv1(item);
    deptStep = [item];
    if (!item.children) {
      registerContinue(item);
    }
  };

  const itemClickLv2 = (item: IDeptLv2) => {
    deptStore.changeActiveLv2(item);
    deptStep = [...deptStep.slice(0, 1), item];
    if (!item.children) {
      registerContinue(item);
    }
  };

  const itemClickLv3 = (item: IDeptLv3) => {
    deptStore.changeActiveLv3(item);
    deptStep = [...deptStep.slice(0, 2), item];

    registerContinue(item);
  };

  const registerContinue = async (item: IDeptLv3 | IDeptLv2 | IDeptLv1) => {
    const { isConfirmOrderWithDeptTip } = orderConfig.value;
    if (item.promptMessage && isConfirmOrderWithDeptTip !== '1') {
      await new Promise((closeCallBack: any) => {
        gStores.messageStore.showMessage(item.promptMessage, 0, {
          closeCallBack,
          useDialog: true,
          dialogOpt: {
            title: '温馨提示',
          },
        });
      });
    }

    deptStore.$patch({
      deptClickStep: deptStep.map((o) => ({
        deptId: o.hosDeptId,
        deptName: o.deptName,
      })),
    });

    const queryArg = {
      hosId: item.hosId || (hosId.value === '全院区' ? '' : hosId.value),
      clinicalType: props.clinicalType,
      thRegisterId: props.thRegisterId,
      deptName: encodeURIComponent(item.deptName),
      hosDeptId: '',
      promptMessage: '',
      firstHosDeptId: encodeURIComponent(deptStore.activeLv1.firstHosDeptId),
      secondHosDeptId: '',
      isExpertDeptId: deptStore.activeLv1.isExpertDeptId
        ? deptStore.activeLv1.isExpertDeptId
        : '0',
    };

    if (isLev1(item)) {
      queryArg.firstHosDeptId = encodeURIComponent(item.firstHosDeptId);
      queryArg.isExpertDeptId = '1';
    } else if (isLev2(item)) {
      queryArg.secondHosDeptId = encodeURIComponent(item.secondHosDeptId);
    } else {
      queryArg.secondHosDeptId = encodeURIComponent(
        deptStore.activeLv2.secondHosDeptId
      );
      queryArg.hosDeptId = encodeURIComponent(item.hosDeptId);
    }

    queryArg.promptMessage = encodeURIComponent(item.promptMessage || '');
    if (celebratedDeptData.value.includes(item.hosDeptId)) {
      const query = {
        hosId: item.hosId || (hosId.value === '全院区' ? '' : hosId.value),
        hosDeptId: encodeURIComponent(item.hosDeptId),
        deptName: encodeURIComponent(item.deptName),
      };
      uni.navigateTo({
        url: joinQuery('/pagesA/MyRegistration/DepartmentCardDetail', query),
      });
    } else {
      uni.navigateTo({
        url: joinQuery('/pagesA/MyRegistration/order', queryArg),
      });
    }
  };

  const handleDzClick = async (data) => {
    const queryArg = deepClone(data);
    queryArg.path = joinQuery(data.path, { hosId: hosId.value });
    useTBanner(queryArg);
  };

  onShareAppMessage((res) => {
    return {
      title: `选择科室`,
      path: joinQuery('/pagesA/MyRegistration/selDepartment', pageProps.value),
    };
  });

  onLoad(async (opt = {}) => {
    pageProps.value = deQueryForUrl(deQueryForUrl(opt));
    deptStore.changeActiveLv1({} as any);
    deptStore.changeActiveLv2({} as any);
    deptStore.changeActiveLv3({} as any);
    pageProps.value.hosId && cacheStore.changeHosId(pageProps.value.hosId);
    const thRegisterId = props.thRegisterId;
    thRegisterId &&
      setLocalStorage({
        thRegisterId,
      });

    const pages = getCurrentPages();
    if (pages && pages.length > 1) {
      const prevRoute = pages[pages.length - 2];
      // 判断是否 单/多 院区， 单院区不需要调定位
      if (prevRoute.route === 'pagesA/MyRegistration/Register') {
        unNeedPosition.value = false;
      }
    }
  });

  const goSearch = () => {
    uni.navigateTo({
      url: joinQuery('/pagesA/MyRegistration/RegSearch', {
        clinicalType: props.clinicalType,
        hosId: hosId.value,
      }),
    });
  };
</script>

<style lang="scss" scoped>
  .g-page {
    background-color: #fff;
  }

  .search-input {
    margin: 16rpx 32rpx;
  }
</style>
