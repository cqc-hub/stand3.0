<template>
  <view class="g-page">
    <view class="g-container">
      <block v-if="isComplete">
        <Complaint-List
          v-if="list.length"
          :list="list"
          @item-click="itemClick"
        />

        <view v-else class="empty-list">
          <g-empty noTransformY />
        </view>
      </block>
    </view>

    <g-message />

    <view class="g-footer">
      <button
        @click="goComplaint"
        class="btn btn-primary btn-plain btn-border flex1"
      >
        <text class="iconfont icon-kefu">&#xe6e2;</text>
        <text>我要反馈</text>
      </button>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { shallowRef, ref } from 'vue';
  import { onShow, onLoad } from '@dcloudio/uni-app';
  import { TListComPlain } from './utils';
  import { deQueryForUrl } from '@/common';
  import {
    GStores,
    useTBanner,
    type ISystemConfig,
    ServerStaticData,
  } from '@/utils';
  import api from '@/service/api';
  import ComplaintList from './components/ComplaintList.vue';

  const _props = ref<{
    selectRecords?: '0' | '1' | '2'; // 需要选择就诊记录---台州?
    tab?: string; //手动添加选择就诊记录页面的tab内容
  }>();
  const gStores = new GStores();
  const isComplete = shallowRef(false);
  const list = ref<TListComPlain>([]);
  const pageConfig = ref(<ISystemConfig['RestOfConfig']>{});

  const goComplaint = async () => {
    if (pageConfig.value.anonymousFeedback === '1') {
      const { confirm } = await new Promise<{ confirm: boolean }>((r) => {
        gStores.messageStore.showMessage('', 0, {
          useDialog: true,
          dialogOpt: {
            title: '请选择反馈方式',
            isMaskClick: false,
            cancelColor: 'var(--hr-brand-color-6)',
            confirmColor: 'var(--hr-brand-color-6)',
            isShowCancel: true,
            cancelFontWeight: 'bold',
            cancelText: '实名反馈',
            confirmText: '匿名反馈',
          },
          closeCallBack: r,
        });
      });
      if (confirm) {
        uni.navigateTo({
          url: '/pagesC/serviceCenter/serviceComplaint?isAnonymous=1',
        });
        return;
      }
    }
    if (_props.value?.selectRecords && _props.value?.selectRecords != '0') {
      uni.navigateTo({
        url: '/pagesC/serviceCenter/serviceComplaint?selectRecords=2',
      });
      // let extraData = {
      //   sysCode: gStores.globalStore.sysCode,
      //   pageType: '2',
      // };
      // _props.value?.tab && (extraData[`tab`] = _props.value.tab);
      // useTBanner(
      //   {
      //     type: 'h5',
      //     isSelfH5: '1',
      //     path: 'pagesC/queryCase/queryCase',
      //     extraData: extraData,
      //     addition: {
      //       herenId: 'herenId',
      //       patientId: 'patientId',
      //     },
      //   },
      //   'navigateTo'
      // );
    } else {
      uni.navigateTo({
        url: '/pagesC/serviceCenter/serviceComplaint',
      });
    }
  };

  const getList = async () => {
    isComplete.value = false;

    const { result } = await api.getComplainsList({}).finally(() => {
      isComplete.value = true;
    });

    list.value = result || [];
  };

  const itemClick = (item: TListComPlain[number]) => {
    useTBanner({
      type: 'h5',
      isSelfH5: '1',
      path: 'pagesC/serviceCenter/serviceChat',
      // isLocal: '1',
      extraData: {
        id: item.id,
      },
      addition: {
        herenId: 'herenId',
      },
    });
  };

  const init = async () => {
    getList();
  };

  onShow(() => {
    init();
  });
  onLoad(async (op) => {
    _props.value = deQueryForUrl(deQueryForUrl(op));
    pageConfig.value = await ServerStaticData.getSystemConfig('RestOfConfig');
  });
</script>

<style lang="scss" scoped>
  .icon-kefu {
    font-size: 56rpx;
    line-height: 32rpx;
    margin-right: 8rpx;
  }
</style>
