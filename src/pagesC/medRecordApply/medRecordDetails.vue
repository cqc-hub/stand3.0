<template>
  <view
    :class="{
      'system-mode-old': gStores.globalStore.modeOld,
    }"
  >
    <view class="my-display-none">
      <g-selhos :hosId="_hosId" @get-list="getHosList" />
    </view>

    <view class="g-page" v-if="pageConfig && isConfigGet">
      <g-flag typeFg="503" isShowFg />
      <scroll-view :scroll-into-view="scrollTo" scroll-y class="g-container">
        <view class="content-box">
          <view id="_address" class="container-box g-border mb16">
            <Address-Box :addressList="addressList" />
          </view>

          <view
            v-if="pageConfig.company && pageConfig.company.length"
            class="container-box g-border mb16 box-padding"
          >
            <view>
              <template v-if="pageConfig.company.length > 1">
                <view id="_express" class="g-bold f36">选择快递方式</view>

                <view class="mt24 pb32 g-border-bottom">
                  <Sel-Express
                    :selectLength="3"
                    :list="pageConfig.company"
                    v-model:value="expressCompany"
                    column="2"
                  />
                </view>
              </template>

              <template v-if="pageConfig.company.length === 1">
                <view id="_express" class="g-bold f36">快递方式</view>

                <view class="mt24 f28">
                  <view class="flex-between">
                    <view class="color-888">快递方式</view>
                    <!-- <view class="g-bold">{{ aimList[0].label }}</view> -->
                    <view class="g-bold">
                      <image
                        :src="getSrc(expressCompany)"
                        class="express-icon"
                      />
                    </view>
                  </view>
                </view>
              </template>

              <view class="f28 mt24">
                <view class="flex-between">
                  <view class="color-888">快递费支付方式</view>
                  <view class="g-bold color-error">
                    {{ getCompanyPayWayLabel }}
                  </view>
                </view>
              </view>
            </view>
          </view>

          <view
            v-if="
              (pageConfig.sfz && pageConfig.sfz.length) ||
              pageConfig.photoConfig
            "
            class="container-box g-border mb16 box-padding"
            id="_photo"
          >
            <!-- <view class="g-bold f36">请上传本人身份证</view> -->
            <template v-if="pageConfig.photoConfig">
              <view
                @click="photoModeSelRef.show"
                class="g-bold f36 flex-between"
              >
                <text>{{ photoModeLabel }}</text>
                <text class="iconfont size-icon">&#xe66b;</text>
              </view>

              <view class="mt24 flex-between id-card-container">
                <view
                  v-for="item in photoList"
                  :key="item.value"
                  @click="choosePhoto(item)"
                  class="up-idcard g-border g-flex-rc-cc mb16"
                >
                  <view
                    v-if="photoSelects[item.value]"
                    @click.stop="photoSelects[item.value] = ''"
                    class="iconfont delete-icon"
                  >
                    &#xe6fa;
                  </view>

                  <image
                    v-if="photoSelects[item.value]"
                    :src="dealImg(photoSelects[item.value])"
                  />

                  <image v-else :src="item.url" class="idcard-bg my-disabled" />

                  <view
                    v-if="!photoSelects[item.value]"
                    class="g-flex-rc-cc flex-column f24"
                  >
                    <view class="iconfont camera-icon color-fff">&#xe6be;</view>
                    <view class="color-fff">
                      <text>{{ item.label }}</text>
                      <text v-if="isPhotoModeItemRequire(item)">(必传)</text>
                    </view>
                  </view>
                </view>
              </view>
            </template>

            <template v-else>
              <view class="g-bold f36">
                <template>
                  <rich-text :nodes="fg1020" />
                  <g-flag v-model:value="fg1020" typeFg="1020" />
                </template>
              </view>

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
                  v-if="pageConfig.sfz.includes('hkb')"
                  @click="chooseIdCardHkb"
                  class="up-idcard g-border g-flex-rc-cc mb16"
                >
                  <view
                    v-if="idCardImg.censusRegisterUrl"
                    @click.stop="idCardImg.censusRegisterUrl = ''"
                    class="iconfont delete-icon"
                  >
                    &#xe6fa;
                  </view>
                  <image
                    v-if="idCardImg.censusRegisterUrl"
                    :src="dealImg(idCardImg.censusRegisterUrl)"
                  />

                  <image
                    v-else
                    :src="$global.BASE_IMG + 'ba_img_idcard-hkb.png'"
                    class="idcard-bg my-disabled"
                  />

                  <view
                    v-if="!idCardImg.censusRegisterUrl"
                    class="g-flex-rc-cc flex-column f24"
                  >
                    <view class="iconfont camera-icon">&#xe6be;</view>
                    <view>户口本单页</view>
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
                    <view>手持身份证人像面</view>
                  </view>
                </view>

                <view
                  v-if="pageConfig.sfz.includes('handlerBack')"
                  @click="chooseIdCardBackHandler"
                  class="up-idcard g-border g-flex-rc-cc mb16"
                >
                  <view
                    v-if="idCardImg.handIdCardFrontUrl"
                    @click.stop="idCardImg.handIdCardFrontUrl = ''"
                    class="iconfont delete-icon"
                  >
                    &#xe6fa;
                  </view>
                  <image
                    v-if="idCardImg.handIdCardFrontUrl"
                    :src="dealImg(idCardImg.handIdCardFrontUrl)"
                  />

                  <image
                    v-else
                    :src="$global.BASE_IMG + 'ba_img_idcard-handheld.png'"
                    class="idcard-bg my-disabled"
                  />

                  <view
                    v-if="!idCardImg.handIdCardFrontUrl"
                    class="g-flex-rc-cc flex-column f24"
                  >
                    <view class="iconfont camera-icon">&#xe6be;</view>
                    <view>手持身份证国徽面</view>
                  </view>
                </view>
              </view>
            </template>
          </view>

          <view id="_record" class="container-box g-border mb16 box-padding">
            <view class="g-bold f36">住院记录</view>

            <view class="flex-normal patient-info color-light-dark f28">
              <text class="patient-name">
                {{ getUserShowLabel(gStores.userStore.patChoose) }}
              </text>

              <!-- <text>{{ getGetHosName }}</text> -->
            </view>

            <view class="record-container mt32">
              <Record-Card
                :list="recordRows"
                :isAddCount="pageConfig.selPurposeInRecord === '1'"
                @click-edit="editRecord"
                @click-del="delRecord"
                @change-count="changeCount"
                isEdit
              />
            </view>

            <view
              v-if="pageConfig.selPurposeInRecord === '1'"
              class="color-888 f28 mb16"
            >
              <rich-text :nodes="fg1021" />
              <g-flag v-model:value="fg1021" typeFg="1021" />
            </view>

            <view
              v-if="isShowAddRecord"
              @click="addRecord"
              class="add-btn color-blue g-flex-rc-cc"
            >
              <view class="iconfont add-icon">&#xe6fb;</view>
              <view class="f28 g-bold">手动添加记录</view>
            </view>
          </view>

          <view id="_aim" class="container-box g-border mb16 box-padding">
            <view class="f36">
              <text class="mr12 g-bold">请选择复印目的</text>
              <text
                v-if="pageConfig.selPurposeInRecord !== '1'"
                class="f28 color-light-dark"
              >
                {{
                  selPurposeLen === 1
                    ? '可选1项'
                    : `(请选择 1-${selPurposeLen} 项)`
                }}
              </text>
            </view>

            <view class="mt24">
              <g-select-flatten
                v-if="pageConfig.isPurposeRadio === '1'"
                v-model:value="aimValue"
                :selectLength="selPurposeLen"
                :list="aimList"
                :multiple="selPurposeLen != 1"
              />
              <view v-else>
                <view class="color-888 f28 mb16">
                  <rich-text :nodes="fg1021" />
                  <g-flag v-model:value="fg1021" typeFg="1021" />
                </view>

                <Purpose-Count
                  v-model:value="purposeCount"
                  :selectLength="selPurposeLen"
                  :list="aimList"
                />
              </view>
            </view>
          </view>

          <view class="container-box g-border mb16 box-padding">
            <view class="f36">
              <text class="mr12 g-bold">备注</text>
            </view>

            <view class="remark-content">
              <uni-easyinput
                type="textarea"
                v-model="remark"
                autoHeight
                :inputBorder="false"
                :placeholderStyle="'color: var(--hr-neutral-color-5);font-size: var(--hr-font-size-base);'"
                placeholder="如还需以下说明的其他病历资料请备注"
              />

              <!-- auto-height -->
            </view>
          </view>

          <view class="container-box g-border mb16">
            <g-flag typeFg="32" isShowFgTip />
          </view>
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
        :isShowAddRecord="isToggleHos"
        :systemModeOld="gStores.globalStore.modeOld"
        @submit="recordSubmit"
        @hos-change="hosChange"
        ref="refAddDialog"
      />

      <xy-dialog
        title=""
        :content="xyDialogContent"
        :show="isXyDialogShow"
        @cancelButton="_xyDialogCancel"
        @confirmButton="_xyDialogConfirm"
      />

      <g-pay
        :list="refPayList"
        :autoPayArg="payArg"
        @pay-success="payAfter"
        auto
        autoInOne
        ref="refPay"
      >
        <g-flag typeFg="32" isShowFgTip />
      </g-pay>
    </view>

    <xy-dialog
      :title="fgTitle32"
      :show="isShowFg32"
      @confirmButton="getPay"
      @cancelButton="isShowFg32 = false"
      isReverseBtn
    >
      <view class="reg-tip">
        <g-flag v-model:title="fgTitle32" isHideTitle isShowFgTip typeFg="32" />
      </view>
    </xy-dialog>

    <g-select
      v-model:value="photoMode"
      :option="photoModeList"
      :field="{
        label: 'label',
        value: 'value',
      }"
      title="选择业务类型"
      ref="photoModeSelRef"
    />
    <g-message />
  </view>
</template>

<script lang="ts" setup>
  import { computed, ref, watch, nextTick } from 'vue';
  import { onShow, onLoad } from '@dcloudio/uni-app';

  import {
    GStores,
    IHosInfo,
    ISystemConfig,
    ServerStaticData,
    upImgOss as _upImgOss,
    wait,
    useOcr,
    base64Src,
  } from '@/utils';
  import { getSrc } from '@/pagesC/medicationAssistant/utils';
  import { getUserShowLabel } from '@/stores';
  import { type CaseCopeItemDetail, CACHE_KEY } from './utils/recordApply';
  import { getLocalStorage } from '@/common';
  import { NotNullable, XOR, assignType } from '@/typeUtils';

  import api from '@/service/api';

  import SelExpress from '@/pagesC/medicationAssistant/components/SelExpress.vue';
  import AddressBox from './components/MedRecordDetailsAddressBox.vue';
  import RecordCard from './components/RecordCard.vue';
  import AddRecordDialog from './components/MedRecordDetailsAddRecordDialog.vue';
  import PurposeCount from './components/PurposeCount.vue';

  type TChoose = XOR<
    { success: true; path: string },
    { success: false; evt: any }
  >;

  const upImgOss = (failPath: string) => {
    return _upImgOss(failPath, {
      data: {
        functionType: 'BAFY',
      },
    });
  };

  const fg1020 = ref('');
  const fg1021 = ref('');
  const selPurposeLen = ref(3);
  const purposeCount = ref<{ purpose: string; count: number }[]>([]);
  const expressCompany = ref('');
  const chooseImg = (): Promise<TChoose> => {
    return new Promise((resolve) => {
      uni.chooseImage({
        count: 1,
        sizeType: 'compressed',
        async success(e) {
          const { tempFilePaths } = e;
          resolve({
            success: true,
            path: tempFilePaths[0],
          });
        },

        fail(e) {
          resolve({
            success: false,
            evt: e,
          });
        },
      });
    });
  };

  type TRecordRows = NotNullable<CaseCopeItemDetail['_outInfo']>[number];

  const _aimList = ref([
    '医疗保险',
    '了解病情',
    '交通事故理赔',
    '工伤鉴定',
    '医学鉴定',
    '其他',
  ]);

  const props = defineProps<{
    hosId: string;
    isManual?: '1';
    phsOrderNo?: string;
  }>();
  const imgWidth = ref(200);
  const imgHeight = ref(200);

  const _hosId = ref(props.hosId || '');

  const isConfigGet = ref(false);
  const pageConfig = ref<ISystemConfig['medRecord'][number]>({
    sfz: [],
    fee: 10,
    isItemCount: '0',
    hosId: '2',
  });

  // 手动添加记录?
  const isShowAddRecord = computed(() => {
    return props.isManual === '1';
    // return pageConfig.value.isCustomPatRecord === '1';
  });

  // 切换院区?
  const isToggleHos = computed(() => {
    return pageConfig.value.isToggleHos === '1';
  });

  const photoMode = ref('');
  const photoModeSelRef = ref(<any>'');
  const photoSelects = ref<Record<string, string>>({});

  const photoModeLabel = computed(() => {
    if (photoMode.value) {
      return (
        photoModeList.value.find((o) => o.value === photoMode.value)?.label ||
        photoMode.value
      );
    }

    return '';
  });

  const photoModeList = computed(() => {
    return pageConfig.value.photoConfig?.modes || [];
  });

  const photoModeConfig = computed(() => {
    return photoModeList.value.find((o) => o.value === photoMode.value);
  });

  const photoModeRequire = computed(() => {
    return photoModeConfig.value?.require || [];
  });

  const photoList = computed(() => {
    return photoModeConfig.value?.children || [];
  });

  const isPhotoModeItemRequire = (item: (typeof photoList.value)[number]) => {
    return photoModeRequire.value.findIndex((o) => item.value === o) > -1;
  };

  const choosePhoto = async (item: (typeof photoList.value)[number]) => {
    const { path, success } = await chooseImg();

    success && (photoSelects.value[item.value] = path);
  };

  const photoModeSubmitVerify = async () => {
    let errMessage = '';
    const getPhotoConfigByKey = (key: string) => {
      const item = photoList.value.find((o) => o.value === key);

      if (!item) {
        showMessage(
          `配置错误: 模式"${photoMode.value}" require 中不存在对应的值"${key}"`
        );

        throw new Error(
          `配置错误: 模式"${photoMode.value}" require 中不存在对应的值"${key}"`
        );
      }

      return item;
    };

    photoModeRequire.value.map((keys) => {
      if (errMessage) return;
      const rKeys = keys.split('|');
      if (rKeys.length > 1) {
        let isErr = true;

        rKeys.map((key) => {
          if (isErr) {
            isErr = !!!photoSelects.value[key];
          }
        });

        if (isErr) {
          errMessage = rKeys.reduce((prev, key) => {
            const item = getPhotoConfigByKey(key);
            prev += `${item.label} 或`;

            return prev;
          }, '请先上传');

          errMessage = errMessage.slice(0, -1) + '之一';
        }
      } else if (rKeys.length === 1) {
        const key = rKeys[0];

        if (!photoSelects.value[key]) {
          const item = getPhotoConfigByKey(key);

          errMessage = `请先上传 ${item.label}`;
        }
      }
    });
    // throw new Error('233');

    if (errMessage) {
      scrollTo.value = '_photo';
      showMessage(errMessage, 3000);
      throw new Error(errMessage);
    }
  };

  const getCompanyPayWayLabel = computed(() => {
    if (pageConfig.value.company?.length) {
      const company = pageConfig.value.company.find(
        (o) => o.value === expressCompany.value
      );

      return company?.des || '到付';
    }

    return '';
  });

  const refPay = ref<any>('');
  const refPayList = ref([
    {
      label: '在线支付',
      key: 'online',
    },
  ]);
  const payArg = ref<BaseObject>({});

  const fgTitle32 = ref('');
  const isShowFg32 = ref(false);

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
      const count = getCount(recordRows.value) || getCount(purposeCount.value);

      if (pageConfig.value.itemCountExcludeAim === '1') {
      }

      if (pageConfig.value.isPurposeRadio === '1') {
        return (
          ((pageConfig.value.itemCountExcludeAim === '1' &&
            aimValue.value.length &&
            1) ||
            aimValue.value.length) *
          _fee *
          count
        );
      } else {
        return count * _fee;
      }
    } else {
      // 预收模式
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
    handIdCardFrontUrl: '',
    censusRegisterUrl: '',
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
      hosList.value.find((o) => o.hosId == _hosId.value)?.hosName ||
      _hosId.value ||
      ''
    );
  });

  const aimList = ref(
    _aimList.value.map((o) => ({
      label: o,
      value: o,
    }))
  );

  const aimValue = ref<string[]>([]);

  const getHosList = async ({ list }: { list: IHosInfo[] }) => {
    hosList.value = list;

    init();
  };

  const changeCount = ({ item, count }) => {
    assignType<number>(count);
    assignType<TRecordRows>(item);

    item.count = count;
  };

  const chooseIdCardFront = async () => {
    const { isOcrSfz } = pageConfig.value;
    let iswx = false;
    // #ifdef MP-WEIXIN
    iswx = true;
    // #endif

    if (isOcrSfz === '1') {
      try {
        const res = await useOcr(true);
        const { image, name } = res;

        if (image) {
          if (name === gStores.userStore.patChoose.patientName) {
            if (iswx) {
              idCardImg.value.frontIdCardUrl = await base64Src(image);
            } else {
              idCardImg.value.frontIdCardUrl = image;
            }
          } else {
            gStores.messageStore.showMessage(
              '上传的身份证信息与就诊人身份信息不一致，请重新上传！',
              3000
            );
          }
        }
      } catch (error) {
        // #ifdef MP-ALIPAY
        gStores.messageStore.showMessage('请上传正确的身份证照片', 3000);
        //#endif

        console.error(error);
      }
    } else {
      const res = await chooseImg();

      if (res.success) {
        idCardImg.value.frontIdCardUrl = res.path;
      }
    }
  };

  const chooseIdCardBack = async () => {
    const res = await chooseImg();

    if (res.success) {
      idCardImg.value.endIdCardUrl = res.path;
    }
  };

  const chooseIdCardHandler = async () => {
    const res = await chooseImg();

    if (res.success) {
      idCardImg.value.handIdCardUrl = res.path;
    }
  };

  const chooseIdCardBackHandler = async () => {
    const res = await chooseImg();

    if (res.success) {
      idCardImg.value.handIdCardFrontUrl = res.path;
    }
  };

  const chooseIdCardHkb = async () => {
    const res = await chooseImg();

    if (res.success) {
      idCardImg.value.censusRegisterUrl = res.path;
    }
  };

  const addRecord = () => {
    addDialogValue.value = {
      hosId: _hosId.value,
      hosName: getGetHosName.value,
    };
    isAddDialogEdit.value = false;

    nextTick(() => {
      setTimeout(() => {
        refAddDialog.value.show();
      }, 300);
    });
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
    return img;
    // if (img.startsWith('http')) {
    //   return img;
    // } else {
    //   return 'data:image/png;base64,' + img;
    // }
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
      hosId: _hosId.value,
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
    const listConfig =
      (await ServerStaticData.getSystemConfig('medRecord')) || [];

    if (_hosId.value) {
      pageConfig.value = listConfig.find((o) => o.hosId === _hosId.value)!;
    } else {
      const configDetail = listConfig[0];
      pageConfig.value = configDetail;
      _hosId.value = configDetail.hosId;
    }

    if (!pageConfig.value) {
      gStores.messageStore.showMessage(
        '未获取到该院区的配置' + `(${_hosId.value})`
      );

      throw new Error('未获取到该院区的配置' + `(${_hosId.value})`);
    }

    const {
      selPurposeLen: _selPurposeLen,
      purpose: _aimList,
      company,
      photoConfig,
    } = pageConfig.value;

    if (photoConfig) {
      photoMode.value = photoConfig.modes[0]?.value;
    }

    if (company && company.length) {
      expressCompany.value = company[0].value;
    }

    if (_selPurposeLen) {
      selPurposeLen.value = _selPurposeLen * 1;
    }

    if (_aimList) {
      aimList.value = _aimList.map((o) => ({
        label: o,
        value: o,
      }));
    }

    isConfigGet.value = true;
  };

  const isUnImageUpLoaded = (src: string) => {
    // #ifdef  MP-WEIXIN | H5
    if (src.startsWith('https')) {
      return false;
    }
    // #endif

    // #ifdef MP-ALIPAY
    if (!src.startsWith('https://resource')) {
      return false;
    }
    // #endif

    return true;
  };

  const getCount = (list: any[]) =>
    list.reduce<number>((prev, curr) => {
      if (curr.count) {
        prev += curr.count;
      }
      return prev;
    }, 0);

  const paySubmit = async () => {
    const { sfz, requireSfz, isPurposeRadio, selPurposeInRecord, photoConfig } =
      pageConfig.value;
    let {
      frontIdCardUrl,
      endIdCardUrl,
      handIdCardUrl,
      handIdCardFrontUrl,
      censusRegisterUrl,
    } = idCardImg.value;
    const isRequireSfz =
      (!photoConfig &&
        ((requireSfz && requireSfz.length && requireSfz) || sfz)) ||
      [];

    const copyNum = getCount(recordRows.value) || getCount(purposeCount.value);

    if (!addressList.value.length) {
      showMessage('请先选择收货地址', 3000);
      scrollTo.value = '_address';
      return;
    }

    const idCardUrlInfo = {
      front: {
        url: frontIdCardUrl,
        message: '身份证人像页',
      },
      end: {
        url: endIdCardUrl,
        message: '身份证国徽页',
      },
      handler: {
        url: handIdCardUrl,
        message: '手持身份证人像面',
      },
      handlerBack: {
        url: handIdCardFrontUrl,
        message: '手持身份证国徽面',
      },
      hkb: {
        url: censusRegisterUrl,
        message: '户口本单页',
      },
    };

    isRequireSfz.map((key) => {
      const keys = key.split('|');

      const values = keys
        .map((_key) => {
          const v = idCardUrlInfo[_key as keyof typeof idCardUrlInfo];
          if (!v) {
            showMessage(`配置错误,检查 '${key}'  是否配置正确`, 3000);
            throw new Error(`配置错误,检查 '${key}'  是否配置正确`);
          }

          return v.url;
        })
        .filter((o) => o);

      if (!values.length) {
        const [key1, ...rest] = keys;

        let tip = '请先上传' + idCardUrlInfo[key1].message;
        const restTip = rest.map((o) => {
          return '或' + idCardUrlInfo[o].message;
        });

        tip += restTip.join('');
        scrollTo.value = '_photo';

        showMessage(tip, 3000);

        throw new Error(tip);
      }
    });

    await photoModeSubmitVerify();

    if (!recordRows.value.length) {
      scrollTo.value = '_record';
      showMessage('请先添加住院记录', 3000);
      return;
    }

    if (isPurposeRadio === '1') {
      if (!aimValue.value.length) {
        scrollTo.value = '_aim';
        showMessage('请先选择复印目的', 3000);
        return;
      }
    } else {
      if (!purposeCount.value.length) {
        scrollTo.value = '_aim';
        showMessage('请先选择复印目的', 3000);
        return;
      }
    }

    if (selPurposeInRecord === '1' && !copyNum) {
      scrollTo.value = '_record';
      showMessage('请先在住院记录下选择复印份数', 3000);
      return;
    }

    uni.showLoading({
      mask: true,
      title: '上传证件中...',
    });

    const imageJson = <typeof photoList.value>[];
    try {
      for (const item of photoList.value) {
        const _item = { ...item };
        const { value } = _item;
        const pic = photoSelects.value[value];

        if (pic && isUnImageUpLoaded(pic)) {
          const { url } = await upImgOss(pic);
          photoSelects.value[value] = url;
        }

        _item.url = photoSelects.value[value];

        imageJson.push(_item);
      }

      if (frontIdCardUrl && isUnImageUpLoaded(frontIdCardUrl)) {
        const { url } = await upImgOss(frontIdCardUrl);
        idCardImg.value.frontIdCardUrl = url;
      }

      if (endIdCardUrl && isUnImageUpLoaded(endIdCardUrl)) {
        const { url } = await upImgOss(endIdCardUrl);
        idCardImg.value.endIdCardUrl = url;
      }

      if (handIdCardUrl && isUnImageUpLoaded(handIdCardUrl)) {
        const { url } = await upImgOss(handIdCardUrl);
        idCardImg.value.handIdCardUrl = url;
      }

      if (censusRegisterUrl && isUnImageUpLoaded(censusRegisterUrl)) {
        const { url } = await upImgOss(censusRegisterUrl);
        idCardImg.value.censusRegisterUrl = url;
      }

      if (handIdCardFrontUrl && isUnImageUpLoaded(handIdCardFrontUrl)) {
        const { url } = await upImgOss(handIdCardFrontUrl);
        idCardImg.value.handIdCardFrontUrl = url;
      }
    } catch (error) {
      console.error({
        error,
      });

      throw new Error('上传图片失败');
    } finally {
      uni.hideLoading();
    }

    const { province, city, county, detailedAddress, senderName, senderPhone } =
      getAddress.value;
    const { patientId } = gStores.userStore.patChoose;

    const division = `${province} ${city} ${county}`;
    const copyAim = aimValue.value.join('、');
    const printCount =
      (purposeCount.value.length && JSON.stringify(purposeCount.value)) || '';

    const copyAimCount = aimValue.value.length || purposeCount.value.length;

    const args = {
      copyNum,
      copyAimCount,
      expressCompany: expressCompany.value,
      address: detailedAddress,
      addresseeName: senderName,
      addresseePhone: senderPhone,
      channel: gStores.globalStore.browser.source,
      copyAim,
      printCount,
      division,
      frontIdCardUrl: idCardImg.value.frontIdCardUrl,
      endIdCardUrl: idCardImg.value.endIdCardUrl,
      handIdCardUrl: idCardImg.value.handIdCardUrl,
      handIdCardFrontUrl: idCardImg.value.handIdCardFrontUrl,
      censusRegisterUrl: idCardImg.value.censusRegisterUrl,
      imageJson: JSON.stringify(imageJson),
      imageType: photoMode.value,
      fee: getPayMoneyNum.value,
      hosId: _hosId.value,
      outInfo: JSON.stringify(recordRows.value),
      outTime: recordRows.value.map((o) => o.outTime).join(','),
      openId: '',
      userId: '',
      patientId,
      remark: remark.value || '无',
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

    const { result } = await api.copyOfCasePay<{
      phsOrderNo: string;
    }>(args);

    payArg.value = {
      phsOrderNo: result.phsOrderNo,
      phsOrderSource: '4',
      totalFee: getPayMoneyNum.value,
      hosId: _hosId.value,
      hosName: getGetHosName.value,
    };

    isShowFg32.value = true;
    // setTimeout(() => {
    //   refPay.value.show();
    // }, 200);
  };

  const getPay = async () => {
    isShowFg32.value = false;
    refPay.value.show();
  };

  const payAfter = async () => {
    uni.showLoading({
      mask: true,
      title: '加载中, 请稍后',
    });

    await wait(1000);
    uni.hideLoading();

    uni.redirectTo({
      url: '/pagesC/medRecordApply/_recordApply?hosId=' + _hosId.value,
    });
  };

  // 从记录点击再次申请进来默认赋值
  const assignPageData = async (phsOrderNo: string) => {
    const { patientId } = gStores.userStore.patChoose;
    const arg = {
      phsOrderNo,
      patientId,
    };

    const { result } = await api.getCaseCopyDetail<CaseCopeItemDetail>(arg);

    const {
      frontIdCardUrl,
      endIdCardUrl,
      handIdCardUrl,
      handIdCardFrontUrl,
      censusRegisterUrl,
      outInfo,
      copyAim,
      printCount,
      imageJson,
      remark: _remark,
    } = result;

    if (imageJson) {
      try {
        result.imageJson = JSON.parse(imageJson as unknown as string);

        result.imageJson?.map(({ value, url }) => {
          photoSelects.value[value] = url;
        });
      } catch (error) {
        gStores.messageStore.showMessage('imageJson 字段格式错误', 3000);
      }
    }

    printCount && (purposeCount.value = JSON.parse(printCount as any));

    frontIdCardUrl && (idCardImg.value.frontIdCardUrl = frontIdCardUrl);

    censusRegisterUrl &&
      (idCardImg.value.censusRegisterUrl = censusRegisterUrl);

    endIdCardUrl && (idCardImg.value.endIdCardUrl = endIdCardUrl);

    handIdCardUrl && (idCardImg.value.handIdCardUrl = handIdCardUrl);

    handIdCardFrontUrl &&
      (idCardImg.value.handIdCardFrontUrl = handIdCardFrontUrl);

    aimValue.value = copyAim.split('、');

    recordRows.value = JSON.parse(outInfo);

    remark.value = _remark || '';
  };

  const hosChange = () => {
    _hosId.value = addDialogValue.value.hosId;
    getConfig();
  };

  const init = async () => {
    await getConfig();
    console.log(photoModeRequire.value, '233');

    // 再次申请
    if (props.phsOrderNo) {
      await assignPageData(props.phsOrderNo);
    }

    if (props.isManual) {
      addRecord();
    }
  };

  let _firstLoaded = true;
  onShow(async () => {
    const selRecords = getLocalStorage(CACHE_KEY);
    if (selRecords && selRecords.length && _firstLoaded) {
      recordRows.value = JSON.parse(selRecords);
    }

    const _backFromAddress = uni.getStorageSync('back-address');
    if (_firstLoaded || _backFromAddress) {
      _firstLoaded = false;
      uni.removeStorage({
        key: 'back-address',
      });

      const { result } = await api.queryExpressAddress({
        herenId: gStores.globalStore.herenId,
      });

      addressList.value = result || [];
    }
  });

  onLoad((opt) => {
    if (opt && opt.selRecords) {
      try {
        const selRecords = JSON.parse(decodeURIComponent(opt.selRecords));
        recordRows.value = selRecords;
      } catch (error) {
        console.error(error);
      }
    }
  });

  // onMounted(async () => {
  //   await init();
  // });
</script>

<style lang="scss" scoped>
  .g-container {
    .content-box {
      padding: 0 32rpx;
      width: calc(100% - 64rpx);
    }

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
        position: relative;
        margin-bottom: 16rpx;

        .delete-icon {
          font-size: var(--hr-font-size-xxl);
          position: absolute !important;
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
    // position: fixed;
    // bottom: 0;
    // right: 0;
    // left: 0;
    // z-index: 10;

    .fee-count {
      flex: 0.8;
    }

    .btn {
      flex: 1;
    }
  }

  .remark-content {
    :deep(input),
    :deep(textarea),
    input,
    textarea {
      color: var(--hr-neutral-color-10) !important;
      font-size: var(--hr-font-size-base) !important;
      background-color: var(--h-color-white) !important;
      opacity: 1;
    }
  }

  .express-icon {
    width: 190rpx;
    height: 52rpx;

    transform: translateX(20rpx);
  }

  .size-icon {
    color: var(--hr-neutral-color-7);
    font-size: var(--hr-font-size-xxl);
  }
</style>
