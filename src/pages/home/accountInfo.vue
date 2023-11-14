<template>
  <view
    :class="{
      'system-mode-old': gStore.globalStore.modeOld,
    }"
    class=""
  >
    <g-form v-model:value="formData" bodyBold ref="gform" />

    <g-message />

    <view @click="handlerClick" class="btn del-btn btn-primary">
      <view class="del-btn-label">
        {{ pageProps.type === 'outLogin' ? '退出登录' : '注销账号' }}
      </view>
    </view>

    <xy-dialog
      title=""
      content="是否注销该账号?"
      :show="isShow"
      @cancelButton="isShow = false"
      @confirmButton="deletePat"
    />
  </view>
</template>

<script lang="ts" setup>
  import { nextTick, ref, onMounted } from 'vue';
  import { onLoad } from '@dcloudio/uni-app';

  import { GStores, LoginUtils, outLogin } from '@/utils';
  import type { TInstance } from '@/components/g-form/index';

  import xyDialog from '@/components/xy-dialog/xy-dialog.vue';
  const pageProps = ref(
    <
      {
        type?: 'outLogin';
      }
    >{}
  );
  const isShow = ref(false);
  const gStore = new GStores();
  const loginUtils = new LoginUtils();
  const gform = ref<any>('');
  const formData = ref({});

  let formList: TInstance[] = [
    {
      label: '真实姓名',
      field: 'input-text',
      disabled: true,
      key: 'name',
      isForShow: true,
    },

    {
      label: '性别',
      field: 'input-text',
      key: 'sex',
      disabled: true,
      isForShow: true,
    },

    {
      label: '证件号码',
      field: 'input-text',
      disabled: true,
      key: 'idNo',
      isForShow: true,
    },

    {
      label: '手机号',
      field: 'input-text',
      disabled: true,
      key: 'cellPhoneNum',
      isForShow: true,
    },
  ];

  const handlerClick = () => {
    if (pageProps.value.type === 'outLogin') {
      outLogin({
        isGoLoginPage: true,
      });
    } else {
      isShow.value = true;
    }
  };

  const deletePat = async () => {
    // uni.reLaunch({
    //   url: '/pagesA/medicalCardMan/medicalCardMan'
    // });
    await loginUtils.logoutUser();
    gStore.messageStore.showMessage('注销账号成功', 1000, {
      closeCallBack: () => {
        loginUtils.outLogin({
          isHideMessage: true,
          isGoLoginPage: true,
        });
      },
    });
  };

  onMounted(() => {
    const { name, sex, idNo, cellPhoneNum } = gStore.userStore;

    formData.value = {
      name,
      sex,
      idNo,
      cellPhoneNum,
    };

    nextTick(() => {
      gform.value.setList(formList);
    });
  });

  onLoad((opt = {}) => {
    pageProps.value = opt;
  });
</script>

<style lang="scss" scoped>
  .del-btn {
    color: var(--hr-error-color-6);
    font-weight: 600;

    background-color: var(--h-color-white);
    display: flex;
    justify-content: center;
    margin-top: 16rpx;
    padding: 23rpx 0;
    border-bottom: 1rpx solid var(--hr-neutral-color-2);
    border-radius: 0;
  }
</style>
