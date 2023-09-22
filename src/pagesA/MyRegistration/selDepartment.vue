<template>
  <view
    :class="{
      'system-mode-old': gStores.globalStore.modeOld,
    }"
    class="g-page"
  >
    <!-- #ifndef MP-ALIPAY -->
    <g-tbanner :config="orderConfig.bannerOrder" />
    <!-- #endif -->

    <!-- #ifdef MP-ALIPAY -->
    <g-tbanner
      :config="orderConfig.bannerOrderAlipay || orderConfig.bannerOrder"
    />
    <!-- #endif -->

    <g-selhos
      v-model:hosId="hosId"
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

    <xy-dialog
      v-if="noTipDialog !== '1'"
      @confirmButton="isShowRegTip = false"
      @cancelButton="cancelButtonClick"
      :title="showRegTipTitle"
      :show="isShowRegTip"
      :confirmText="dialogConfirmText"
      :cancelText="dialogCancelText"
      :isShowCancel="isDialogShowCancel"
      cancelColor="#296FFF"
      isMaskClick
    >
      <scroll-view scroll-y class="reg-tip">
        <g-flag
          v-model:title="showRegTipTitle"
          isHideTitle
          isShowFgTip
          typeFg="8"
          aaa
        />
      </scroll-view>
    </xy-dialog>

    <xy-dialog
      title="温馨提示"
      :show="isShowPromptMessageTip"
      :isShowCancel="false"
      @confirmButton="promptMessageTipDialogConfirm"
      isMaskClick
    >
      <scroll-view scroll-y class="reg-tip">
        <view class="g-break-word color-888">
          <rich-text :nodes="showPromptMessageTip" />
        </view>
      </scroll-view>
    </xy-dialog>

    <g-message />
  </view>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { onShareAppMessage, onLoad } from '@dcloudio/uni-app';

  import {
    GStores,
    ServerStaticData,
    IHosInfo,
    generateUuid,
    type ISystemConfig,
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
    useDeptStore,
  } from '@/stores';

  import api from '@/service/api';
  import HTMLParser from '@/common/html-parser';

  import DepartmentList from './components/departmentList/DepartmentList.vue';

  const props = defineProps<{
    // 不需要温馨提示
    noTipDialog?: '1';
    hosId: string;
    clinicalType: string; // 1、普通预约 2-膏方预约 3-名医在线夜门诊 4-云诊室 5-自助便民门诊（省人民凤凰HIS）6-专病门诊 7-成人 8-儿童 9-弹性门诊 10-军属门诊 11-军人门诊
    thRegisterId?: string;
  }>();
  const pageProps = ref(<any>{});
  const isShowRegTip = ref(false);
  const showRegTipTitle = ref('');
  const orderConfig = ref({} as ISystemConfig['order']);

  const depList = ref<IDeptLv1[]>([]);
  const depLevel = ref('1');
  const gStores = new GStores();
  const deptStore = useDeptStore();
  const hosList = ref<IHosInfo[]>([]);
  const hosId = ref(props.hosId);
  const isComplete = ref(false);
  const dialogConfirmText = ref('确定');
  const dialogCancelText = ref('');
  const isDialogShowCancel = ref(false);

  const cancelButtonClick = () => {
    isShowRegTip.value = false;
    const { deptDialogBtnCannel } = orderConfig.value;

    const { key } = deptDialogBtnCannel!;

    if (key === '0') {
      uni.navigateTo({
        url: joinQueryForUrl('/pagesC/hospitalAccount/hospitalAccount', {
          hosId: hosId.value,
          type: 'fromSelDepartment',
        }),
      });
    }
  };

  const init = async () => {
    const data = await ServerStaticData.getSystemConfig('order');
    const { deptDialogBtnCannel } = data;

    if (props.noTipDialog !== '1') {
      setTimeout(() => {
        isDialogShowCancel.value = !!deptDialogBtnCannel;
        if (deptDialogBtnCannel) {
          dialogConfirmText.value = '继续预约';
          dialogCancelText.value = deptDialogBtnCannel.label;
        }

        isShowRegTip.value = true;
      }, 500);
    }

    orderConfig.value = data;
    if (hosId.value) {
      getDepList();
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
      hosId: hosId.value,
      clinicalType: props.clinicalType,
      // resType   // 预约类型：1.预约挂号，2.当日挂号
    };

    isComplete.value = false;
    const { result } = await api.getDeptList(requestArg).finally(() => {
      isComplete.value = true;
    });

    if (result) {
      let { firstDeptList, deptListLevel } = result;
      // deptListLevel = '2'
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
    if (!item.children) {
      registerContinue(item);
    }
  };

  const itemClickLv2 = (item: IDeptLv2) => {
    deptStore.changeActiveLv2(item);

    if (!item.children) {
      registerContinue(item);
    }
  };

  const itemClickLv3 = (item: IDeptLv3) => {
    deptStore.changeActiveLv3(item);
    registerContinue(item);
  };

  const isShowPromptMessageTip = ref(false);
  const showPromptMessageTip = ref('');
  let promptMessageTipDialogConfirm = (v: unknown) => {};
  const registerContinue = async (item: IDeptLv3 | IDeptLv2 | IDeptLv1) => {
    if (item.promptMessage) {
      isShowPromptMessageTip.value = true;
      showPromptMessageTip.value = HTMLParser(item.promptMessage);
      await new Promise((r) => (promptMessageTipDialogConfirm = r));
      isShowPromptMessageTip.value = false;
    }

    const queryArg = {
      hosId: hosId.value,
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

    uni.navigateTo({
      url: joinQuery('/pagesA/MyRegistration/order', queryArg),
    });
  };

  onShareAppMessage((res) => {
    return {
      title: `选择科室`,
      path: joinQuery('/pagesA/MyRegistration/selDepartment', pageProps.value),
    };
  });

  onLoad((opt = {}) => {
    pageProps.value = deQueryForUrl(deQueryForUrl(opt));
    deptStore.changeActiveLv1({} as any);
    deptStore.changeActiveLv2({} as any);
    deptStore.changeActiveLv3({} as any);
    const thRegisterId = props.thRegisterId;
    thRegisterId &&
      setLocalStorage({
        thRegisterId,
      });
    // init();
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

  .reg-tip {
    max-height: 550rpx;
    width: calc(100% - 64rpx);
    margin-left: 32rpx;
  }

  .search-input {
    margin: 16rpx 32rpx;
  }
</style>
