<template>
  <view class="page">
    <!--   -->
    <view v-if="hosList.length > showMoreItem" class="flex-normal header">
      <view
        :class="{
          'sel-active': isShowHosSort,
        }"
        @click="isShowHosSort = !isShowHosSort"
        class="flex-normal"
      >
        <view>{{ hosSortNow }}</view>
        <view class="iconfont">&#xe6e8;</view>
      </view>

      <view
        :class="{
          'sel-active': isShowFilterHos,
        }"
        @click="isShowFilterHos = !isShowFilterHos"
        class="flex-normal"
      >
        <view>筛选</view>
        <view class="iconfont">&#xe6e8;</view>
      </view>
    </view>
    <scroll-view class="scroll-container" scroll-y>
      <hos-List-Vue
        :list="__hosList"
        :isShowMoreItem="hosList.length <= showMoreItem"
        @img-click="imgClick"
        @location-click="locationClick"
        @item-click="itemClick"
      />
    </scroll-view>

    <xy-dialog
      title=""
      content="检测到未授权位置信息， 请确认授权"
      cancelText="取消"
      :show="isWxRequestQxDialogShow"
      @cancelButton="getList(false)"
    >
      <template #confirmBtn>
        <view @click="requestWxQx">去授权</view>
      </template>
    </xy-dialog>

    <g-select
      v-model:value="hosLvNow"
      v-model:show="isShowFilterHos"
      :option="hosLvs"
      :field="{
        label: 'label',
        value: 'value',
      }"
      title="筛选医院"
      type="top"
    >
      <template #header>
        <view class="flex-normal header">
          <view
            :class="{
              'sel-active': isShowHosSort,
            }"
            @click="isShowHosSort = !isShowHosSort"
            class="flex-normal"
          >
            <view>{{ hosSortNow }}</view>
            <view class="iconfont">&#xe6e8;</view>
          </view>

          <view
            :class="{
              'sel-active': isShowFilterHos,
            }"
            @click="isShowFilterHos = !isShowFilterHos"
            class="flex-normal"
          >
            <view>筛选</view>
            <view class="iconfont">&#xe6e8;</view>
          </view>
        </view>
      </template>
    </g-select>

    <g-select
      v-model:value="hosSortNow"
      v-model:show="isShowHosSort"
      :option="hosSortOpt"
      @change="hosSortChange"
      type="top"
      title="医院排序"
    >
      <template #header>
        <view class="flex-normal header">
          <view
            :class="{
              'sel-active': isShowHosSort,
            }"
            @click="isShowHosSort = !isShowHosSort"
            class="flex-normal"
          >
            <view>{{ hosSortNow }}</view>
            <view class="iconfont">&#xe6e8;</view>
          </view>

          <view
            :class="{
              'sel-active': isShowFilterHos,
            }"
            @click="isShowFilterHos = !isShowFilterHos"
            class="flex-normal"
          >
            <view>筛选</view>
            <view class="iconfont">&#xe6e8;</view>
          </view>
        </view>
      </template>
    </g-select>
    <g-message />
  </view>
</template>

<script lang="ts" setup>
  import { computed, ref, onMounted } from 'vue';
  import {
    ServerStaticData,
    IHosInfo,
    openLocation,
    GStores,
    ISystemConfig,
  } from '@/utils';
  import { joinQuery } from '@/common';

  import hosListVue from './components/hosList/hosList.vue';

  import api from '@/service/api';

  const props = defineProps<{
    _url: string;
    _type: number; //区分my-h5跳转 1:医院指南跳转
  }>();
  const gStores = new GStores();

  const isShowFilterHos = ref(false);
  const hosList = ref<IHosInfo[]>([]);
  const hosLvs = computed(() => {
    const lvs = [...new Set(hosList.value.map((o) => o.hosLevelName))].map(
      (o) => ({
        label: o,
        value: o,
      })
    );

    lvs.unshift({
      label: '全部',
      value: '',
    });
    return lvs;
  });
  const _hosList = computed(() => {
    if (!hosLvNow.value) {
      return hosList.value;
    } else {
      return hosList.value.filter((o) => o.hosLevelName === hosLvNow.value);
    }
  });
  const __hosList = computed(() => {
    if (hosSortNow.value === '综合排序') {
      return _hosList.value;
    } else {
      return [..._hosList.value].sort((_prev, _next) => {
        if (_prev.distance) {
          return _prev.distance - _next.distance!;
        } else {
          return 0;
        }
      });
    }
  });
  const hosLvNow = ref('');

  const hosSortOpt = ref(['综合排序', '按距离排序']);
  const hosSortNow = ref('综合排序');
  const isShowHosSort = ref(false);

  const isWxRequestQxDialogShow = ref(false);
  const showMoreItem = ref(5);
  const isAuthLocation = ref(false);

  const isMedCopy = ref(false);
  const medCopyConfigList = ref<ISystemConfig['medRecord']>([]);

  const itemClick = (item: IHosInfo) => {
    if (isMedCopy.value) {
      const _idx = medCopyConfigList.value.findIndex(
        (o) => o.hosId === item.hosId
      );

      if (_idx === -1) {
        gStores.messageStore.showMessage('该院区暂未开通病案复印功能', 1500);
        return;
      }
    }
    const url = decodeURIComponent(props._url);
    if (props._type == 1) {
      //医院指南
      uni.navigateTo({
        url: joinQuery(
          '/pagesC/cloudHospital/myPath?path=pages/hospitalGuide/hospitalGuide',
          {
            hosId: item.hosId,
          }
        ),
      });
    } else {
      //小程序内部跳转
      uni.navigateTo({
        url: joinQuery(url, {
          hosId: item.hosId,
        }),
      });
    }
  };

  const locationClick = (item: IHosInfo) => {
    const { gisLat, gisLng, hosName, address } = item;

    if (gisLat) {
      openLocation([gisLat!, gisLng!], {
        name: hosName,
        address,
      });
    } else {
      gStores.messageStore.showMessage('暂不支持导航(无该医院位置信息)', 1500);
    }
  };

  const hosSortChange = ({ item }) => {
    if (item === '按距离排序') {
      if (!isAuthLocation.value) {
        gStores.messageStore.showMessage(
          '未授权位置信息， 不支持按距离排序',
          1500,
          {
            closeCallBack() {
              hosSortNow.value = '综合排序';
            },
          }
        );
      }
    }
  };

  const imgClick = (item: IHosInfo) => {};

  const getList = async (isRequestApi: boolean = true) => {
    isWxRequestQxDialogShow.value = false;
    const url = decodeURIComponent(props._url);
    if (url.includes('/pagesC/medRecordApply/recordApply')) {
      isMedCopy.value = true;
      medCopyConfigList.value = await ServerStaticData.getSystemConfig(
        'medRecord'
      );
    }

    if (isRequestApi) {
      uni.getLocation({
        async success(e) {
          const { longitude, latitude } = e;
          const hList = await ServerStaticData.getHosList(
            {
              gisLng: longitude,
              gisLat: latitude,
            },
            { noCache: true }
          );

          hosList.value = hList;
          isAuthLocation.value = true;
        },

        async fail() {
          hosList.value = await ServerStaticData.getHosList();
        },
      });
    } else {
      hosList.value = await ServerStaticData.getHosList();
    }
  };

  const requestWxQx = async () => {
    // #ifdef  MP-WEIXIN
    await new Promise((resolve) => {
      uni.openSetting({
        complete: resolve,
      });
    });
    // #endif

    getList();
  };

  const init = async () => {
    let isAuth = false;
    await new Promise((resolve) =>
      uni.getLocation({
        complete: resolve,
        success() {
          isAuth = true;
        },
      })
    );

    // #ifdef  MP-WEIXIN
    await new Promise((resolve, reject) => {
      uni.getSetting({
        async success({ authSetting }) {
          const qx = authSetting['scope.userLocation'];
          if (!qx) {
            setTimeout(() => {
              isWxRequestQxDialogShow.value = true;
            }, 500);
            reject('未授权 Location');
          } else {
            resolve(void 0);
          }
        },
      });
    });
    // #endif

    getList(isAuth);
  };

  init();
</script>

<style lang="scss" scoped>
  .page {
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;
    background: var(--hr-neutral-color-1);

    .scroll-container {
      flex: 1;
      height: 1px;
      padding: 0 32rpx;
      padding-top: 16rpx;
      width: calc(100% - 64rpx);
    }

    .header {
      background-color: #fff;
      > view {
        flex: 1;
        justify-content: center;
        padding: 24rpx 0;
      }

      .sel-active {
        font-weight: 600;
        color: var(--hr-brand-color-6);
        .iconfont {
          transform: rotate(0.5turn);
        }
      }
    }
  }
</style>
