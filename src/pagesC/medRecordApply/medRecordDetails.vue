<template>
  <view class="g-page">
    <g-flag typeFg="503" isShowFg />

    <scroll-view :scroll-into-view="scrollTo" scroll-y class="g-container">
      <view id="_address" class="container-box g-border mb16">
        <Address-Box :addressList="addressList" />
      </view>

      <view
        v-if="pageConfig.sfz.length"
        class="container-box g-border mb16 box-padding"
        id="_photo"
      >
        <view class="g-bold f36">请上传本人身份证</view>

        <view class="mt24 flex-between id-card-container">
          <view
            v-if="pageConfig.sfz.includes('front')"
            @click="chooseIdCardFront"
            class="up-idcard g-border g-flex-rc-cc mb16"
          >
            <view
              v-if="idCardImg.frontIdCardUrl"
              @click.stop="idCardImg.frontIdCardUrl = ''"
              class="iconfont delete-icon"
            >
              &#xe6fa;
            </view>
            <image
              v-if="idCardImg.frontIdCardUrl"
              :src="dealImg(idCardImg.frontIdCardUrl)"
            />
            <image
              v-else
              :src="$global.BASE_IMG + 'ba_img_idcard-front.png'"
              class="idcard-bg my-disabled"
            />

            <view
              v-if="!idCardImg.frontIdCardUrl"
              class="g-flex-rc-cc flex-column f24"
            >
              <view class="iconfont camera-icon">&#xe6be;</view>
              <view>身份证人像页</view>
            </view>
          </view>

          <view
            v-if="pageConfig.sfz.includes('end')"
            @click="chooseIdCardBack"
            class="up-idcard g-border g-flex-rc-cc mb16"
          >
            <view
              v-if="idCardImg.endIdCardUrl"
              @click.stop="idCardImg.endIdCardUrl = ''"
              class="iconfont delete-icon"
            >
              &#xe6fa;
            </view>
            <image
              v-if="idCardImg.endIdCardUrl"
              :src="dealImg(idCardImg.endIdCardUrl)"
            />

            <image
              v-else
              :src="$global.BASE_IMG + 'ba_img_idcard-back.png'"
              class="idcard-bg my-disabled"
            />

            <view
              v-if="!idCardImg.endIdCardUrl"
              class="g-flex-rc-cc flex-column f24"
            >
              <view class="iconfont camera-icon">&#xe6be;</view>
              <view>身份证国徽页</view>
            </view>
          </view>

          <view
            v-if="pageConfig.sfz.includes('handler')"
            @click="chooseIdCardHandler"
            class="up-idcard g-border g-flex-rc-cc mb16"
          >
            <view
              v-if="idCardImg.handIdCardUrl"
              @click.stop="idCardImg.handIdCardUrl = ''"
              class="iconfont delete-icon"
            >
              &#xe6fa;
            </view>
            <image
              v-if="idCardImg.handIdCardUrl"
              :src="dealImg(idCardImg.handIdCardUrl)"
            />

            <image
              v-else
              :src="$global.BASE_IMG + 'ba_img_idcard-handheld.png'"
              class="idcard-bg my-disabled"
            />

            <view
              v-if="!idCardImg.handIdCardUrl"
              class="g-flex-rc-cc flex-column f24"
            >
              <view class="iconfont camera-icon">&#xe6be;</view>
              <view>手持身份证照片</view>
            </view>
          </view>
        </view>
      </view>

      <view id="_record" class="container-box g-border mb16 box-padding">
        <view class="g-bold f36">住院记录</view>

        <view class="flex-normal patient-info color-light-dark f28">
          <text class="patient-name g-border-right">
            {{ getUserShowLabel(gStores.userStore.patChoose) }}
          </text>

          <text>{{ getGetHosName }}</text>
        </view>

        <view class="record-container mt32">
          <record-Card
            :list="recordRows"
            @click-edit="editRecord"
            @click-del="delRecord"
            isEdit
          />
        </view>

        <view @click="addRecord" class="add-btn color-blue g-flex-rc-cc">
          <view class="iconfont add-icon">&#xe6fb;</view>
          <view class="f28 g-bold">手动添加记录</view>
        </view>
      </view>

      <view id="_aim" class="container-box g-border mb16 box-padding">
        <view class="f36">
          <text class="mr12 g-bold">请选择复印目的</text>
          <text class="f28 color-light-dark">(多选)</text>
        </view>

        <view class="mt24 pb32 g-border-bottom">
          <g-select-flatten
            :selectLength="3"
            :list="aimList"
            v-model:value="aimValue"
            multiple
          />
        </view>

        <view class="f36 mt32">
          <text class="mr12 g-bold">备注</text>
        </view>

        <view class="mt32">
          <textarea
            v-model="remark"
            placeholder="如还需以下说明的其他病历资料请备注"
            auto-height
          />
        </view>
      </view>

      <view class="container-box g-border mb16">
        <g-flag typeFg="32" isShowFgTip />
      </view>
    </scroll-view>

    <view class="g-footer g-border-top">
      <view class="fee-count flex-normal">
        <text class="color-666 f28 mr12">合计</text>
        <text class="color-error f36 g-bold">{{ getPayMoneyNum }}元</text>
      </view>
      <button @click="paySubmit" class="btn g-border btn-warning dialog-btn">
        立即支付
      </button>
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
      :title="addDialogTitle"
      @submit="recordSubmit"
      ref="refAddDialog"
    />

    <xy-dialog
      title=""
      :content="xyDialogContent"
      :show="isXyDialogShow"
      @cancelButton="_xyDialogCancel"
      @confirmButton="_xyDialogConfirm"
    />

    <view class="g-border-bottom my-display-none">
      <g-selhos :hosId="hosId" @get-list="getHosList" />
    </view>

    <g-message />
  </view>
</template>

<script lang="ts" setup>
  import { computed, ref, onMounted, watch } from 'vue';
  import AddressBox from './components/medRecordDetailsAddressBox.vue';
  import recordCard from './components/recordCard.vue';
  import AddRecordDialog from './components/medRecordDetailsAddRecordDialog.vue';
  import {
    chooseImg,
    GStores,
    IHosInfo,
    ISystemConfig,
    ServerStaticData,
  } from '@/utils';
  import { onShow } from '@dcloudio/uni-app';
  import { getUserShowLabel } from '@/stores';
  import { CaseCopeItemDetail } from './utils/recordApply';
  import { NotNullable } from '@/typeUtils';

  import api from '@/service/api';

  type TRecordRows = NotNullable<CaseCopeItemDetail['_outInfo']>[number];

  const _aimList = [
    '医疗保险',
    '了解病情',
    '交通事故理赔',
    '工伤鉴定',
    '医学鉴定',
    '其他',
  ];

  const props = defineProps<{
    hosId: string;
    isManual?: '1';
  }>();

  const pageConfig = ref<ISystemConfig['medRecord']>({
    sfz: [],
    fee: 10,
    isItemCount: '0',
  });

  const scrollTo = ref('');
  watch(
    () => scrollTo.value,
    () => {
      setTimeout(() => {
        scrollTo.value = '';
      }, 100);
    }
  );

  const gStores = new GStores();
  const showMessage = gStores.messageStore.showMessage;

  const refAddDialog = ref<any>('');
  const addDialogTitle = computed(() => {
    if (isAddDialogEdit.value) {
      return '编辑添加记录';
    } else {
      return '手动添加记录';
    }
  });
  const addDialogValue = ref<BaseObject>({});
  const isAddDialogEdit = ref(false);
  const addressList = ref<any[]>([]);
  const getAddress = computed(() => {
    if (addressList.value.length) {
      return (
        addressList.value.find((o) => o.defaultFlag == 1) ||
        addressList.value[0]
      );
    } else {
      return {};
    }
  });
  const hosList = ref<IHosInfo[]>([]);
  const remark = ref('');
  const recordRows = ref<TRecordRows[]>([
    // {
    //   deptName: '科室233',
    //   admissionTime: '2022-09-19',
    //   outTime: '2022-09-19',
    //   visitNo: '233222',
    //   isOneself: '0',
    // },
  ]);

  const getPayMoneyNum = computed(() => {
    const _fee = pageConfig.value.fee;
    if (pageConfig.value.isItemCount === '1') {
      return recordRows.value.length * aimValue.value.length * _fee;
    } else {
      return _fee;
    }
  });

  const imgCanvas = ref({
    imgWidth: 0,
    imgHeight: 0,
  });

  const idCardImg = ref({
    frontIdCardUrl: '',
    endIdCardUrl: '',
    handIdCardUrl: '',
  });

  const isXyDialogShow = ref(false);
  const xyDialogContent = ref('确定删除?');
  let xyDialogConfirm: (...args: any[]) => any = () => {};
  let xyDialogCancel: (...args: any[]) => any = () => {};
  const _xyDialogConfirm = () => {
    xyDialogConfirm();
    isXyDialogShow.value = false;
  };

  const _xyDialogCancel = () => {
    xyDialogCancel();
    isXyDialogShow.value = false;
  };

  const getGetHosName = computed(() => {
    return (
      hosList.value.find((o) => o.hosId == props.hosId)?.hosName ||
      props.hosId ||
      ''
    );
  });

  const aimList = ref(
    _aimList.map((o) => ({
      label: o,
      value: o,
    }))
  );

  const aimValue = ref<typeof aimList.value>([]);

  const getHosList = ({ list }: { list: IHosInfo[] }) => {
    hosList.value = list;
  };

  const chooseIdCardFront = async () => {
    const res = await chooseImg({ imgCanvas });

    if (res.success) {
      idCardImg.value.frontIdCardUrl = res.base64;
    }
  };

  const chooseIdCardBack = async () => {
    const res = await chooseImg({ imgCanvas });

    if (res.success) {
      idCardImg.value.endIdCardUrl = res.base64;
    }
  };

  const chooseIdCardHandler = async () => {
    const res = await chooseImg({ imgCanvas });

    if (res.success) {
      idCardImg.value.handIdCardUrl = res.base64;
    }
  };

  const addRecord = () => {
    addDialogValue.value = {
      hosId: props.hosId,
    };
    isAddDialogEdit.value = false;

    refAddDialog.value.show();
  };

  const recordSubmit = (data: TRecordRows) => {
    data.isOneself = '0';
    if (isAddDialogEdit.value) {
      recordRows.value[_editRowIndex] = data;
    } else {
      recordRows.value.push(data);
    }
  };

  const dealImg = (img: string) => {
    if (img.startsWith('http')) {
      return img;
    } else {
      return 'data:image/png;base64,' + img;
    }
  };

  let _editRowIndex = 0;
  const editRecord = ({
    item,
    index,
  }: {
    item: TRecordRows;
    index: number;
  }) => {
    isAddDialogEdit.value = true;
    addDialogValue.value = {
      ...item,
      hosId: props.hosId,
    };
    _editRowIndex = index;

    refAddDialog.value.show();
  };

  const delRecord = async ({
    item,
    index,
  }: {
    item: TRecordRows;
    index: number;
  }) => {
    xyDialogContent.value = '确定删除?';
    isXyDialogShow.value = true;
    await new Promise((resolve, reject) => {
      xyDialogConfirm = resolve;
      xyDialogCancel = reject;
    });

    recordRows.value.splice(index, 1);
  };

  const getConfig = async () => {
    pageConfig.value = await ServerStaticData.getSystemConfig('medRecord');
  };

  const paySubmit = async () => {
    const { sfz } = pageConfig.value;
    const { frontIdCardUrl, endIdCardUrl, handIdCardUrl } = idCardImg.value;
    if (!addressList.value.length) {
      showMessage('请先选择收货地址', 1500);
      scrollTo.value = '_address';
      return;
    }

    if (sfz.includes('front') && !frontIdCardUrl) {
      showMessage('请先上传身份证人像页', 1500);
      scrollTo.value = '_photo';

      return;
    }

    if (sfz.includes('end') && !endIdCardUrl) {
      scrollTo.value = '_photo';
      showMessage('请先上传身份证国徽页', 1500);
      return;
    }

    if (sfz.includes('handler') && !handIdCardUrl) {
      scrollTo.value = '_photo';
      showMessage('请先上传手持身份证', 1500);
      return;
    }

    if (!recordRows.value.length) {
      scrollTo.value = '_record';
      showMessage('请先添加住院记录', 1500);
      return;
    }

    if (!aimValue.value.length) {
      scrollTo.value = '_aim';
      showMessage('请先选择复印目的', 1500);
      return;
    }

    const { province, city, county, detailedAddress, senderName, senderPhone } =
      getAddress.value;
    const { hosId } = props;
    const { patientId } = gStores.userStore.patChoose;

    const division = `${province} ${city} ${county}`;
    const copyAim = aimValue.value.join('、');

    const args = {
      address: detailedAddress,
      addresseeName: senderName,
      addresseePhone: senderPhone,
      channel: gStores.globalStore.browser.source,
      copyAim,
      division,
      frontIdCardUrl,
      endIdCardUrl,
      handIdCardUrl,
      fee: getPayMoneyNum.value,
      hosId,
      outInfo: JSON.stringify(recordRows.value),
      openId: '',
      userId: '',
      patientId,
      remark: remark.value,
      payType: '',
      subopenId: '',
      visitDate: '',
    };

    // #ifdef  MP-WEIXIN
    args.openId = gStores.globalStore.openId;
    args.payType = '37';
    // #endif

    // #ifdef MP-ALIPAY
    args.userId = gStores.globalStore.openId;
    args.payType = '38';
    // #endif

    await api.copyOfCasePay(args);
  };

  const init = async () => {
    getConfig();
  };

  init();

  onShow(async () => {
    const { result } = await api.queryExpressAddress({
      herenId: gStores.globalStore.herenId,
    });

    addressList.value = result || [];
  });

  onMounted(() => {
    if (props.isManual) {
      addRecord();
    }
  });
</script>

<style lang="scss" scoped>
  .g-container {
    padding: 0 32rpx;
    width: calc(100% - 64rpx);

    .container-box {
      border-radius: 8px;
      background-color: #fff;

      &:first-child {
        margin-top: 24rpx;
      }

      .id-card-container {
        flex-wrap: wrap;
      }

      .up-idcard {
        // flex: 1;
        height: 180rpx;
        border-radius: 8px;
        width: calc(50% - 12rpx);

        border-style: dashed;
        position: relative !important;
        margin-bottom: 16rpx;

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

        .idcard-bg {
          position: absolute;
          z-index: 1;
        }

        > view {
          position: relative;
          z-index: 1;
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

    .fee-count {
      flex: 0.8;
    }

    .btn {
      flex: 1;
    }
  }
</style>
