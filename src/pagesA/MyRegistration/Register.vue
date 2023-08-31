<template>
  <view class="page">
    <g-flag
      v-if="dirUrl.includes('/pagesA/MyRegistration/selDepartment')"
      isShowFg
      typeFg="84"
    />
    <view v-if="_type == 3" class="search-input">
      <uni-search-input
        v-model:value="searchValue"
        placeholder="请输入药店名称查询"
        @change="changeInput"
        @confirm="confirmInput"
        @clear="clearInput"
      />
    </view>
    <view
      v-if="_type != 3 && hosList.length > showMoreItem"
      class="flex-normal header"
    >
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
        :disabledKey="listDisableName"
        :isShowMoreItem="_type == 3 ? false : hosList.length <= showMoreItem"
        :list="__hosList"
        :login="isNeedsLogin"
        @img-click="imgClick"
        @location-click="locationClick"
        @item-click="itemClick"
        @intro-click="introClick"
      />
      <view v-if="hosList.length == 0" class="empty-box">
        <g-empty :current="1" />
      </view>
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

    <Order-Reg-Confirm
      :title="'医院介绍'"
      height="80vh"
      ref="regDialogConfirm"
      isHideFooter
    >
      <view class="color-444 f32 g-break-word mb40">{{ hosIntro }}</view>
    </Order-Reg-Confirm>
    <g-message isWxAuthInit />
  </view>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import { onLoad } from '@dcloudio/uni-app';

  import {
    ServerStaticData,
    IHosInfo,
    openLocation,
    GStores,
    ISystemConfig,
  } from '@/utils';
  import { joinQuery, deQueryForUrl } from '@/common';

  import hosListVue from './components/hosList/hosList.vue';
  import OrderRegConfirm from '@/components/orderRegConfirm/orderRegConfirm.vue';

  const _props = defineProps<{
    _url: string;
    _type: number; //区分跳转h5的页面 1：医院指南 2：核酸开单 3:药店指南（只展示药店 搜索框 不展示距离）
    _questionId: number; //问卷id
    _isPay: number;

    isLogin?: '1'; // 需要登录?
  }>();

  const props = ref(deQueryForUrl(deQueryForUrl(_props)));

  const dirUrl = ref(decodeURIComponent(props.value._url));
  // const listDisableName = ref('ifClick');
  const hosIntro = ref('');

  const getTypeNow = computed(() => {
    if (dirUrl.value.includes('/pagesA/MyRegistration/selDepartment')) {
      return '预约挂号';
    } else if (dirUrl.value.includes('/pagesC/medRecordApply/recordApply')) {
      return '病案复印';
    }
    if (props.value._type === 2) {
      return '核酸开单';
    }

    return '';
  });

  const isNeedsLogin = computed(() => props.value.isLogin === '1');

  // 对应的值 '1' 禁
  const listDisableName = computed(() => {
    const _type = getTypeNow.value;
    if (_type === '预约挂号') {
      return 'ifClick';
    }

    if (_type === '病案复印') {
      return 'ifClick';
    }
    if (_type === '核酸开单') {
      return 'ifClick';
    }

    return '';
  });

  const pagesList = {
    '1': '/pagesC/cloudHospital/myPath?path=pages/hospitalGuide/hospitalGuide', //医院指南多院区
    '2': '/pagesC/selfService/nucleicBilling', //核酸开单多院区
  };
  const gStores = new GStores();

  const searchValue = ref('');
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

  const changeInput = (e) => {
    searchValue.value = e;
  };

  const clearInput = () => {
    getList(false);
  };

  const confirmInput = (str) => {
    if (str.match(/^[ ]*$/)) {
      gStores.messageStore.showMessage('搜索内容不能为空', 1500);
    } else {
      getList(false);
    }
  };

  const itemClick = (item: IHosInfo) => {
    //药店不可点击
    if (item.hosLevel == 9) {
      return;
    }

    if (isMedCopy.value) {
      const _idx = medCopyConfigList.value.findIndex(
        (o) => o.hosId === item.hosId
      );

      if (_idx === -1) {
        gStores.messageStore.showMessage('该院区暂未开通病案复印功能', 3000);
        return;
      }
    }

    if (props.value._type && props.value._type != 3) {
      //院区跳转问卷页面
      if (props.value._questionId) {
        //跳转问卷页面-h5
        uni.navigateTo({
          url: joinQuery(
            '/pagesC/cloudHospital/myPath?path=/pagesC/question/normalQuestion',
            {
              category: props.value._questionId,
              url: props.value._url,
              hosId: item.hosId,
            }
          ),
        });
      } else {
        uni.navigateTo({
          url: joinQuery(pagesList[props.value._type], {
            hosId: item.hosId,
            isPay: props.value._isPay,
          }),
        });
      }
    } else {
      const url = decodeURIComponent(props.value._url);
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
      gStores.messageStore.showMessage('暂不支持导航(无该医院位置信息)', 3000);
    }
  };

  const hosSortChange = ({ item }) => {
    if (item === '按距离排序') {
      if (!isAuthLocation.value) {
        gStores.messageStore.showMessage(
          '未授权位置信息， 不支持按距离排序',
          3000,
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
    // 类型-1预约挂号 2-病案复印 3-核酸开单
    let type = '3';
    switch (getTypeNow.value) {
      case '病案复印':
        type = '2';
        break;

      case '预约挂号':
        type = '1';
        break;

      default:
        type = '3';
        break;
    }

    if (getTypeNow.value === '病案复印') {
      isMedCopy.value = true;
      medCopyConfigList.value = await ServerStaticData.getSystemConfig(
        'medRecord'
      );
    }

    if (isRequestApi) {
      await new Promise((resolve, reject) => {
        uni.getLocation({
          async success(e) {
            const { longitude, latitude } = e;
            const hList = await ServerStaticData.getHosList(
              {
                gisLng: longitude,
                gisLat: latitude,
                type,
              },
              { noCache: true }
            );

            hosList.value = hList;
            isAuthLocation.value = true;
            resolve(void 0);
          },

          async fail() {
            hosList.value = await ServerStaticData.getHosList();
            resolve(void 0);
          },
        });
      });
    } else {
      hosList.value = await ServerStaticData.getHosList(
        {
          type,
          name: searchValue.value,
          hosType: props.value._type == 3 ? '48' : '',
        },
        { noCache: true }
      );
    }

    if (getTypeNow.value === '病案复印') {
      const hosIds = medCopyConfigList.value.map((o) => o.hosId + '');
      hosList.value.map((o) => {
        o.ifClick = hosIds.includes(o.hosId) ? '0' : '1';
      });
    }
  };

  const regDialogConfirm = ref<any>('');
  const introClick = (item: IHosInfo) => {
    const { intro } = item;
    hosIntro.value = intro;
    regDialogConfirm.value.show();
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

  onLoad(() => {
    if (props.value._type == 3) {
      uni.setNavigationBarTitle({
        title: '药店指南',
      });
      getList(false);
    } else {
      init();
    }
  });
</script>

<style lang="scss" scoped>
  .page {
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;
    background: var(--hr-neutral-color-1);

    .search-input {
      padding: 16rpx 32rpx;
      background: #fff;
    }

    .scroll-container {
      flex: 1;
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
  .empty-box {
    padding-top: 300rpx;
  }
</style>
