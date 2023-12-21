<template>
  <view class="container flex-normal g-footer pb24">
    <view
      v-for="(btn, idx) in btns"
      :key="btn.key"
      :class="{
        [idx > iconForward ? 'flex2' : 'flex1']: 1,
        ['flex-column']: btns.length > 3,
      }"
      @click="itemClick(btn)"
      class="flex-normal color-444 item"
    >
      <view
        v-if="btn.ico && idx <= iconForward"
        :class="{
          [btn.ico]: 1,
        }"
        class="icon-font ico_share-blue mb4"
      />
      <view
        :class="{
          ['f26']: idx <= iconForward,
          ['f32']: btns.length <= 3,
          ['btn']: idx > iconForward,
          ['btn-primary']: idx === btns.length - 1,
          ['color-444 btn-plain btn-border']: idx !== btns.length - 1,
        }"
        class="title text-no-wrap"
      >
        {{ btn.text }}
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import { useTBanner } from '@/utils';

  const props = defineProps<{
    addition: BaseObject;
  }>();
  const emits = defineEmits(['btn-click']);

  const iconForward = computed(() => {
    if (btns.value.length > 3) {
      return 1;
    } else {
      return 100;
    }
  });

  const compareBtn = (prop: string[], key: string) => {
    return prop.every((p) => !!props.addition[p]);
  };

  const itemClick = (btn: (typeof _btns)[number]) => {
    emits('btn-click', btn);

    if (btn.key === 'reOrder') {
      useTBanner(
        {
          type: 'self',
          path: 'pagesA/MyRegistration/order',
          addition: {
            deptId: 'hosDeptId',
            hosId: 'hosId',
            deptName: 'deptName',
          },
        },
        'navigateTo',
        props.addition
      );
    }
  };

  const _btns = <const>[
    {
      text: '咨询医生',
      ico: 'ico_doctor-blue',
      key: 'askDoc',
      needKeys: ['isDoctorCard', 'applyDocId', 'deptId'],
    },

    {
      text: '复诊预约',
      ico: 'ico_hospital',
      key: 'reOrder',
      needKeys: ['deptId', 'hosId', 'deptName'],
    },

    {
      text: '下载报告',
      ico: 'ico_download-blue',
      key: 'downReport',
      needKeys: ['isDownloadRepor', 'isGraphic'],
    },

    {
      text: '分享报告',
      ico: 'ico_share-blue',
      key: 'shareReport',
      needKeys: ['_local'],
    },
  ];

  const btns = computed(() =>
    // @ts-expect-error
    _btns.filter((btn) => compareBtn(btn.needKeys || [], btn.key))
  );
</script>

<style lang="scss" scoped>
  .btn {
    padding: 10upx 16upx;
  }

  .container {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 2;
  }

  .item {
    justify-content: center;
    min-height: 88rpx;

    .icon-font {
      height: 44rpx;
      width: 44rpx;
    }
  }
</style>
