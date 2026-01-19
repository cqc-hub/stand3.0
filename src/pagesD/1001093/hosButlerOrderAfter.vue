<template>
  <view
    :class="{
      [gStores.globalStore.getPageClass]: true,
    }"
  >
    <view class="header header-dark"></view>
    <view class="container relative z-2">
      <view class="box pt32 pb24">
        <view class="reg-header p32">
          <view class="color-fff">
            <view class="font-semibold f48">登记成功</view>
            <view class="f28">
              请您牢记住院号，用于后续的住院信息查询，若遗失住院号则无法进行住院信息查询。
            </view>
          </view>

          <view class="iconfont reg-header-icon-bg absolute">&#xe6d0;</view>
        </view>
      </view>

      <view class="box">
        <view class="container-box pb12">
          <view class="font-semibold f36 p32">住院信息</view>
          <g-form
            v-model:value="formData"
            bodyBold
            ref="gform1"
            hideRowBorder
          />
        </view>
      </view>

      <view class="box">
        <view class="container-box pb12">
          <view class="flex flex-between p32">
            <view class="font-semibold f36">就诊人信息</view>
            <view
              v-if="!editForm2 && false"
              @click="
                () => {
                  editForm2 = true;
                  editForm(gform2, formTemps['1']);
                }
              "
              class="item-title-right flex-normal color-blue f28"
            >
              <view class="iconfont f40">&#xe6b9;</view>
              编辑
            </view>
          </view>

          <g-form
            v-model:value="formData"
            @change="formChange"
            @address-change="addressChange"
            bodyBold
            ref="gform2"
            hideRowBorder
          />
        </view>
      </view>

      <view class="box">
        <view class="container-box pb12">
          <view class="flex flex-between p32">
            <view class="font-semibold f36">联系人信息</view>
            <view
              v-if="!editForm3 && false"
              @click="
                () => {
                  editForm3 = true;
                  editForm(gform3, formTemps['2']);
                }
              "
              class="item-title-right flex-normal color-blue f28"
            >
              <view class="iconfont f40">&#xe6b9;</view>
              编辑
            </view>
          </view>

          <g-form
            v-model:value="formData"
            @change="formChange"
            bodyBold
            ref="gform3"
            hideRowBorder
          />
        </view>
      </view>
    </view>

    <view class="safe-height"></view>
    <view class="safe-height"></view>
    <view class="safe-height"></view>
    <view class="safe-height"></view>
    <view class="safe-height"></view>
    <view class="footer relative z-2">
      <view class="g-footer g-border-top">
        <button
          @click="handlerNextClick"
          class="btn btn-primary g-border flex-1"
        >
          {{ isEdit ? '保存' : '下一步' }}
        </button>
      </view>
    </view>

    <g-message />
  </view>
</template>

<script lang="ts" setup>
  import {
    apiAsync,
    GStores,
    idCardConvert,
    phoneConvert,
    useTBanner,
  } from '@/utils';
  import { computed, onMounted, ref } from 'vue';
  import { useHosButlerOrder } from './hosButler';
  import { onLoad } from '@dcloudio/uni-app';
  import { TInstance } from '@/components/g-form';
  import api from '@/service/api';

  const gStores = new GStores();

  const formData = ref({} as any);
  const { pageProps, pageLoad, formTemps } = useHosButlerOrder();
  const gform1 = ref('' as any);
  const gform2 = ref('' as any);
  const gform3 = ref('' as any);
  const editForm2 = ref(false);
  const editForm3 = ref(false);

  const isEdit = computed(() => {
    return editForm2.value || editForm3.value;
  });
  const handlerNextClick = async () => {
    if (isEdit.value) {
      const { confirm } = await apiAsync(uni.showModal, {
        content: '确认保存?',
      });

      if (!confirm) {
        return;
      }

      await api.submitAdmissionApplication(formData.value);

      if (editForm2.value) {
        editForm2.value = false;
        formatterTemp(formTemps.value['1'], gStores.globalStore.modeOld);
        gform2.value.setList(formTemps.value['1']);
      }

      if (editForm3.value) {
        editForm3.value = false;
        formatterTemp(formTemps.value['2'], gStores.globalStore.modeOld);
        gform3.value.setList(formTemps.value['2']);
      }
      return;
    }

    useTBanner(
      {
        type: 'h5',
        isSelfH5: '1',
        path: 'pagesA/1001093/hosButler',
        addition: {
          patientId: '_patientId',
        },
      },
      'reLaunch'
    );
  };

  const formatterTemp = (list: TInstance[], modeOld = false) => {
    list.map((o, i) => {
      let baseSize = 180;
      const { key } = o;

      if (modeOld) {
        o.labelWidth = `${baseSize + 30}rpx`;
      } else {
        o.labelWidth = `${baseSize}rpx`;
      }
      o.showBodyStyle = 'text-align: left;';
      o.labelStyle =
        'color: var(--hr-neutral-color-7);font-size: var(--hr-font-size-base);';
      o.rowStyle = {
        'margin-top': '-20rpx',
        'margin-bottom': '16rpx',
        'padding-top': 0,
        'padding-bottom': 0,
      };

      o.disabled = true;
      o.isForShow = true;
      o.showSuffixArrowIcon = false;
      o.showRequireIcon = false;

      if (i === list.length) {
        o.rowStyle['border-radius'] = '8px';
      }

      if (key === 'patientPhone') {
        o.inputMask = phoneConvert;
      }
    });

    console.log(list);
  };

  const editForm = (formRef, list: TInstance[]) => {
    console.log(formRef);
    const requireKey = [
      'patientPhone',
      'citizenshipCode',
      '_address',
      'membersName',
      'relationship',
      'membersPhone',
    ];
    const enabledKey = [
      'patientPhone',
      'citizenshipCode',
      '_address',
      'occupationCode',
      'marital',
      'eduCode',
      'serviceAgency',
      'presentAddress',
      'postCode',
      'phone',
      'address',
      'membersName',
      'relationship',
      'membersPhone',
    ];
    list.map((o) => {
      const { key, field, rowStyle } = o;
      o.isForShow = false;
      if (rowStyle) {
        rowStyle['margin-top'] = '0';
      }
      if (enabledKey.includes(key)) {
        o.disabled = false;

        if (requireKey.includes(key)) {
          o.showRequireIcon = true;
        }

        if (['address', 'select'].includes(field)) {
          o.showSuffixArrowIcon = true;
        }
      }
    });

    formRef.setList(list);
  };

  let isBackPoint = false;
  const formChange = (e) => {
    if (['wx', 'alipay'].includes(gStores.globalStore.ev) && !isBackPoint) {
      isBackPoint = true;
      const opt = {
        message: '当前填写的内容尚未保存，确定要离开吗？',
      };

      // #ifdef MP-WEIXIN
      wx.enableAlertBeforeUnload(opt);
      // #endif

      // #ifdef MP-ALIPAY
      my.enableAlertBeforeUnload(opt);
      // #endif
    }
  };

  const addressChange = ({ value = [] as any[] }) => {
    const [birthProvince, birthCity, birthDistrict] = value;

    if (birthProvince && birthCity && birthDistrict) {
      formData.value.birthProvince = birthProvince.value;
      formData.value.birthCity = birthCity.value;
      formData.value.birthDistrict = birthDistrict.value;
      formData.value.birthProvinceName = birthProvince.text;
      formData.value.birthCityName = birthCity.text;
      formData.value.birthDistrictName = birthDistrict.text;
    }
  };

  onMounted(() => {
    formatterTemp(formTemps.value['0'], gStores.globalStore.modeOld);
    formatterTemp(formTemps.value['1'], gStores.globalStore.modeOld);
    formatterTemp(formTemps.value['2'], gStores.globalStore.modeOld);

    gform1.value.setList(formTemps.value['0']);
    gform2.value.setList(formTemps.value['1']);
    gform3.value.setList(formTemps.value['2']);
  });

  onLoad((opt: any) => {
    pageLoad(opt);
    formData.value = {
      ...pageProps.value,
    };
  });
</script>

<style lang="scss" scoped>
  .header {
    &::after {
      content: '';
      display: block;
      height: 400rpx;

      position: absolute;
      top: 0;
      left: 0;
      right: 0;
    }

    &.header-dark {
      &::after {
        background: linear-gradient(
          0deg,
          rgba(106, 125, 165, 0) 1%,
          #6a7da5 38%,
          #6a7da5 96%
        );
      }
    }
  }

  .box {
    // position: relative;
    // z-index: 2;

    .reg-header {
      // padding: 0 32rpx;

      display: flex;
      align-items: center;
      color: #fff;
      position: relative;

      .reg-header-icon-bg {
        // opacity: 0;
        font-size: 200rpx;
        right: 0;
        top: -32rpx;

        mask: linear-gradient(
          180deg,
          #ffffff3c 0,
          #ffffff3c 20%,
          #ffffff00 80%,
          #ffffff00 100%
        );
      }

      .out-time-info {
        position: absolute;
        top: 50%;
        right: 32rpx;
        transform: translateY(-50%);
      }
    }

    .container {
      transform: translateY(-80rpx);
      // #ifdef  MP-WEIXIN
      transform: translateY(-70rpx);
      // #endif

      &::before {
        content: '';
        display: block;
        height: 40rpx;
        margin: 0 12rpx;
        background-color: rgba(0, 0, 0, 0.2);
        border-radius: 60rpx;
      }
    }

    .container-box {
      background-color: #fff;
      margin: 0 32rpx;
      margin-bottom: 16rpx;
      border-radius: 8px;
    }
  }

  .footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 10;
  }
</style>
