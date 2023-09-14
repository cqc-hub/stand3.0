<template>
  <view>
    <view v-if="gStores.globalStore.isLogin || disabled">
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
        <view class="my-disabled">
          <slot />
        </view>
      </button>
    </block>
  </view>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import { handlerLogin, GStores, routerJump } from '@/utils';
  import { useRouterStore } from '@/stores';
  import globalGl from '@/config/global';

  const gStores = new GStores();
  const routeStore = useRouterStore();

  const props = defineProps<{
    patient?: boolean;
    disabled?: boolean;
  }>();
  const emits = defineEmits(['handler-next', 'handler-login']);

  const _env = ref<'wx' | 'alipay' | 'h5' | 'tt'>('wx');

  // #ifdef MP-ALIPAY
  _env.value = 'alipay';
  // #endif

  // #ifdef H5
  _env.value = 'h5';
  // #endif

  // #ifdef MP-TOUTIAO
  _env.value = 'tt';
  // #endif

  const getOpenType = computed(() => {
    switch (_env.value) {
      case 'wx':
        return 'getPhoneNumber';

      case 'tt':
        return 'getPhoneNumber';

      case 'alipay':
        return 'getAuthorize';
      default:
        return '';
    }
  });

  const handlerClick = (e) => {
    if (['h5'].includes(_env.value)) {
      goLogin(e);
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
    await handlerLogin(e);
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
    padding: 0;
    margin: 0;
    border: none;
    background: transparent;

    display: inline-block;
    line-height: inherit;
    height: 100%;
    width: 100%;
    vertical-align: middle;
    font-size: var(--hr-font-size-base);
    color: var(--hr-neutral-color-10);

    &::after {
      border: none;
    }
  }
</style>
