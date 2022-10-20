<template>
  <view class="g-page">
    <g-flag typeFg="503" isShowFg />

    <view class="g-container">
      <view class="container-box g-border mb16">
        <Address-Box :addressList="addressList" />
      </view>

      <view class="container-box g-border mb16 box-padding">
        <view class="g-bold f36">请上传本人身份证</view>

        <view class="mt24 flex-normal">
          <view
            @click="chooseIdCardFront"
            class="up-idcard g-border g-flex-rc-cc"
          >
            <view
              v-if="idCardImg.front"
              @click.stop="idCardImg.front = ''"
              class="iconfont delete-icon"
            >
              &#xe6fa;
            </view>
            <image v-if="idCardImg.front" :src="dealImg(idCardImg.front)" />
            <view v-else class="g-flex-rc-cc flex-column f24">
              <view class="iconfont camera-icon">&#xe6be;</view>
              <view>身份证人像页</view>
            </view>
          </view>

          <view
            @click="chooseIdCardBack"
            class="up-idcard g-border g-flex-rc-cc"
          >
            <view
              v-if="idCardImg.back"
              @click.stop="idCardImg.back = ''"
              class="iconfont delete-icon"
            >
              &#xe6fa;
            </view>
            <image v-if="idCardImg.back" :src="dealImg(idCardImg.back)" />

            <view v-else class="g-flex-rc-cc flex-column f24">
              <view class="iconfont camera-icon">&#xe6be;</view>
              <view>身份证国徽页</view>
            </view>
          </view>
        </view>
      </view>

      <view class="container-box g-border mb16 box-padding">
        <view class="g-bold f36">住院记录</view>

        <view class="flex-normal patient-info color-light-dark f28">
          <text class="patient-name g-border-right">
            {{ getUserShowLabel(gStores.userStore.patChoose) }}
          </text>

          <text>{{ getGetHosName }}</text>
        </view>

        <view @click="addRecord" class="add-btn color-blue g-flex-rc-cc">
          <view class="iconfont add-icon">&#xe6fb;</view>
          <view class="f28 g-bold">手动添加记录</view>
        </view>
      </view>

      <view class="container-box g-border mb16 box-padding">
        <view class="f36">
          <text class="mr12 g-bold">请选择复印目的</text>
          <text class="f28 color-light-dark">(多选)</text>
        </view>
      </view>

      <view class="container-box g-border mb16">
        <g-flag typeFg="32" isShowFgTip />
      </view>
    </view>

    <view class="g-footer g-border-top">
      <button class="btn g-border btn-primary dialog-btn">我知道了</button>
    </view>

    <!-- #ifdef MP-ALIPAY -->
    <canvas
      v-show="false"
      :width="imgCanvas.imgWidth"
      :height="imgCanvas.imgHeight"
      style="opacity: 0; position: absolute; pointer-events: none"
      id="canvasForBase64"
    />
    <!-- #endif -->

    <Add-Record-Dialog
      v-model:value="addDialogValue"
      @submit="recordSubmit"
      ref="refAddDialog"
    />

    <view class="g-border-bottom my-display-none">
      <g-selhos :hosId="hosId" @get-list="getHosList" />
    </view>

    <g-message />
  </view>
</template>

<script lang="ts" setup>
  import { computed, ref, reactive } from 'vue';
  import AddressBox from './components/medRecordDetailsAddressBox.vue';
  import AddRecordDialog from './components/medRecordDetailsAddRecordDialog.vue';
  import { chooseImg, GStores, IHosInfo } from '@/utils';
  import { onShow } from '@dcloudio/uni-app';
  import { getUserShowLabel } from '@/stores';
  import api from '@/service/api';

  const props = defineProps<{
    hosId: string;
  }>();
  const gStores = new GStores();
  const refAddDialog = ref<any>('');
  const addDialogValue = ref<BaseObject>({});
  const addressList = ref<any>([]);
  const hosList = ref<IHosInfo[]>([]);

  const imgCanvas = ref({
    imgWidth: 0,
    imgHeight: 0,
  });

  const idCardImg = ref({
    front: '',
    back: '',
  });

  const getGetHosName = computed(() => {
    return (
      hosList.value.find((o) => o.hosId == props.hosId)?.hosName ||
      props.hosId ||
      ''
    );
  });

  const getHosList = ({ list }: { list: IHosInfo[] }) => {
    hosList.value = list;
  };

  const chooseIdCardFront = async () => {
    const res = await chooseImg({ imgCanvas });

    if (res.success) {
      idCardImg.value.front = res.base64;
    }
  };

  const chooseIdCardBack = async () => {
    const res = await chooseImg({ imgCanvas });

    if (res.success) {
      idCardImg.value.back = res.base64;
    }
  };

  const addRecord = () => {
    addDialogValue.value.hosId = props.hosId;
    refAddDialog.value.show();
  };

  const recordSubmit = (data: BaseObject) => {
    console.log(data, 'dialogsubmit');
  };

  const dealImg = (img: string) => {
    if (img.startsWith('http')) {
      return img;
    } else {
      return 'data:image/png;base64,' + img;
    }
  };

  onShow(async () => {
    const { result } = await api.queryExpressAddress({
      herenId: gStores.globalStore.herenId,
    });

    addressList.value = result || [];
  });
</script>

<style lang="scss" scoped>
  .g-container {
    padding: 0 32rpx;

    .container-box {
      border-radius: 8px;
      background-color: #fff;

      &:first-child {
        margin-top: 24rpx;
      }

      .up-idcard {
        flex: 1;
        height: 180rpx;
        border-radius: 8px;

        border-style: dashed;
        position: relative !important;

        &:first-child {
          margin-right: 16rpx;
        }

        .delete-icon {
          font-size: var(--hr-font-size-xxl);
          position: absolute;
          top: 0;
          right: 0;
        }

        .camera-icon {
          font-size: 60rpx;
          line-height: 55rpx;
        }

        image {
          width: 100%;
          height: 100%;
          border-radius: 8px;
        }
      }

      .patient-info {
        .patient-name {
          padding-right: 12rpx;
          margin-right: 12rpx;
        }
      }

      .add-btn {
        padding: 14rpx 0;
        margin-top: 16rpx;
        .add-icon {
          font-size: var(--hr-font-size-xl);
          margin-right: 5rpx;
        }
      }
    }
  }

  .box-padding {
    padding: 32rpx;
  }

  .g-footer {
    display: flex;

    .btn {
      flex: 1;
    }
  }
</style>
