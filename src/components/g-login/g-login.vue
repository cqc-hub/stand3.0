<template>
  <view>
    <view v-if="gStores.globalStore.isLogin || disabled">
      <slot />
    </view>

    <block v-else>
      <button
        :open-type="_env === 'wx' && 'getPhoneNumber'"
        @getphonenumber="goLogin"
        @click="handlerClick"
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
  import { defineComponent, ref } from 'vue';
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

  const _env = ref<'wx' | 'alipay' | 'h5'>('wx');

  // #ifdef MP-ALIPAY
  _env.value = 'alipay';
  // #endif

  // #ifdef H5
  _env.value = 'h5';
  // #endif

  const handlerClick = (e) => {
    if (_env.value === 'h5' || _env.value === 'alipay') {
      goLogin(e);
    }
  };

  const goLogin = async (e: any) => {
    const pages = getCurrentPages();
    const fullPathNow = (pages[pages.length - 1] as any).$page
      .fullPath as string;

    routeStore.receiveQuery({
      _url: encodeURIComponent(fullPathNow),
    });

    emits('handler-login');
    await handlerLogin(e);
    nextStep();
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
