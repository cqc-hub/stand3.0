<template>
  <view class="w100p h100p">
    <view class="w100p h100p" v-if="gStores.globalStore.isLogin || disabled">
      <slot />
    </view>

    <block v-else>
      <button
        :open-type="getOpenType"
        @getphonenumber="goLogin"
        @getAuthorize="goLogin"
        @click="handlerClick"
        @error="handlerError"
        scope="phoneNumber"
        class="login-btn"
      >
        <view class="my-disabled w100p h100p">
          <slot />
        </view>
      </button>
    </block>
  </view>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import { handlerLogin, GStores, cacheUtil } from '@/utils';
  import { useRouterStore } from '@/stores';
  import globalGl from '@/config/global';

  const gStores = new GStores();
  const routeStore = useRouterStore();

  const props = defineProps<{
    patient?: boolean;
    disabled?: boolean;
    onlyLogin?: boolean;
  }>();
  const emits = defineEmits(['handler-next', 'handler-login']);

  const _env = ref<'wx' | 'alipay' | 'h5' | 'tt' | 'harmony'>('wx');

  const isAliAuthBase = ref(globalGl.sConfig.login?.isAliAuthBase === '1');

  // #ifdef MP-ALIPAY
  _env.value = 'alipay';
  // #endif

  // #ifdef H5
  _env.value = 'h5';
  // #endif

  // #ifdef MP-TOUTIAO
  _env.value = 'tt';
  // #endif

  // #ifdef MP-HARMONY
  _env.value = 'harmony';
  // #endif

  const getOpenType = computed(() => {
    switch (_env.value) {
      case 'wx':
        return 'getPhoneNumber';

      case 'tt':
        return 'getPhoneNumber';

      case 'alipay':
        if (isAliAuthBase.value) {
          return 'getAuthorize';
        }

      default:
        return '';
    }
  });

  const handlerClick = (e) => {
    if (['h5'].includes(_env.value)) {
      goLogin(e);
    } else if (_env.value === 'alipay') {
      if (!isAliAuthBase.value) {
        goLogin(e);
      }
    }
  };

  const goLogin = async (e: any) => {
    const pages = getCurrentPages();
    const fullPathNow = (pages[pages.length - 1] as any).$page
      .fullPath as string;

    if (
      !(
        fullPathNow.startsWith('/pages/home/my') ||
        fullPathNow.startsWith('/pages/home/home')
      )
    ) {
      routeStore.receiveQuery({
        _url: encodeURIComponent(fullPathNow),
      });
    }

    emits('handler-login');
    await handlerLogin({
      ...(e || {}),
      onlyLogin: props.onlyLogin,
    });
    nextStep();
  };

  const handlerError = () => {
    gStores.messageStore.showMessage('授权失败, 请重新登录', 3000);
  };

  const nextStep = () => {
    if (props.patient) {
      if (!gStores.userStore.patList.length) {
        uni.reLaunch({
          url: globalGl.addPersonUrl,
        });
        throw new Error('需要就诊人[g-login]');
      }
    }

    emits('handler-next');
  };
</script>

<style lang="scss" scoped>
  .login-btn {
    all: unset;
    display: inherit;
    height: 100%;
    width: 100%;
    font-size: inherit;
    color: inherit;

    &::after,
    &::before {
      all: unset;
    }
  }
</style>
